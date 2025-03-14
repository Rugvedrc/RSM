from config import get_db_connection
from datetime import datetime

class SevaBooking:
    @staticmethod
    def get_slot_availability(seva_type, seva_date, seva_time):
        try:
            conn = get_db_connection()
            if not conn:
                return {'error': 'Database connection failed'}
                
            cursor = conn.cursor(dictionary=True)
            
            print(f"🔎 Raw Input Time: '{seva_time}'")  # Debug log

            # Detect and convert time format
            try:
                if "AM" in seva_time or "PM" in seva_time:
                    # Convert 12-hour format (06:00 AM → 06:00:00)
                    seva_time = datetime.strptime(seva_time, "%I:%M %p").strftime("%H:%M:%S")
                else:
                    # Handle 24-hour format (06:00 → 06:00:00)
                    # If time is just HH:MM, add seconds
                    if len(seva_time.split(':')) == 2:
                        seva_time = f"{seva_time}:00"
                
                print(f"🔄 Converted Time: {seva_time}")
            except ValueError as ve:
                print(f"❌ Time Format Error: {ve}")
                return {'error': f'Invalid time format: {ve}'}

            print(f"🔎 Checking availability for {seva_type} on {seva_date} at {seva_time}")

            cursor.execute("""
                SELECT available_slots, total_slots 
                FROM seva_slots 
                WHERE seva_type = %s AND seva_date = %s AND seva_time = %s
            """, (seva_type, seva_date, seva_time))
            
            result = cursor.fetchone()
            print(f"📌 Database Response: {result}")

            if not result:
                print("⚠️ No slot found, inserting default slots (60)")
                cursor.execute("""
                    INSERT INTO seva_slots (seva_type, seva_date, seva_time, total_slots, available_slots)
                    VALUES (%s, %s, %s, 60, 60)
                """, (seva_type, seva_date, seva_time))
                conn.commit()
                available_slots = 60
                total_slots = 60
            else:
                available_slots = result['available_slots']
                total_slots = result['total_slots']

            cursor.close()
            conn.close()
            return {'available_slots': available_slots, 'total_slots': total_slots}

        except Exception as e:
            print(f"❌ Error checking availability: {str(e)}")
            return {'error': str(e)}
