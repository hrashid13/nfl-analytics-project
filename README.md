# NFL Analytics Platform

A full-stack web application for analyzing NFL player tracking data from the 2023 season. This platform provides interactive visualizations and comprehensive analytics for route running, defensive coverage, and play-by-play tracking data from the NFL Big Data Bowl 2026 dataset.

## Overview

The NFL Analytics Platform is a professional portfolio project demonstrating end-to-end data engineering and full-stack development skills. It processes over 5 million tracking data points to deliver real-time play visualizations and statistical insights through an interactive web interface.

### Key Features

- **Interactive Play Visualizer**: Dual-panel display showing pre-snap formations and animated route development
- **Comprehensive Analytics Dashboard**: Multiple chart types including speed metrics, route analysis, heatmaps, and formation matchups
- **Real-time Data Processing**: Efficient querying and processing of millions of tracking records
- **Professional UI**: Clean, responsive interface built with React and modern charting libraries
- **RESTful API**: Well-documented Flask backend serving structured JSON endpoints

## Architecture

### Three-Service Cloud Deployment

- **Database Layer**: PostgreSQL database hosting tracking data, play information, and supplemental datasets
- **Backend API**: Flask REST API handling data queries, processing, and business logic
- **Frontend Application**: React-based single-page application with interactive visualizations

### Technology Stack

**Backend**
- Python 3.x
- Flask (REST API framework)
- PostgreSQL (Database)
- psycopg2 (Database adapter)
- pandas (Data processing)

**Frontend**
- React 18
- JavaScript (ES6+)
- Chart.js / Recharts (Data visualization)
- Axios (HTTP client)

**Deployment**
- Railway (Cloud platform)
- PostgreSQL managed database
- Environment-based configuration

## Project Structure

```
nfl-analytics-platform/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Database and app configuration
│   ├── database.py            # Database connection management
│   ├── routes.py              # API endpoint definitions
│   ├── load_output_only.py   # Data loading scripts
│   ├── load_play_info.py     # Play data loading utilities
│   ├── requirements.txt       # Python dependencies
│   └── railway.json           # Railway deployment config
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js            # Main application component
│   │   └── index.js          # Application entry point
│   ├── package.json           # Node.js dependencies
│   └── README.md             # Frontend-specific docs
│
└── README.md                  # This file
```

## Database Schema

### Primary Tables

**tracking_data**
- Stores 5+ million tracking records
- Fields: gameId, playId, nflId, frameId, x, y, s, a, dis, o, dir, event
- Compound primary key: (gameId, playId, nflId, frameId)

**plays**
- Play-level metadata and context
- Fields: gameId, playId, passResult, offenseFormation, defendersInTheBox, etc.

**supplemental_data**
- Additional player and game information
- Fields: player details, positions, route types

## API Endpoints

### Play Data
- `GET /api/plays` - Retrieve available plays with filtering options
- `GET /api/play/<game_id>/<play_id>` - Get detailed tracking data for specific play

### Analytics
- `GET /api/analytics/speed` - Player speed metrics and distributions
- `GET /api/analytics/routes` - Route pattern analysis
- `GET /api/analytics/formations` - Formation matchup statistics

### Health Check
- `GET /api/health` - Service status and database connectivity

## Setup and Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 13+

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
# Create .env file
DATABASE_URL=postgresql://username:password@host:port/database
FLASK_ENV=development
```

5. Load data (if running locally):
```bash
python load_output_only.py
python load_play_info.py
```

6. Run Flask application:
```bash
python app.py
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
```bash
# Create .env file
REACT_APP_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm start
```

## Deployment

The application is deployed on Railway with the following configuration:

1. **Database Service**: PostgreSQL instance with automated backups
2. **Backend Service**: Flask app with automatic scaling
3. **Frontend Service**: Static React build served via CDN

### Environment Variables

**Backend**
- `DATABASE_URL`: PostgreSQL connection string
- `FLASK_ENV`: Environment mode (production/development)

**Frontend**
- `REACT_APP_API_URL`: Backend API base URL

## Data Processing

The platform handles NFL Big Data Bowl 2026 tracking data with the following optimizations:

- **Compound Primary Keys**: Ensures data integrity for tracking records
- **Indexed Queries**: Optimized for gameId/playId lookups
- **Batch Processing**: Efficient loading of millions of records
- **JSON Serialization**: Structured API responses for frontend consumption

## Key Technical Decisions

### Backend Responsibilities
- Database querying and connection management
- Data transformation and aggregation
- Business logic implementation
- RESTful API design

### Frontend Responsibilities
- User interface and interaction
- Data visualization rendering
- Chart library integration
- Responsive design implementation

### Separation of Concerns
- Python/Flask handles all data engineering tasks
- React/JavaScript manages visualization layer
- Clear API contract between services

## Performance Optimizations

- Database indexing on frequently queried fields
- Efficient SQL queries with proper joins
- Frontend component memoization
- Lazy loading for large datasets
- Response caching where appropriate

## Future Enhancements

- Route library feature for receiver-specific route catalogs
- Enhanced filtering and search capabilities
- Player comparison tools
- Season-wide statistical trends
- Machine learning predictions for route outcomes

## Data Source

This project uses data from the NFL Big Data Bowl 2026 Kaggle competition, featuring tracking data from the 2023 NFL season. The dataset includes detailed positional tracking for all players on the field at 10 frames per second.

## License

This is a portfolio project for educational and demonstration purposes.

## Author

Hesham - Data Engineering and Analytics Portfolio Project

## Acknowledgments

- NFL Big Data Bowl 2026 for providing the tracking dataset
- Railway for cloud hosting platform
- React and Flask communities for excellent documentation
