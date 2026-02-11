import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeedChart from './SpeedChart';
import RouteAnalysisChart from './RouteAnalysisChart';
import DownDistanceHeatmap from './DownDistanceHeatmap';
import FormationMatchupChart from './FormationMatchupChart';
import './AnalyticsDashboard.css';

function AnalyticsDashboard() {
  const [speedData, setSpeedData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [formationData, setFormationData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('side');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  useEffect(() => {
    // Fetch teams list on mount
    axios.get('https://nfl-analytics-production.up.railway.app/api/analytics/teams')
      .then(response => {
        setTeams(response.data);
      })
      .catch(err => {
        console.error('Error fetching teams:', err);
      });
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [filterType, selectedFilter, selectedWeek, selectedTeam]);

  const fetchAllData = () => {
    fetchSpeedData();
    fetchRouteData();
    fetchHeatmapData();
    fetchFormationData();
  };

  const fetchSpeedData = () => {
    setLoading(true);
    
    let url = 'https://nfl-analytics-production.up.railway.app/api/analytics/speed-stats';
    const params = [];
    
    if (selectedFilter !== 'all') {
      if (filterType === 'side') {
        params.push(`side=${selectedFilter}`);
      } else {
        params.push(`position_group=${selectedFilter}`);
      }
    }
    
    if (selectedWeek !== 'all') {
      params.push(`week=${selectedWeek}`);
    }
    
    if (selectedTeam !== 'all') {
      params.push(`team=${selectedTeam}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    axios.get(url)
      .then(response => {
        setSpeedData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching speed data:', err);
        setLoading(false);
      });
  };

  const fetchRouteData = () => {
    let url = 'https://nfl-analytics-production.up.railway.app/api/analytics/route-analysis';
    const params = [];
    
    if (selectedWeek !== 'all') {
      params.push(`week=${selectedWeek}`);
    }
    
    if (selectedTeam !== 'all') {
      params.push(`team=${selectedTeam}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    axios.get(url)
      .then(response => {
        setRouteData(response.data);
      })
      .catch(err => {
        console.error('Error fetching route data:', err);
      });
  };

  const fetchHeatmapData = () => {
    let url = 'https://nfl-analytics-production.up.railway.app/api/analytics/down-distance-heatmap';
    const params = [];
    
    if (selectedWeek !== 'all') {
      params.push(`week=${selectedWeek}`);
    }
    
    if (selectedTeam !== 'all') {
      params.push(`team=${selectedTeam}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    axios.get(url)
      .then(response => {
        setHeatmapData(response.data);
      })
      .catch(err => {
        console.error('Error fetching heatmap data:', err);
      });
  };

  const fetchFormationData = () => {
    let url = 'https://nfl-analytics-production.up.railway.app/api/analytics/formation-matchup';
    const params = [];
    
    if (selectedWeek !== 'all') {
      params.push(`week=${selectedWeek}`);
    }
    
    if (selectedTeam !== 'all') {
      params.push(`team=${selectedTeam}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    axios.get(url)
      .then(response => {
        setFormationData(response.data);
      })
      .catch(err => {
        console.error('Error fetching formation data:', err);
      });
  };

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <p className="dashboard-subtitle">Comprehensive Performance Metrics</p>
      </header>

      <div className="filter-panel">
        <div className="filter-group">
          <label>Filter By:</label>
          <select 
            value={filterType} 
            onChange={(e) => {
              setFilterType(e.target.value);
              setSelectedFilter('all');
            }}
            className="filter-select"
          >
            <option value="side">Side on Play (includes trick plays)</option>
            <option value="position_group">Position Group (pure O/D split)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{filterType === 'side' ? 'Side:' : 'Group:'}</label>
          <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Players</option>
            <option value="offense">Offense</option>
            <option value="defense">Defense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Team:</label>
          <select 
            value={selectedTeam} 
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Teams</option>
            {teams.map((team, index) => (
              <option key={index} value={team.team_abbr}>
                {team.team_abbr}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Week:</label>
          <select 
            value={selectedWeek} 
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Weeks</option>
            {[...Array(18)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Week {i + 1}</option>
            ))}
          </select>
        </div>

        <div className="filter-info">
          <span>
            {speedData.length} positions • {' '}
            {speedData.reduce((sum, pos) => sum + pos.num_frames, 0).toLocaleString()} total frames
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading" style={{ marginTop: '40px' }}>Loading analytics data...</div>
      ) : (
        <div className="charts-grid">
          <div className="chart-card">
            {speedData.length === 0 ? (
              <div className="no-data">No speed data available</div>
            ) : (
              <SpeedChart data={speedData} />
            )}
          </div>

          <div className="chart-card">
            {routeData.length === 0 ? (
              <div className="no-data">No route data available</div>
            ) : (
              <RouteAnalysisChart data={routeData} />
            )}
          </div>

          <div className="chart-card">
            {heatmapData.length === 0 ? (
              <div className="no-data">No situational data available</div>
            ) : (
              <DownDistanceHeatmap data={heatmapData} />
            )}
          </div>

          <div className="chart-card">
            {formationData.length === 0 ? (
              <div className="no-data">No formation data available</div>
            ) : (
              <FormationMatchupChart data={formationData} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;