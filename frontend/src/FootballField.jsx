import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FootballField = ({ gameId, playId }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/play/${gameId}/${playId}/tracking`)
      .then(response => {
        console.log('Tracking data received:', response.data);
        setTrackingData(response.data);
        setCurrentFrame(1);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tracking data:', err);
        setLoading(false);
      });
  }, [gameId, playId]);

  useEffect(() => {
    if (isPlaying && trackingData) {
      const interval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= trackingData.total_frames) {
            setIsPlaying(false);
            return trackingData.total_frames;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, trackingData]);

  if (loading) {
    return <div>Loading play data...</div>;
  }

  if (!trackingData) {
    return <div>No tracking data available</div>;
  }

  const currentFrameData = trackingData.tracking.filter(
    t => t.frame_id === currentFrame
  );

  console.log(`Frame ${currentFrame} has ${currentFrameData.length} players`);

  const fieldWidth = 800;
  const fieldHeight = 400;
  const yardToPixelX = fieldWidth / 120;
  const yardToPixelY = fieldHeight / 53.3;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentFrame(1);
    setIsPlaying(false);
  };

  const getPlayerColor = (player) => {
    if (player.player_side === 'Offense') {
      switch(player.player_position) {
        case 'WR': return '#4169E1';
        case 'TE': return '#FFA500';
        case 'RB': return '#00CED1';
        case 'FB': return '#00CED1';
        case 'QB': return '#FF1493';
        default: return '#FFD700';
      }
    } else if (player.player_side === 'Defense') {
      return '#DC143C';
    } else {
      return '#999999';
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Game {gameId} - Play {playId} - Frame {currentFrame} / {trackingData.total_frames}</h3>
      <p>Players on field: {currentFrameData.length}</p>
      
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
              y={20}
              fill="white"
              fontSize="12"
            >
              {yard}
            </text>
          </g>
        ))}

        {currentFrameData.map((player, index) => {
          const x = player.x * yardToPixelX;
          const y = player.y * yardToPixelY;
          const color = getPlayerColor(player);

          return (
            <g key={`${player.nfl_id}-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={6}
                fill={color}
                stroke="white"
                strokeWidth="1"
              />
              <text
                x={x}
                y={y - 10}
                fill="white"
                fontSize="10"
                textAnchor="middle"
              >
                {player.player_position}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handlePlayPause}
          style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          onClick={handleReset}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="range"
          min="1"
          max={trackingData.total_frames}
          value={currentFrame}
          onChange={(e) => {
            setCurrentFrame(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          style={{ width: '800px' }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Legend:</h4>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <span><span style={{ color: '#FFD700' }}>●</span> WR</span>
          <span><span style={{ color: '#FFA500' }}>●</span> TE</span>
          <span><span style={{ color: '#00CED1' }}>●</span> RB/FB</span>
          <span><span style={{ color: '#FF1493' }}>●</span> QB</span>
          <span><span style={{ color: '#4169E1' }}>●</span> Other Offense</span>
          <span><span style={{ color: '#DC143C' }}>●</span> Defense</span>
        </div>
      </div>
    </div>
  );
};

export default FootballField;