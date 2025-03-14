from flask import Blueprint, request, jsonify

chatbot = Blueprint('chatbot', __name__)

@chatbot.route('/ask', methods=['POST'])
def ask_chatbot():
    user_message = request.json.get('message', '')

    # Always reply with "Hare Krishna"
    bot_response = "Hare Krishna 🙏"

    return jsonify({"response": bot_response})
