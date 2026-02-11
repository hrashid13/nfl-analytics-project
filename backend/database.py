import psycopg2
from psycopg2.extras import RealDictCursor
from config import Config
import os

def get_db_connection():
    """Create and return a database connection"""
    
    # Check if running on Railway (has RAILWAY_ENVIRONMENT variable)
    is_railway = os.getenv('RAILWAY_ENVIRONMENT') is not None
    
    conn = psycopg2.connect(
        host=Config.DB_HOST,
        database=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        port=Config.DB_PORT,
        cursor_factory=RealDictCursor,
        sslmode='require' if is_railway else 'prefer',
        connect_timeout=10
    )
    return conn