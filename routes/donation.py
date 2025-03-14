from flask import Blueprint, request, redirect, url_for, render_template

donation = Blueprint('donation', __name__)

# Donation Page Route
@donation.route('/')
def donation_page():
    return render_template('donation.html')

# Donation Form Submission Route
@donation.route('/process-donation', methods=['POST'])
def process_donation():
    donor_name = request.form.get('donor_name')
    amount = request.form.get('amount')
    payment_method = request.form.get('payment_method')
    
    # Process the donation (store in DB, send confirmation email, etc.)
    print(f"Donation received: {donor_name} donated {amount} via {payment_method}")

    return redirect(url_for('index'))  # Redirect back to the home page
