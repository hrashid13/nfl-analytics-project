import pandas as pd
import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_values
from config import Config

# Path to supplemental data file
file_path = r'C:\Users\hfras\Desktop\NFL_Data\supplementary_data.csv'  

print("Loading play information data...")

# Read the CSV/Excel file
df = pd.read_excel(file_path) if file_path.endswith('.xlsx') else pd.read_csv(file_path)

print(f"Loaded {len(df)} rows")
print(f"Columns: {df.columns.tolist()}")

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=Config.DB_HOST,
    database=Config.DB_NAME,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD,
    port=Config.DB_PORT
)
cursor = conn.cursor()

# Convert game_id to string to match tracking_data
df['game_id'] = df['game_id'].astype(str)

# Handle NaN values
df = df.where(pd.notnull(df), None)

# Get column names
columns = df.columns.tolist()

# Create INSERT statement
insert_query = sql.SQL("INSERT INTO play_information ({}) VALUES %s ON CONFLICT (game_id, play_id) DO NOTHING").format(
    sql.SQL(', ').join(map(sql.Identifier, columns))
)

# Convert DataFrame to list of tuples
values = [tuple(x) for x in df.to_numpy()]

# Execute batch insert
print("Inserting data into database...")
execute_values(cursor, insert_query, values, page_size=100)
conn.commit()

# Verify
cursor.execute("SELECT COUNT(*) FROM play_information")
count = cursor.fetchone()[0]
print(f"Successfully loaded {count} play records")

# Show sample
cursor.execute("""
    SELECT game_id, play_id, home_team_abbr, visitor_team_abbr, play_description 
    FROM play_information 
    LIMIT 5
""")
print("\nSample data:")
for row in cursor.fetchall():
    print(row)

cursor.close()
conn.close()
print("\nDone!")