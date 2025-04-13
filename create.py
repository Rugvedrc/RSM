from config import get_db_connection

def create_login_table():
    conn = get_db_connection()
    if conn is None:
        return

    cursor = conn.cursor()

    # Create table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS login_credentials (
        username VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255) NOT NULL
    )
    """
    cursor.execute(create_table_query)

    # Insert admin credentials if not exists
    insert_query = """
    INSERT IGNORE INTO login_credentials (username, password)
    VALUES (%s, %s)
    """
    cursor.execute(insert_query, ('admin', 'admin@123'))

    conn.commit()
    print("✅ Table created and admin credentials inserted.")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_login_table()
