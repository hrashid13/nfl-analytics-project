import React, { useState, useEffect } from 'react';

const RouteView = ({ trackingData }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const maxFrame = trackingData && trackingData.length > 0 
    ? Math.max(...trackingData.map(t => t.frame_id)) 
    : 1;

  useEffect(() => {
    if (isPlaying && trackingData && trackingData.length > 0) {
      const interval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= maxFrame) {
            setIsPlaying(false);
            return maxFrame;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, maxFrame, trackingData]);

  if (!trackingData || trackingData.length === 0) {
    return <div>No route data available</div>;
  }

  const currentFrameData = trackingData.filter(t => t.frame_id === currentFrame);

  const fieldWidth = 600;
  const fieldHeight = 300;
  const yardToPixelX = fieldWidth / 120;
  const yardToPixelY = fieldHeight / 53.3;

  // Find which players are in output data (these are the relevant players)
  const outputPlayers = new Set();
  trackingData.forEach(point => {
    if (point.data_source === 'output') {
      outputPlayers.add(point.nfl_id);
    }
  });

  // Find the targeted offensive player (should be only one offensive player in output data)
  const targetedPlayer = trackingData.find(p => 
    p.data_source === 'output' && p.player_side === 'Offense'
  );
  const targetedPlayerId = targetedPlayer ? targetedPlayer.nfl_id : null;

  const getPlayerColor = (player) => {
    // Highlight the targeted player in green
    if (player.nfl_id === targetedPlayerId) {
      return '#00FF00';
    }
    
    if (player.player_side === 'Offense') {
      return '#FFD700';
    } else if (player.player_side === 'Defense') {
      return '#DC143C';
    } else {
      return '#999999';
    }
  };

  const playerRoutes = {};
  trackingData.forEach(point => {
    if (!playerRoutes[point.nfl_id]) {
      playerRoutes[point.nfl_id] = {
        name: point.player_name,
        position: point.player_position,
        side: point.player_side,
        points: []
      };
    }
    playerRoutes[point.nfl_id].points.push({ x: point.x, y: point.y, frame: point.frame_id });
  });

  // Determine if we're in "ball in air" phase
  const isOutputPhase = trackingData.some(p => p.frame_id === currentFrame && p.data_source === 'output');

  return (
    <div>
      <h4 style={{ marginBottom: '10px' }}>
        Route & Coverage (Frame {currentFrame} / {maxFrame})
        {isOutputPhase && (
          <span style={{
            marginLeft: '15px',
            backgroundColor: '#ffc107',
            color: '#000',
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            BALL IN AIR
          </span>
        )}
      </h4>
      <svg 
        width={fieldWidth} 
        height={fieldHeight} 
        style={{ border: '2px solid white', backgroundColor: '#2d5016' }}
      >
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map(yard => (
          <g key={yard}>
            <line
              x1={yard * yardToPixelX}
              y1={0}
              x2={yard * yardToPixelX}
              y2={fieldHeight}
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
            />
            <text
              x={yard * yardToPixelX + 5}
              y={15}
              fill="white"
              fontSize="10"
            >
              {yard}
            </text>
          </g>
        ))}

        {Object.entries(playerRoutes).map(([nflId, route]) => {
          const relevantPoints = route.points.filter(p => p.frame <= currentFrame);
          const isTargeted = parseInt(nflId) === targetedPlayerId;
          const color = isTargeted ? '#00FF00' : (route.side === 'Offense' ? '#FFD700' : '#DC143C');
          
          if (relevantPoints.length < 2) return null;
          
          const pathData = relevantPoints.map((point, idx) => {
            const x = point.x * yardToPixelX;
            const y = point.y * yardToPixelY;
            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');

          return (
            <g key={nflId}>
              <path
                d={pathData}
                stroke={color}
                strokeWidth={isTargeted ? 3 : 2}
                fill="none"
                opacity={isTargeted ? 0.9 : 0.6}
              />
            </g>
          );
        })}

        {currentFrameData.map((player, index) => {
          const x = player.x * yardToPixelX;
          const y = player.y * yardToPixelY;
          const color = getPlayerColor(player);
          const isTargeted = player.nfl_id === targetedPlayerId;

          return (
            <g key={`${player.nfl_id}-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={isTargeted ? 7 : 5}
                fill={color}
                stroke="white"
                strokeWidth={isTargeted ? 2 : 1}
              />
              <text
                x={x}
                y={y - (isTargeted ? 10 : 8)}
                fill="white"
                fontSize={isTargeted ? 10 : 8}
                textAnchor="middle"
                fontWeight={isTargeted ? 'bold' : 'normal'}
              >
                {player.player_position}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ padding: '8px 16px', fontSize: '14px', marginRight: '10px' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          onClick={() => { setCurrentFrame(1); setIsPlaying(false); }}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="range"
          min="1"
          max={maxFrame}
          value={currentFrame}
          onChange={(e) => {
            setCurrentFrame(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <span><span style={{ color: '#00FF00' }}>●</span> Targeted Player</span>
          <span><span style={{ color: '#FFD700' }}>●</span> Other Offense</span>
          <span><span style={{ color: '#DC143C' }}>●</span> Defense</span>
        </div>
      </div>
    </div>
  );
};

export default RouteView;