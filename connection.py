import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     os.getenv("DB_PORT", "5432"),
    "dbname":   os.getenv("DB_NAME", "madhav_pharma"),
    "user":     os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
}


def get_connection():
    """Return a new psycopg2 connection."""
    conn = psycopg2.connect(**DB_CONFIG)
    return conn


def get_cursor(conn):
    """Return a RealDictCursor (rows as dicts)."""
    return conn.cursor(cursor_factory=RealDictCursor)


if __name__ == "__main__":
    try:
        conn = get_connection()
        cur = get_cursor(conn)
        cur.execute("SELECT version();")
        row = cur.fetchone()
        print("Connected to PostgreSQL:", row["version"])
        cur.close()
        conn.close()
    except Exception as e:
        print("Connection failed:", e)
