import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SpeedChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '6px',
          padding: '12px',
          color: '#fff'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '14px' }}>
            {data.position}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#0066cc' }}>
            Avg Speed: {data.avg_speed} mph
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#00cc66' }}>
            Max Speed: {data.max_speed} mph
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#999' }}>
            Frames: {data.num_frames.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px' }}>
        Speed by Position
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="position" 
            stroke="#999"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            stroke="#999"
            label={{ value: 'Speed (mph)', angle: -90, position: 'insideLeft', style: { fill: '#999', fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avg_speed" fill="#0066cc" name="Average Speed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpeedChart;