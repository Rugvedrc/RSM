import os
import pymysql  # Use pymysql instead of mysql-connector
from dotenv import load_dotenv
YOUR_GEMINI_API_KEY='AIzaSyDx9VnS8zuUnPm76ns9B_h6VazTttROhtI'
# Load environment variables
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "bue7t3xueljqxlmfqadr-mysql.services.clever-cloud.com")
DB_NAME = os.getenv("DB_NAME", "bue7t3xueljqxlmfqadr")
DB_USER = os.getenv("DB_USER", "uef1g3etyo0zh2t2")
DB_PASSWORD = os.getenv("DB_PASSWORD", "jeqdOKkYpHHrYYNf2n0R")
DB_PORT = os.getenv("DB_PORT", "3306")

# Ensure pymysql is used as MySQLdb (if needed for compatibility with other libraries)
pymysql.install_as_MySQLdb()

def get_db_connection():
    try:
        print(f"Connecting to {DB_HOST}:{DB_PORT} as {DB_USER}")
        # Use pymysql here instead of mysql-connector
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=int(DB_PORT)
        )
        print("✅ Database connection successful!")
        return conn
    except pymysql.MySQLError as e:
        print(f"❌ Database connection failed: {e}")
        return None
