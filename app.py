from flask import Flask, render_template, request, redirect, url_for,jsonify
from routes.seva import seva  # Import seva routes
from routes.donation import donation  # Import donation routes
from gemini_ai import get_gemini_response  # Import AI function
import os
app = Flask(__name__)


app.secret_key = 'supersecretkey12345' 

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

# login Route
@app.route('/login')
def login():
    return render_template('login.html')

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

# Run the Flask app
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)