import google.generativeai as genai
from config import YOUR_GEMINI_API_KEY
# Configure Gemini API
genai.configure(api_key=YOUR_GEMINI_API_KEY)
def get_gemini_response(user_input):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        instructions = """
        explain to a 5 years old child in short 
        """

        # Combine instructions with user input
        full_prompt = f"{instructions}\n\nUser: {user_input}\nAI:"


        response = model.generate_content(full_prompt)
        return response.text  # Return AI output
    except Exception as e:
        return f"Error: {str(e)}"