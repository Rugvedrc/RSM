YOUR_GEMINI_API_KEY='AIzaSyDx9VnS8zuUnPm76ns9B_h6VazTttROhtI'

mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'rugved9999',
    'database': 'raghavendra_math'
}

# MYSQL_ADDON_HOST=bue7t3xueljqxlmfqadr-mysql.services.clever-cloud.com
# MYSQL_ADDON_DB=bue7t3xueljqxlmfqadr
# MYSQL_ADDON_USER=uef1g3etyo0zh2t2
# MYSQL_ADDON_PORT=3306
# MYSQL_ADDON_PASSWORD=jeqdOKkYpHHrYYNf2n0R
# MYSQL_ADDON_URI=mysql://uef1g3etyo0zh2t2:jeqdOKkYpHHrYYNf2n0R@bue7t3xueljqxlmfqadr-mysql.services.clever-cloud.com:3306/bue7t3xueljqxlmfqadr


import os
import mysql.connector  # Use pymysql if needed

DB_HOST = os.getenv("DB_HOST", "bue7t3xueljqxlmfqadr-mysql.services.clever-cloud.com")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "uef1g3etyo0zh2t2")
DB_PASSWORD = os.getenv("DB_PASSWORD", "jeqdOKkYpHHrYYNf2n0R")
DB_NAME = os.getenv("DB_NAME", "bue7t3xueljqxlmfqadr")

# Function to establish a database connection
def get_db_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
