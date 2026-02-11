import React from 'react';

function DownDistanceHeatmap({ data }) {
  // Organize data into matrix format
  const downs = [1, 2, 3, 4];
  const distances = ['Short (1-3)', 'Medium (4-6)', 'Long (7-10)', 'Very Long (11+)'];
  
  // Create lookup map
  const dataMap = {};
  data.forEach(item => {
    const key = `${item.down}-${item.distance}`;
    dataMap[key] = item;
  });

  // Function to get color based on EPA
  const getColor = (epa) => {
    if (epa === null || epa === undefined) return '#2a2a2a';
    
    // Color scale: red (negative) to yellow (neutral) to green (positive)
    if (epa >= 0.3) return '#00cc66';      // Strong positive - bright green
    if (epa >= 0.15) return '#66dd88';     // Moderate positive - light green
    if (epa >= 0.05) return '#99ee99';     // Slight positive - pale green
    if (epa >= -0.05) return '#ffdd66';    // Neutral - yellow
    if (epa >= -0.15) return '#ffaa44';    // Slight negative - orange
    if (epa >= -0.3) return '#ff8844';     // Moderate negative - dark orange
    return '#ff4444';                       // Strong negative - red
  };

  const CustomTooltip = ({ cell }) => {
    if (!cell) return null;
    
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #444',
        borderRadius: '6px',
        padding: '12px',
        color: '#fff',
        minWidth: '180px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '14px' }}>
          {cell.down}{cell.down === 1 ? 'st' : cell.down === 2 ? 'nd' : cell.down === 3 ? 'rd' : 'th'} & {cell.distance}
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>
          Plays: {cell.plays}
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>
          Completion: {cell.completion_pct}%
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px' }}>
          Avg Yards: {cell.avg_yards}
        </p>
        <p style={{ 
          margin: '4px 0', 
          fontSize: '13px',
          fontWeight: 'bold',
          color: cell.avg_epa > 0 ? '#00cc66' : '#ff4444'
        }}>
          EPA: {cell.avg_epa}
        </p>
      </div>
    );
  };

  const [hoveredCell, setHoveredCell] = React.useState(null);
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 });

  const handleMouseEnter = (cell, event) => {
    setHoveredCell(cell);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px' }}>
        Situational Success (EPA)
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0',
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px'
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ width: '80px' }}></div>
          {distances.map(dist => (
            <div 
              key={dist}
              style={{ 
                flex: 1, 
                textAlign: 'center',
                fontSize: '11px',
                color: '#999',
                fontWeight: 'bold'
              }}
            >
              {dist}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {downs.map(down => (
          <div key={down} style={{ display: 'flex', marginBottom: '4px' }}>
            <div style={{ 
              width: '80px', 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '13px',
              color: '#999',
              fontWeight: 'bold'
            }}>
              {down}{down === 1 ? 'st' : down === 2 ? 'nd' : down === 3 ? 'rd' : 'th'} Down
            </div>
            {distances.map(dist => {
              const key = `${down}-${dist}`;
              const cell = dataMap[key];
              const epa = cell ? cell.avg_epa : null;
              
              return (
                <div
                  key={key}
                  style={{
                    flex: 1,
                    height: '60px',
                    backgroundColor: getColor(epa),
                    border: '1px solid #333',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: cell ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    opacity: hoveredCell === cell ? 0.8 : 1
                  }}
                  onMouseEnter={(e) => cell && handleMouseEnter(cell, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {cell && (
                    <>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                        {cell.avg_epa}
                      </div>
                      <div style={{ fontSize: '10px', color: '#fff', opacity: 0.8 }}>
                        {cell.plays} plays
                      </div>
                    </>
                  )}
                  {!cell && (
                    <div style={{ fontSize: '12px', color: '#666' }}>—</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#ff4444', borderRadius: '3px' }}></div>
          <span style={{ fontSize: '11px', color: '#999' }}>Poor EPA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#ffdd66', borderRadius: '3px' }}></div>
          <span style={{ fontSize: '11px', color: '#999' }}>Neutral</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#00cc66', borderRadius: '3px' }}></div>
          <span style={{ fontSize: '11px', color: '#999' }}>Good EPA</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x,
          top: tooltipPos.y,
          transform: 'translate(-50%, -100%)',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <CustomTooltip cell={hoveredCell} />
        </div>
      )}
    </div>
  );
}

export default DownDistanceHeatmap;
