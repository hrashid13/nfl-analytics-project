import pandas as pd
import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_values
from config import Config
import glob
import os

# Path to your output CSV files
data_folder = r'C:\Users\hfras\Desktop\NFL_Data'

print("Loading output data...")

# Find all output CSV files
output_files = sorted(glob.glob(os.path.join(data_folder, 'output*.csv')))
print(f"Found {len(output_files)} output files")

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=Config.DB_HOST,
    database=Config.DB_NAME,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD,
    port=Config.DB_PORT
)
cursor = conn.cursor()

total_rows = 0

for file in output_files:
    print(f"\nLoading {os.path.basename(file)}...")
    
    # Read CSV
    df = pd.read_csv(file)
    
    # Convert game_id to string and ensure 10 digits with leading zeros
    df['game_id'] = df['game_id'].astype(str).str.zfill(10)
    
    # Replace NaN with None
    df = df.where(pd.notnull(df), None)
    
    # Get columns
    columns = df.columns.tolist()
    
    # Create INSERT statement
    insert_query = sql.SQL("INSERT INTO output_data ({}) VALUES %s").format(
        sql.SQL(', ').join(map(sql.Identifier, columns))
    )
    
    # Convert to tuples
    values = [tuple(x) for x in df.to_numpy()]
    
    # Insert
    execute_values(cursor, insert_query, values, page_size=1000)
    conn.commit()
    
    print(f"Loaded {len(df):,} rows")
    total_rows += len(df)

print(f"\nTotal rows loaded: {total_rows:,}")

# Verify
cursor.execute("SELECT COUNT(*) FROM output_data")
count = cursor.fetchone()[0]
print(f"Rows in database: {count:,}")

cursor.execute("SELECT DISTINCT game_id FROM output_data ORDER BY game_id LIMIT 5")
print("\nSample game_ids:")
for row in cursor.fetchall():
    print(f"  {row[0]}")

cursor.close()
conn.close()
print("\nDone!")