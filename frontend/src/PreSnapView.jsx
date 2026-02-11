import React from 'react';

const PreSnapView = ({ trackingData }) => {
  if (!trackingData || trackingData.length === 0) {
    return <div>No tracking data available</div>;
  }

  const frame1Data = trackingData.filter(t => t.frame_id === 1);

  const fieldWidth = 600;
  const fieldHeight = 300;
  const yardToPixelX = fieldWidth / 120;
  const yardToPixelY = fieldHeight / 53.3;

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
    <div>
      <h4 style={{ marginBottom: '10px' }}>Pre-Snap Formation (Frame 1)</h4>
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

        {frame1Data.map((player, index) => {
          const x = player.x * yardToPixelX;
          const y = player.y * yardToPixelY;
          const color = getPlayerColor(player);

          return (
            <g key={`${player.nfl_id}-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={5}
                fill={color}
                stroke="white"
                strokeWidth="1"
              />
              <text
                x={x}
                y={y - 8}
                fill="white"
                fontSize="8"
                textAnchor="middle"
              >
                {player.player_position}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div style={{ marginTop: '10px', fontSize: '12px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <span><span style={{ color: '#4169E1 ' }}>●</span> WR</span>
          <span><span style={{ color: '#FFA500' }}>●</span> TE</span>
          <span><span style={{ color: '#00CED1' }}>●</span> RB/FB</span>
          <span><span style={{ color: '#FF1493' }}>●</span> QB</span>
          <span><span style={{ color: '#FFD700' }}>●</span> Other O</span>
          <span><span style={{ color: '#DC143C' }}>●</span> Defense</span>
        </div>
      </div>
    </div>
  );
};

export default PreSnapView;