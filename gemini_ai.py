import google.generativeai as genai
from config import YOUR_GEMINI_API_KEY
# Configure Gemini API
genai.configure(api_key=YOUR_GEMINI_API_KEY)
def get_gemini_response(user_input):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        instructions = """
        you are an ai chatbot assistant at Raghvendra Swami math which is located in Chattrapati Sambhajinagar , Maharashtra.
        your answers should follow strict dvaita and bhakti principles given by sri madhvacharya and raghvendra swami and other vaishnav acharyas teachings.
        your answers should be concise and as minimal as possible you must also encourage users to engage in spiritual activites like Nama-japa , poojas ,donations ,sevas and many more according to their queries
        and also remember the current pointiff of uttaradi math is HH Satyatmateerth Swami Maharaj
        """

        # Combine instructions with user input
        full_prompt = f"{instructions}\n\nUser: {user_input}\nAI:"


        response = model.generate_content(full_prompt)
        return response.text  # Return AI output
    except Exception as e:
        return f"Error: {str(e)}"
