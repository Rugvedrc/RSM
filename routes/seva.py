from flask import Blueprint, request, jsonify, render_template, redirect, url_for, flash
from models.seva import SevaBooking
import mysql.connector
from config import get_db_connection,DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT
from datetime import datetime

seva = Blueprint('seva', __name__, url_prefix='/seva')

@seva.route('/check-availability', methods=['POST'])
def check_availability():
    data = request.json
    seva_type = data.get('sevaType')
    seva_date = data.get('sevaDate')
    seva_time = data.get('sevaTime')
    seva_time = datetime.strptime(seva_time, "%I:%M %p").strftime("%H:%M:%S")
    
    if not all([seva_type, seva_date, seva_time]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor(dictionary=True)
        
        # Check if slots entry exists for this seva, date and time
        cursor.execute("""
            SELECT available_slots, total_slots 
            FROM seva_slots 
            WHERE seva_type = %s AND seva_date = %s AND seva_time = %s
        """, (seva_type, seva_date, seva_time))
        
        slot = cursor.fetchone()
        
        if not slot:
            # No entry exists yet, create one with default values
            cursor.execute("""
                INSERT INTO seva_slots (seva_type, seva_date, seva_time, total_slots, available_slots)
                VALUES (%s, %s, %s, 60, 60)
            """, (seva_type, seva_date, seva_time))
            conn.commit()
            available_slots = 60
            total_slots = 60
        else:
            available_slots = slot['available_slots']
            total_slots = slot['total_slots']
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'available_slots': available_slots,
            'total_slots': total_slots
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor()
        
        # First check if slots are available
        cursor.execute("""
            SELECT available_slots FROM seva_slots 
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
