import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-title">NFL Analytics Platform</h1>
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link 
            to="/visualizer" 
            className={location.pathname === '/visualizer' ? 'nav-link active' : 'nav-link'}
          >
            Play Visualizer
          </Link>
          <Link 
            to="/analytics" 
            className={location.pathname === '/analytics' ? 'nav-link active' : 'nav-link'}
          >
            Analytics Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;