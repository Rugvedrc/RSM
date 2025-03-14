document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for Contact section
    const contactLink = document.querySelector('a[href="#rsm-index-contact-section"]');
    if (contactLink) {
        contactLink.addEventListener('click', function(event) {
            event.preventDefault();
            const contactSection = document.getElementById('rsm-index-contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Initialize the chatbot container
    const chatbotContainer = document.getElementById('rsm-base-chatbot-container');
    if (chatbotContainer) {
        chatbotContainer.style.display = 'none';
    }
});

// Function to toggle chatbot visibility
function toggleChatbot() {
    const chatbotContainer = document.getElementById('rsm-base-chatbot-container');
    
    if (chatbotContainer.style.display === 'flex' || chatbotContainer.style.display === 'block') {
        // Hide chatbot
        chatbotContainer.style.display = 'none';
        chatbotContainer.classList.remove('active');
    } else {
        // Show chatbot
        chatbotContainer.style.display = 'flex';
        chatbotContainer.classList.add('active');
        
        // Add welcome message if this is the first time opening
        if (chatbotContainer.dataset.initialized !== 'true') {
            const messagesContainer = document.getElementById('rsm-base-chatbot-messages');
            if (messagesContainer && messagesContainer.children.length === 0) {
                addMessage('bot', 'Haraye Namah! Welcome to Raghavendra Swami Math. How can I assist you today? 🙏');
                chatbotContainer.dataset.initialized = 'true';
            }
        }
        
        // Focus on input when opened
        document.getElementById('rsm-base-chatbot-input').focus();
    }
}

// Function to add a message to the chat window
function addMessage(sender, message, isTemporary = false) {
    const messagesContainer = document.getElementById('rsm-base-chatbot-messages');
    
    // If a temporary message already exists, remove it before adding a new one
    if (isTemporary) {
        const existingTempMsg = messagesContainer.querySelector("[data-temp='true']");
        if (existingTempMsg) {
            messagesContainer.removeChild(existingTempMsg);
        }
    }

    // Create message element
    const messageElement = document.createElement('div');
    
    if (sender === 'bot' && message === 'Thinking... 🤔') {
        // Create typing indicator for "Thinking..." message
        messageElement.className = 'typing-indicator';
        messageElement.innerHTML = '<span></span><span></span><span></span>';
    } else {
        // Regular message content
        messageElement.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
        messageElement.textContent = message;
    }

    // Append message element to messages container
    messagesContainer.appendChild(messageElement);

    // Mark as temporary if needed
    if (isTemporary) {
        messageElement.setAttribute('data-temp', 'true');
    }

    // Smooth scroll to the latest message
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Function to handle message sending
function sendMessage(event) {
    // Check if Enter key is pressed
    if (event.key === 'Enter') {
        const input = document.getElementById('rsm-base-chatbot-input');
        const message = input.value.trim();

        if (message) {
            // Add user message to chat
            addMessage('user', message);

            // Clear input field
            input.value = '';

            // Show thinking indicator
            addMessage('bot', 'Thinking... 🤔', true);

            // Send message to Gemini AI
            fetch("/get_gemini_response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: message })
            })
            .then(response => response.json())
            .then(data => {
                // Remove "Thinking..." and add AI response
                removeLastBotMessage();
                addMessage('bot', data.response);
            })
            .catch(error => {
                console.error("Error:", error);
                removeLastBotMessage();
                addMessage('bot', 'Sorry, something went wrong. 🙏');
            });
        }
    }
}

function removeLastBotMessage() {
    const chatContainer = document.getElementById('rsm-base-chatbot-messages');
    const typingIndicators = chatContainer.getElementsByClassName('typing-indicator');
    if (typingIndicators.length > 0) {
        chatContainer.removeChild(typingIndicators[0]);
    } else {
        const messages = chatContainer.getElementsByClassName('bot-message');
        if (messages.length > 0) {
            chatContainer.removeChild(messages[messages.length - 1]);
        }
    }
}