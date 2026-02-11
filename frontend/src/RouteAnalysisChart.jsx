import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

function RouteAnalysisChart({ data }) {
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF6B9D', '#C0C0C0', '#9C27B0'
  ];

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
            {data.route}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            Attempts: {data.attempts}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#00cc66' }}>
            Completion: {data.completion_pct}%
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            Avg Yards: {data.avg_yards}
          </p>
          <p style={{ 
            margin: '4px 0', 
            fontSize: '13px', 
            color: data.avg_epa > 0 ? '#00cc66' : '#FF8042'
          }}>
            EPA: {data.avg_epa}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = payload[0].payload.total;
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '6px',
          padding: '12px',
          color: '#fff'
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px' }}>{data.name}</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>Attempts: {data.value}</p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#0066cc' }}>{percent}% of routes</p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for pie chart percentages
  const totalAttempts = data.reduce((sum, route) => sum + route.attempts, 0);
  const dataWithTotal = data.map(item => ({ ...item, total: totalAttempts }));

  return (
    <div>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px' }}>
        Route Analysis
      </h3>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
        {/* Pie Chart - Route Frequency */}
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#999', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>
            Route Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataWithTotal}
                dataKey="attempts"
                nameKey="route"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ route, percent }) => percent > 0.05 ? `${route}` : ''}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Completion Rate */}
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#999', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>
            Success Rate
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="route" 
                stroke="#999"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                stroke="#999"
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completion_pct" fill="#00cc66" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RouteAnalysisChart;