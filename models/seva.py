import mysql.connector
from config import mysql_config

class SevaBooking:
    @staticmethod
    def get_all_bookings():
        try:
            conn = mysql.connector.connect(**mysql_config)
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
            print(f"Error getting bookings: {str(e)}")
            return []
    
    @staticmethod
    def get_slot_availability(seva_type, seva_date, seva_time):
        try:
            conn = mysql.connector.connect(**mysql_config)
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT available_slots, total_slots 
                FROM seva_slots 
                WHERE seva_type = %s AND seva_date = %s AND seva_time = %s
            """, (seva_type, seva_date, seva_time))
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not result:
                return {'available_slots': 60, 'total_slots': 60}
            return result
        except Exception as e:
            print(f"Error getting slot availability: {str(e)}")
            return {'available_slots': 0, 'total_slots': 0, 'error': str(e)}