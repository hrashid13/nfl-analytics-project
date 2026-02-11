import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayInfoPanel from './PlayInfoPanel';
import PreSnapView from './PreSnapView';
import RouteView from './RouteView';

function PlayVisualizer() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [plays, setPlays] = useState([]);
  const [selectedPlay, setSelectedPlay] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [playInfo, setPlayInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://nfl-analytics-production.up.railway.app/api/games')
      .then(response => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  }, []);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setSelectedPlay(null);
    setTrackingData(null);
    setPlayInfo(null);
    
    axios.get(`https://nfl-analytics-production.up.railway.app/api/plays?game_id=${gameId}`)
      .then(response => {
        setPlays(response.data);
      })
      .catch(err => {
        console.error('Error fetching plays:', err);
      });
  };

  const handlePlaySelect = (play) => {
    setSelectedPlay(play.play_id);
    setPlayInfo(play);
    
    axios.get(`https://nfl-analytics-production.up.railway.app/api/play/${selectedGame}/${play.play_id}/tracking`)
      .then(response => {
        setTrackingData(response.data.tracking);
      })
      .catch(err => {
        console.error('Error fetching tracking data:', err);
      });
  };

  const getGameDisplay = (game) => {
    if (game.visitor_team_abbr && game.home_team_abbr) {
      return `${game.visitor_team_abbr} @ ${game.home_team_abbr} - Week ${game.week}`;
    }
    return game.game_id;
  };

  const getPlayDisplay = (play) => {
    let display = `Play ${play.play_id}`;
    
    if (play.quarter && play.down) {
      display += ` - Q${play.quarter}, ${play.down}${getOrdinal(play.down)} & ${play.yards_to_go}`;
    }
    
    if (play.yards_gained !== null && play.yards_gained !== undefined) {
      display += ` (${play.yards_gained > 0 ? '+' : ''}${play.yards_gained} yds)`;
    }
    
    return display;
  };

  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#999' }}>Loading games...</div>;
  }

  return (
    <div className="play-visualizer">
      <header className="App-header">
        <h2 style={{ marginTop: '20px' }}>Play Visualizer</h2>
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '10px' }}>Game:</label>
            <select 
              value={selectedGame} 
              onChange={(e) => handleGameSelect(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', minWidth: '300px' }}
            >
              <option value="">Choose a game...</option>
              {games.map((game, index) => (
                <option key={index} value={game.game_id}>
                  {getGameDisplay(game)}
                </option>
              ))}
            </select>
          </div>

          {selectedGame && (
            <div>
              <label style={{ marginRight: '10px' }}>Play:</label>
              <select 
                value={selectedPlay || ''} 
                onChange={(e) => {
                  const play = plays.find(p => p.play_id === parseInt(e.target.value));
                  if (play) handlePlaySelect(play);
                }}
                style={{ padding: '10px', fontSize: '16px', minWidth: '400px' }}
              >
                <option value="">Choose a play...</option>
                {plays.map((play, index) => (
                  <option key={index} value={play.play_id}>
                    {getPlayDisplay(play)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {playInfo && (
          <div style={{ marginTop: '30px', width: '100%', maxWidth: '1200px' }}>
            <PlayInfoPanel playInfo={playInfo} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                {trackingData && <PreSnapView trackingData={trackingData} />}
              </div>
              
              <div style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                {trackingData && <RouteView trackingData={trackingData} />}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default PlayVisualizer;
