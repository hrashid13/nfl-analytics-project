import React from 'react';

const PlayInfoPanel = ({ playInfo }) => {
  if (!playInfo) {
    return <div>No play information available</div>;
  }

  const getResultBadgeColor = (result) => {
    switch(result) {
      case 'C': return '#28a745';
      case 'I': return '#dc3545';
      case 'IN': return '#ffc107';
      case 'R': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getResultText = (result) => {
    switch(result) {
      case 'C': return 'Complete';
      case 'I': return 'Incomplete';
      case 'IN': return 'Interception';
      case 'R': return 'Run';
      default: return result;
    }
  };

  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #444'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#61dafb' }}>
        Play Information
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h4 style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>GAME SITUATION</h4>
          <div style={{ fontSize: '18px', marginBottom: '5px' }}>
            <strong>{playInfo.visitor_team_abbr}</strong> @ <strong>{playInfo.home_team_abbr}</strong>
          </div>
          <div style={{ fontSize: '16px', color: '#bbb', marginBottom: '5px' }}>
            Week {playInfo.week} - Q{playInfo.quarter} {playInfo.game_clock}
          </div>
          <div style={{ fontSize: '16px', color: '#bbb', marginBottom: '10px' }}>
            Score: {playInfo.visitor_team_abbr} {playInfo.pre_snap_visitor_score} - {playInfo.home_team_abbr} {playInfo.pre_snap_home_score}
          </div>
          <div style={{ fontSize: '18px', color: '#fff', marginBottom: '10px' }}>
            <strong>{playInfo.down}{getOrdinal(playInfo.down)} & {playInfo.yards_to_go}</strong> at {playInfo.yardline_side} {playInfo.yardline_number}
          </div>
          
          {playInfo.pass_result && (
            <div style={{ marginTop: '10px' }}>
              <span style={{
                backgroundColor: getResultBadgeColor(playInfo.pass_result),
                padding: '5px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                marginRight: '10px'
              }}>
                {getResultText(playInfo.pass_result)}
              </span>
              {playInfo.yards_gained !== null && (
                <span style={{ fontSize: '16px' }}>
                  {playInfo.yards_gained > 0 ? '+' : ''}{playInfo.yards_gained} yards
                </span>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>FORMATION & COVERAGE</h4>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#888' }}>Offense:</span> <strong>{playInfo.offense_formation || 'N/A'}</strong>
            {playInfo.receiver_alignment && <span style={{ color: '#888' }}> ({playInfo.receiver_alignment})</span>}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#888' }}>Defense:</span> <strong>{playInfo.team_coverage_type || 'N/A'}</strong>
            {playInfo.team_coverage_man_zone && <span style={{ color: '#888' }}> ({playInfo.team_coverage_man_zone})</span>}
          </div>
          {playInfo.defenders_in_the_box !== null && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#888' }}>Box:</span> <strong>{playInfo.defenders_in_the_box} defenders</strong>
            </div>
          )}
          {playInfo.route_of_targeted_receiver && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#888' }}>Route:</span> <strong>{playInfo.route_of_targeted_receiver}</strong>
            </div>
          )}
          {playInfo.play_action && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ 
                backgroundColor: '#ffc107', 
                color: '#000',
                padding: '2px 8px', 
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                PLAY ACTION
              </span>
            </div>
          )}
        </div>
      </div>

      {playInfo.play_description && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #444' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>PLAY DESCRIPTION</div>
          <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#bbb' }}>
            {playInfo.play_description}
          </div>
        </div>
      )}

      {playInfo.expected_points_added !== null && playInfo.expected_points_added !== undefined && (
  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #444' }}>
    <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>ADVANCED STATS</div>
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <span style={{ color: '#888' }}>EPA:</span> <strong style={{ color: parseFloat(playInfo.expected_points_added) > 0 ? '#28a745' : '#dc3545' }}>
          {parseFloat(playInfo.expected_points_added) > 0 ? '+' : ''}{parseFloat(playInfo.expected_points_added).toFixed(2)}
        </strong>
      </div>
      {playInfo.pre_snap_home_team_win_probability !== null && playInfo.pre_snap_home_team_win_probability !== undefined && (
        <div>
          <span style={{ color: '#888' }}>Win Prob:</span> <strong>
            {playInfo.home_team_abbr} {(parseFloat(playInfo.pre_snap_home_team_win_probability) * 100).toFixed(1)}%
          </strong>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
};

const getOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

export default PlayInfoPanel;