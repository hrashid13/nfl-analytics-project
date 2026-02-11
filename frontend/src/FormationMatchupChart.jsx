import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

function FormationMatchupChart({ data }) {
  // Get unique formations and coverages for grouping
  const formations = [...new Set(data.map(d => d.offense_formation))].slice(0, 6);
  
  // Prepare data for grouped bar chart
  const chartData = formations.map(formation => {
    const formationData = { formation };
    data.filter(d => d.offense_formation === formation).forEach(item => {
      formationData[item.team_coverage_type] = item.avg_epa;
    });
    return formationData;
  });

  // Get unique coverage types for bars
  const coverageTypes = [...new Set(data.map(d => d.team_coverage_type))];
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const coverage = payload[0].dataKey;
      const epa = payload[0].value;
      const matchup = data.find(d => d.offense_formation === label && d.team_coverage_type === coverage);
      
      if (!matchup) return null;
      
      return (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '6px',
          padding: '12px',
          color: '#fff'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '14px' }}>
            {label} vs {coverage}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            Plays: {matchup.plays}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            Comp %: {matchup.completion_pct}%
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            Avg Yards: {matchup.avg_yards}
          </p>
          <p style={{ 
            margin: '4px 0', 
            fontSize: '13px', 
            color: epa > 0 ? '#00cc66' : '#FF8042',
            fontWeight: 'bold'
          }}>
            EPA: {epa}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px' }}>
        Formation vs Coverage EPA
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="formation" 
            stroke="#999"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            stroke="#999"
            label={{ value: 'EPA', angle: -90, position: 'insideLeft', style: { fill: '#999', fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {coverageTypes.map((coverage, index) => (
            <Bar 
              key={coverage} 
              dataKey={coverage} 
              fill={colors[index % colors.length]}
              name={coverage}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        Top matchups by play count • Green EPA = good for offense
      </div>
    </div>
  );
}

export default FormationMatchupChart;
