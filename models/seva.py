import mysql.connector
from config import get_db_connection, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

class SevaBooking:
    @staticmethod
    def get_all_bookings():
        try:
            conn = get_db_connection()  # ✅ Correct import
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT * FROM seva_bookings 
                ORDER BY booking_timestamp DESC
            """)
            bookings = cursor.fetchall()
            cursor.close()
            conn.close()
            return bookings
        except Exception as e:
            print(f"❌ Error getting bookings: {str(e)}")  # Debug log
            return []
    
    @staticmethod
    def get_slot_availability(seva_type, seva_date, seva_time):
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Convert time format if needed
            from datetime import datetime
            try:
                seva_time = datetime.strptime(seva_time, "%I:%M %p").strftime("%H:%M:%S")
            except ValueError as ve:
                print(f"❌ Time format error: {ve}")
                return {'error': 'Invalid time format'}

            print(f"🔎 Checking availability for {seva_type} on {seva_date} at {seva_time}")  # Debug log

            cursor.execute("""
                SELECT available_slots, total_slots 
                FROM seva_slots 
                WHERE seva_type = %s AND seva_date = %s AND seva_time = %s
            """, (seva_type, seva_date, seva_time))
            
            result = cursor.fetchone()
            print(f"📌 Database Response: {result}")  # Debug log

            if not result:
                print("⚠️ No slot found, returning default slots (60)")
                return {'available_slots': 60, 'total_slots': 60}
            
            cursor.close()
            conn.close()
            return result
        except Exception as e:
            print(f"❌ Error getting slot availability: {str(e)}")  # Debug log
            return {'available_slots': 0, 'total_slots': 0, 'error': str(e)}
