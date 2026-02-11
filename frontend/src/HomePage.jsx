import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">NFL Analytics Platform</h1>
        <p className="hero-subtitle">
          Advanced Performance Analysis & Play Visualization
        </p>
        
        <div className="intro-section">
          <p className="intro-text">
  Hello, my name is Hesham Rashid, this is a portfolio project that I developed to 
  showcase my skills in data engineering and analytics within the context of NFL football. 
  I do want to note that the data in this project is from a Kaggle competition that I found late
  and did not participate in, I just used the data to build this project. The link to the competition
  is here: <a 
    href="https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: '#0066cc', textDecoration: 'underline' }}
  >
    NFL Big Data Bowl 2026
  </a>
</p>
          <p className="intro-text">
            {}
            This platform combines interactive play visualization with comprehensive analytics 
            using Next Gen Stats tracking data from the 2023 NFL season. Explore over 5 million 
            tracking data points to gain insights into player performance, route effectiveness, 
            and situational success rates.
          </p>
          <p className="intro-text">
            {}
            Built as a full-stack data engineering project showcasing PostgreSQL database management, 
            Flask REST API development, and React-based interactive visualizations. The platform 
            demonstrates advanced analytics capabilities including EPA (Expected Points Added) analysis, 
            formation matchup evaluation, and real-time play tracking visualization.
          </p>
          <p className="intro-text">
            {}
            If you would like to see more of my work or get in touch, please visit my portfolio
            at: <a 
    href="https://www.heshamrashid.org/" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: '#0066cc', textDecoration: 'underline' }}
  >
    Personal Portfolio
  </a> 
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="features-section">
        <h2 className="features-title">Explore Features</h2>
        
        <div className="feature-cards">
          {/* Play Visualizer Card */}
          <div className="feature-card" onClick={() => navigate('/visualizer')}>
            <div className="card-icon">📊</div>
            <h3 className="card-title">Play Visualizer</h3>
            <p className="card-description">
              Interactive football field visualization showing player movements, 
              route development, and pre-snap formations with frame-by-frame tracking data.
            </p>
            <div className="card-features">
              <div className="card-feature">✓ Animated route visualization</div>
              <div className="card-feature">✓ Pre-snap formation analysis</div>
              <div className="card-feature">✓ Color-coded position groups</div>
              <div className="card-feature">✓ Play-by-play filtering</div>
            </div>
            <button className="card-button">
              View Plays →
            </button>
          </div>

          {/* Analytics Dashboard Card */}
          <div className="feature-card" onClick={() => navigate('/analytics')}>
            <div className="card-icon">📈</div>
            <h3 className="card-title">Analytics Dashboard</h3>
            <p className="card-description">
              Comprehensive performance metrics dashboard with speed analysis, 
              route effectiveness, situational success rates, and formation matchups.
            </p>
            <div className="card-features">
              <div className="card-feature">✓ Speed metrics by position</div>
              <div className="card-feature">✓ Route frequency & success rates</div>
              <div className="card-feature">✓ Down & distance heatmaps</div>
              <div className="card-feature">✓ Formation vs coverage EPA</div>
            </div>
            <button className="card-button">
              View Analytics →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">5M+</div>
          <div className="stat-label">Tracking Data Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">2023</div>
          <div className="stat-label">NFL Season</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">18</div>
          <div className="stat-label">Weeks of Data</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">4</div>
          <div className="stat-label">Analytics Views</div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="tech-section">
        <h3 className="tech-title">Built With</h3>
        <div className="tech-stack">
          <div className="tech-item">PostgreSQL</div>
          <div className="tech-item">Flask REST API</div>
          <div className="tech-item">React</div>
          <div className="tech-item">Recharts</div>
          <div className="tech-item">Next Gen Stats</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;