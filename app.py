from flask import Flask, render_template, request, redirect, url_for,jsonify
from flask import session, flash
from functools import wraps
from routes.seva import seva  # Import seva routes
from routes.donation import donation  # Import donation routes
from gemini_ai import get_gemini_response  # Import AI function
from config import get_db_connection  # Import database connection function
# from flask_weasyprint import HTML, render_pdf
import os
import mysql.connector
from dotenv import load_dotenv
# Add this to app.py (replacing the previous PDF route)
from fpdf import FPDF
import json
from datetime import datetime
from flask import make_response
import traceback
# Load environment variables from Render
load_dotenv()
app = Flask(__name__)


app.secret_key = os.getenv("FLASK_SECRET_KEY")


@app.route('/get_gemini_response', methods=['POST'])
def handle_gemini():
    user_input = request.json.get("user_input", "")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    response = get_gemini_response(user_input)  # Call AI function
    return jsonify({"response": response})  # Return response to JS


# Register Blueprints
app.register_blueprint(seva, url_prefix='/seva')
app.register_blueprint(donation, url_prefix='/donation')

# Home Route
@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

# About Us Route
@app.route('/about')
def about():
    return render_template('about.html')

# Announcements Route
@app.route('/announcements')
def announcements():
    return render_template('announcements.html')

# Login authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Access denied. Please login first.')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Login Route - already exists but modify it to handle POST
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Check credentials against database
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM login_credentials WHERE username = %s AND password = %s", 
                      (username, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if user:
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid username or password')
            return render_template('login.html', error='Invalid username or password')
    
    return render_template('login.html')

# Logout Route
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    flash('You have been logged out')
    return redirect(url_for('login'))

# Admin Dashboard Route
@app.route('/admin')
@login_required
def admin_dashboard():
    return render_template('admin.html')

# members route
@app.route('/members')
def members():
    return render_template('members.html')


# Seva Booking Route (Handled in Blueprint)
@app.route('/booking')
def booking():
    return render_template('booking.html')

# Donation Route (Handled in Blueprint)
@app.route('/donation')
def donation():
    return render_template('donation.html')

# Contact Page Route
@app.route('/contact')
def contact():
    return render_template('contact.html')

# Contact Form Submission Route
@app.route('/contact/submit', methods=['POST'])
def contact_submit():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    print(f"Received message from {name} ({email}): {message}")

    return redirect(url_for('index'))  # Redirect after submission

# View Seva Slots
@app.route('/admin/view_seva_slots')
@login_required
def view_seva_slots():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM seva_slots ORDER BY seva_date DESC")
    slots = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('view_seva_slots.html', slots=slots)

# View Seva Bookings
@app.route('/admin/view_bookings')
@login_required
def view_bookings():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM seva_bookings 
        ORDER BY seva_date DESC, booking_time DESC
    """)
    bookings = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('view_bookings.html', bookings=bookings)

# Change Password Form
@app.route('/admin/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        current_password = request.form['current_password']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']
        
        # Verify current password
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT password FROM login_credentials WHERE username = %s", 
                      (session['username'],))
        user = cursor.fetchone()
        
        if not user or user['password'] != current_password:
            flash('Current password is incorrect')
            return redirect(url_for('change_password'))
        
        if new_password != confirm_password:
            flash('New passwords do not match')
            return redirect(url_for('change_password'))
        
        # Update password
        cursor.execute("UPDATE login_credentials SET password = %s WHERE username = %s",
                     (new_password, session['username']))
        conn.commit()
        cursor.close()
        conn.close()
        
        flash('Password changed successfully')
        return redirect(url_for('admin_dashboard'))
    
    return render_template('change_password.html')


# Add this route to app.py after the other routes
@app.route('/booking/confirmation')
def booking_confirmation():
    # This is just a fallback if someone tries to access this page directly
    return redirect(url_for('index'))


@app.route('/booking/receipt/<int:booking_id>')
def booking_receipt_html(booking_id):
    try:
        # Fetch booking details from database
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM seva_bookings 
            WHERE id = %s
        """, (booking_id,))
        booking = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not booking:
            flash('Booking not found')
            return redirect(url_for('index'))
        
        # Format date and time for display
        formatted_date = datetime.strptime(str(booking['seva_date']), "%Y-%m-%d").strftime("%d-%m-%Y")
        
        # Convert time format if needed
        formatted_time = booking['seva_time']
        if ":" in formatted_time:
            time_parts = formatted_time.split(':')
            if len(time_parts) >= 2:
                hour = int(time_parts[0])
                am_pm = "AM" if hour < 12 else "PM"
                hour = hour if hour <= 12 else hour - 12
                formatted_time = f"{hour}:{time_parts[1]} {am_pm}"
        
        # Parse family members
        family_members = []
        if booking['family_members']:
            try:
                family_members = json.loads(booking['family_members'])
            except:
                family_members = []
                
        # Generate HTML receipt
        return render_template('receipt_template.html',
                              booking=booking,
                              formatted_date=formatted_date,
                              formatted_time=formatted_time,
                              family_members=family_members,
                              today_date=datetime.now().strftime("%d-%m-%Y"),
                              printable=True)
    except Exception as e:
        print(f"Error generating receipt: {e}")
        print(traceback.format_exc())
        flash(f"Unable to generate receipt: {str(e)}")
        return redirect(url_for('index'))



# Run the Flask app
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)