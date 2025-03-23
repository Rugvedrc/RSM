from flask import Blueprint, request, jsonify, render_template, redirect, url_for, flash
from models.seva import SevaBooking
from config import get_db_connection
from datetime import datetime

seva = Blueprint('seva', __name__, url_prefix='/seva')

@seva.route('/check-availability', methods=['POST'])
def check_availability():
    data = request.json
    seva_type = data.get('sevaType')
    seva_date = data.get('sevaDate')
    seva_time = data.get('sevaTime')
    
    print(f"🛠️ Raw seva_time received: '{seva_time}'") 
    print(f"🛠️ Raw seva_date received: '{seva_date}'") # Print the raw time value
    
    if not seva_type or not seva_date or not seva_time:
        print("❌ Missing required fields")
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Use the SevaBooking model to check availability
    availability = SevaBooking.get_slot_availability(seva_type, seva_date, seva_time)
    
    if 'error' in availability:
        return jsonify({'error': availability['error']}), 500
    
    return jsonify({
        'available_slots': availability['available_slots'],
        'total_slots': availability['total_slots']
    })

@seva.route('/book-seva', methods=['POST'])
def book_seva():
    try:
        # Extract all form data
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        gothra = request.form.get('gothra')
        seva_type = request.form.get('sevaType')
        seva_date = request.form.get('sevaDate')
        seva_time = request.form.get('sevaTime')
        nakshatra = request.form.get('nakshatra')
        special_instructions = request.form.get('message')
        payment_method = request.form.get('paymentMethod')
        
        # Handle family members (JSON storage)
        family_names = request.form.getlist('familyName[]')
        family_relations = request.form.getlist('familyRelation[]')
        family_members = []
        
        for i in range(len(family_names)):
            if family_names[i]:  # Only add if name is not empty
                family_member = {
                    'name': family_names[i],
                    'relation': family_relations[i] if i < len(family_relations) else ''
                }
                family_members.append(family_member)
        
        import json
        family_members_json = json.dumps(family_members)
        
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Convert time format if needed
        try:
            if "AM" in seva_time or "PM" in seva_time:
                time_obj = datetime.strptime(seva_time, "%I:%M %p")
                seva_time = time_obj.strftime("%H:%M:%S")
            else:
                # Ensure time has seconds
                if len(seva_time.split(':')) == 2:
                    seva_time = f"{seva_time}:00"
        except ValueError as ve:
            flash(f'Invalid time format: {ve}')
            return redirect(url_for('seva.booking'))
        
        # First check if slots are available using FOR UPDATE to lock the row
        cursor.execute("""
            SELECT available_slots, total_slots FROM seva_slots 
            WHERE seva_type = %s AND seva_date = %s AND seva_time = %s
            FOR UPDATE
        """, (seva_type, seva_date, seva_time))
        
        result = cursor.fetchone()
        
        if not result:
            # No entry exists yet, create one with default values and decrement
            cursor.execute("""
                INSERT INTO seva_slots (seva_type, seva_date, seva_time, total_slots, available_slots)
                VALUES (%s, %s, %s, 60, 59)
            """, (seva_type, seva_date, seva_time))
        else:
            available_slots = result[0]
            if available_slots <= 0:
                flash('Sorry, no slots are available for this seva at the selected date and time.')
                return redirect(url_for('seva.booking'))
            
            # Decrement available slots
            cursor.execute("""
                UPDATE seva_slots 
                SET available_slots = available_slots - 1 
                WHERE seva_type = %s AND seva_date = %s AND seva_time = %s
            """, (seva_type, seva_date, seva_time))
        
        # Check if the seva_bookings table exists, if not create it
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS seva_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                gothra VARCHAR(100),
                nakshatra VARCHAR(100),
                seva_type VARCHAR(100) NOT NULL,
                seva_date DATE NOT NULL,
                seva_time VARCHAR(20) NOT NULL,
                special_instructions TEXT,
                payment_method VARCHAR(50) NOT NULL,
                family_members JSON,
                booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insert booking details
        cursor.execute("""
            INSERT INTO seva_bookings 
            (name, email, phone, gothra, nakshatra, seva_type, seva_date, seva_time, 
            special_instructions, payment_method, family_members)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (name, email, phone, gothra, nakshatra, seva_type, seva_date, seva_time, 
              special_instructions, payment_method, family_members_json))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        flash('Seva booked successfully!')
        return redirect(url_for('index'))
        
    except Exception as e:
        flash(f'Error booking seva: {str(e)}')
        return redirect(url_for('seva.booking'))

@seva.route('/booking')
def booking():
    return render_template('booking.html')
