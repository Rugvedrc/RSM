from twilio.rest import Client
import logging
import os
from dotenv import load_dotenv
load_dotenv()
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_booking_confirmation(phone, name, seva_type, seva_date, seva_time=None, other_details=None):
    """
    Send booking confirmation SMS to the user
    
    Parameters:
    phone (str): Phone number in format +919XXXXXXXXX
    name (str): Name of the person who booked
    seva_type (str): Type of seva booked
    seva_date (str): Date of seva in human-readable format
    seva_time (str, optional): Time of seva if applicable
    other_details (dict, optional): Any other details to include
    """
    try:
        # Twilio credentials
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        twilio_phone = os.getenv("TWILIO_PHONE")
        
        # Format phone number if needed (ensure it has +91 prefix)
        phone = ''.join(char for char in phone if char.isdigit() or char == '+')
        if not phone.startswith('+'):
            if phone.startswith('91'):
                phone='+'+phone
            else:
                phone='+91'+phone
        logger.info(f"Sending SMS to formatted number: {phone}")
        # Prepare message content
        message_content = f"हरये नमः। {name} आपली {seva_type} सेवा दिनांक {seva_date}"
        
        if seva_time:
            message_content += f" वेळ {seva_time}"
        
        message_content += " साठी बुक झाली आहे। ~ राघवेंद्र सेवा संघ"
        
        # Create Twilio client and send message
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            from_=twilio_phone,
            body=message_content,
            to=phone
        )
        
        logger.info(f"SMS sent successfully to {phone}, SID: {message.sid}")
        return {"success": True, "message_sid": message.sid}
    
    except Exception as e:
        logger.error(f"Failed to send SMS: {str(e)}")
        return {"success": False, "error": str(e)}