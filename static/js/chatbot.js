
// Smooth scrolling for Contact section
const contactLink = document.querySelector('a[href="#rsm-index-contact-section"]');
if (contactLink) {
    contactLink.addEventListener('click', function (event) {
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


















const container = document.getElementById('rsm-booking-form-family-container');

document.querySelector('.rsm-booking-form-family-add').addEventListener('click', function () {
    const newRow = document.createElement('div');
    newRow.className = 'rsm-booking-form-family-row';
    newRow.innerHTML = `
        <div class="rsm-booking-form-family-column-1">
            <input type="text" name="familyName[]" placeholder="Name">
        </div>
        <div class="rsm-booking-form-family-column-2">
            <input type="text" name="familyRelation[]" placeholder="Relation">
        </div>
        <div class="rsm-booking-form-family-column-3">
            <button type="button" class="rsm-booking-form-family-remove">Remove</button>
        </div>
    `;
    container.appendChild(newRow);

    // Add event listener to the new remove button
    newRow.querySelector('.rsm-booking-form-family-remove').addEventListener('click', function () {
        container.removeChild(newRow);
    });
});
























document.addEventListener('DOMContentLoaded', function() {
    // Get all required elements
    const slides = document.querySelectorAll('.rsm-index-hero-carousel-slide');
    const dots = document.querySelectorAll('.rsm-index-hero-carousel-dot');
    const prevButton = document.querySelector('.rsm-index-hero-carousel-prev');
    const nextButton = document.querySelector('.rsm-index-hero-carousel-next');
    
    // Check if carousel elements exist on the page
    if (!slides.length) {
      console.log('No carousel slides found');
      return;
    }
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show a specific slide
    function goToSlide(index) {
      // Remove active class from all slides and dots
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Handle index out of bounds
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      // Set active class to current slide and dot
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      
      // Update current slide index
      currentSlide = index;
      
      console.log('Changed to slide', index);
    }
    
    // Function to go to next slide
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    // Function to go to previous slide
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    // Start automatic slideshow
    function startSlideshow() {
      // Clear any existing interval
      if (slideInterval) {
        clearInterval(slideInterval);
      }
      
      slideInterval = setInterval(nextSlide, 5000);
      console.log('Started slideshow');
    }
    
    // Add event listeners
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      prevSlide();
      // Restart slideshow timer after manual navigation
      startSlideshow();
      console.log('Previous button clicked');
    });
    
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      nextSlide();
      // Restart slideshow timer after manual navigation
      startSlideshow();
      console.log('Next button clicked');
    });
    
    // Add click events to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        goToSlide(index);
        // Restart slideshow timer after manual navigation
        startSlideshow();
        console.log('Dot', index, 'clicked');
      });
    });
    
    // Initialize the carousel
    goToSlide(0);
    startSlideshow();
    
    console.log('Carousel initialized with', slides.length, 'slides');
  });












  // Function to toggle category sections
function toggleCategory(element) {
    // Find the content associated with this category header
    const categoryContent = element.nextElementSibling;
    const toggleIcon = element.querySelector('.rsm-booking-category-toggle');
    
    // Toggle visibility
    if (categoryContent.style.display === 'block') {
        categoryContent.style.display = 'none';
        toggleIcon.textContent = '+';
    } else {
        categoryContent.style.display = 'block';
        toggleIcon.textContent = '-';
    }
}

// Function to toggle individual seva details
function toggleSeva(element) {
    // Find the details associated with this seva header
    const sevaDetails = element.nextElementSibling;
    const toggleIcon = element.querySelector('.rsm-booking-seva-toggle');
    
    // Toggle visibility
    if (sevaDetails.style.display === 'block') {
        sevaDetails.style.display = 'none';
        toggleIcon.textContent = '+';
    } else {
        sevaDetails.style.display = 'block';
        toggleIcon.textContent = '-';
    }
}

// Initialize all categories and sevas to be closed when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Hide all category content sections
    const categoryContents = document.querySelectorAll('.rsm-booking-category-content');
    categoryContents.forEach(function(content) {
        content.style.display = 'none';
    });
    
    // Hide all seva details
    const sevaDetails = document.querySelectorAll('.rsm-booking-seva-details');
    sevaDetails.forEach(function(detail) {
        detail.style.display = 'none';
    });
    
    // Make sure all toggle icons show '+' initially
    const toggleIcons = document.querySelectorAll('.rsm-booking-category-toggle, .rsm-booking-seva-toggle');
    toggleIcons.forEach(function(icon) {
        icon.textContent = '+';
    });
});