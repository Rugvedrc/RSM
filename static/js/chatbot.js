
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





function toggleTimeSlot() {
    const sevaType = document.getElementById('rsm-booking-form-sevaType').value;
    const timeRow = document.getElementById('rsm-booking-form-row-time');
    const timeSelect = document.getElementById('rsm-booking-form-sevaTime');
    const defaultTimeInput = document.getElementById('rsm-booking-form-sevaTime-default');

    // Show time slot only for Shradha or Pakshapandharwada
    if (sevaType === 'Pakshapandharwada') {
        timeRow.style.display = 'block';
        timeSelect.required = true;
        defaultTimeInput.disabled = true;
    } else {
        timeRow.style.display = 'none';
        timeSelect.required = false;
        timeSelect.value = '';
        defaultTimeInput.disabled = false;
    }
}

// Initialize the form state on page load
// document.addEventListener('DOMContentLoaded', function() {
// Hide time slot by default
document.getElementById('rsm-booking-form-row-time').style.display = 'none';
toggleTimeSlot();

// Handle form submission
document.getElementById('rsm-booking-form').addEventListener('submit', function (event) {
    const sevaType = document.getElementById('rsm-booking-form-sevaType').value;
    const timeSelect = document.getElementById('rsm-booking-form-sevaTime');
    const defaultTimeInput = document.getElementById('rsm-booking-form-sevaTime-default');

    // If time slot is not visible, use the default time value
    if (sevaType !== 'Shradha' && sevaType !== 'Pakshapandharwada') {
        timeSelect.value = defaultTimeInput.value;
    }
});














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

// Availability checking functionality
const sevaSelect = document.getElementById('rsm-booking-form-sevaType');
const dateInput = document.getElementById('rsm-booking-form-sevaDate');
const timeSelect = document.getElementById('rsm-booking-form-sevaTime');
const availabilitySection = document.getElementById('rsm-booking-availability-section');
const selectedSevaElem = document.getElementById('rsm-booking-selected-seva');
const selectedDateElem = document.getElementById('rsm-booking-selected-date');
const selectedTimeElem = document.getElementById('rsm-booking-selected-time');
const availabilityCountElem = document.getElementById('rsm-booking-availability-count');

function checkAvailability() {
    const seva = sevaSelect.value;
    const date = dateInput.value;
    const time = timeSelect.value;

    if (seva && date && time) {
        // Format the date for display
        const formattedDate = new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Format the time for display (convert 24h to 12h format with AM/PM)
        let formattedTime;
        if (time.includes('AM') || time.includes('PM')) {
            formattedTime = time; // Already in 12-hour format
        } else {
            // Convert 24-hour format to 12-hour format
            const timeHour = parseInt(time.split(':')[0]);
            formattedTime = (timeHour > 12 ? timeHour - 12 : timeHour) + ':00 ' + (timeHour >= 12 ? 'PM' : 'AM');
        }

        // Update the availability section
        selectedSevaElem.textContent = seva;
        selectedDateElem.textContent = formattedDate;
        selectedTimeElem.textContent = formattedTime;

        // Show loading state
        availabilityCountElem.textContent = 'Checking...';
        availabilitySection.style.display = 'block';

        // Fetch real-time availability from the server - with cache busting to prevent stale data
        fetch('/seva/check-availability?cacheBust=' + new Date().getTime(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sevaType: seva,
                sevaDate: date,
                sevaTime: time
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error('Error checking availability:', data.error);
                    availabilityCountElem.textContent = 'Error checking availability';
                } else {
                    availabilityCountElem.textContent = data.available_slots + '/' + data.total_slots;

                    // Disable submit button if no slots available
                    const submitButton = document.getElementById('rsm-booking-form-submit-button');
                    if (data.available_slots <= 0) {
                        submitButton.disabled = true;
                        submitButton.textContent = 'No Slots Available';
                    } else {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Book Seva';
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                availabilityCountElem.textContent = 'Error checking availability';
            });
    } else {
        availabilitySection.style.display = 'none';
    }
}

sevaSelect.addEventListener('change', checkAvailability);
dateInput.addEventListener('change', checkAvailability);
timeSelect.addEventListener('change', checkAvailability);

// Set minimum date to today
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayString = `${yyyy}-${mm}-${dd}`;
dateInput.min = todayString;

// Add event listener for form submission to refresh availability after successful booking
const bookingForm = document.getElementById('rsm-booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function () {
        // Check availability again after a short delay
        setTimeout(checkAvailability, 3000);
    });
}















const sevaNames = document.querySelectorAll('.rsm-booking-seva-name');

sevaNames.forEach(function (sevaName) {
    sevaName.addEventListener('click', function () {
        // Toggle active class
        this.classList.toggle('active');

        // Get the next sibling which is the details div
        const details = this.nextElementSibling;

        // Toggle display
        if (details.style.display === 'none' || !details.style.display) {
            details.style.display = 'block';
        } else {
            details.style.display = 'none';
        }
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









// Initialize to hide all content sections
document.addEventListener('DOMContentLoaded', function() {
    // Hide all category content and seva details on page load
    var categoryContents = document.querySelectorAll('.rsm-booking-category-content');
    var sevaDetails = document.querySelectorAll('.rsm-booking-seva-details');
    
    categoryContents.forEach(function(content) {
        content.style.display = 'none';
    });
    
    sevaDetails.forEach(function(detail) {
        detail.style.display = 'none';
    });
});

// Function to toggle category content
function toggleCategory(element) {
    var content = element.nextElementSibling;
    var toggle = element.querySelector('.rsm-booking-category-toggle');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '-';
    } else {
        content.style.display = 'none';
        toggle.textContent = '+';
    }
}

// Function to toggle seva details
function toggleSeva(element) {
    var details = element.nextElementSibling;
    var toggle = element.querySelector('.rsm-booking-seva-toggle');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        toggle.textContent = '-';
    } else {
        details.style.display = 'none';
        toggle.textContent = '+';
    }
    
    // Prevent the event from bubbling up to parent elements
    event.stopPropagation();
}










// Function to toggle time slot visibility and handle Pakshapandharwada rules
function toggleTimeSlot() {
    const sevaType = document.getElementById('rsm-booking-form-sevaType').value;
    const dateInputContainer = document.getElementById('rsm-booking-form-column-2');
    const timeRow = document.getElementById('rsm-booking-form-row-time');
    const defaultTimeInput = document.getElementById('rsm-booking-form-sevaTime-default');
    
    // First, restore the original date input if it was replaced
    if (document.getElementById('rsm-booking-form-sevaDate-select')) {
        const dateSelect = document.getElementById('rsm-booking-form-sevaDate-select');
        const hiddenDateInput = document.getElementById('rsm-booking-form-sevaDate');
        
        // Create a new date input to replace the select
        const newDateInput = document.createElement('input');
        newDateInput.type = 'date';
        newDateInput.id = 'rsm-booking-form-sevaDate';
        newDateInput.name = 'sevaDate';
        newDateInput.required = true;
        
        // Replace the select with the new date input
        dateSelect.parentNode.replaceChild(newDateInput, dateSelect);
        
        // Remove the hidden input if it exists
        if (hiddenDateInput) {
            hiddenDateInput.parentNode.removeChild(hiddenDateInput);
        }
    }
    
    // Hide time selection by default for all sevas except Pakshapandharwada
    if (sevaType !== 'Pakshapandharwada') {
        timeRow.style.display = 'none';
        // Set default time value
        defaultTimeInput.value = '00:00'; // 12:00 AM
        return;
    }
    
    // Show time selection for Pakshapandharwada
    timeRow.style.display = 'block';
    
    // Get the date input that should now be restored
    const dateInput = document.getElementById('rsm-booking-form-sevaDate');
    
    // Create select dropdown for dates with tithi
    const pakshaDates = [
        { date: '2025-09-08', tithi: 'प्रतिपदा', times: ['09:00', '11:00'] },
        { date: '2025-09-09', tithi: 'द्वितीया', times: ['09:00', '11:00'] },
        { date: '2025-09-10', tithi: 'तृतीया', times: ['09:00', '11:00'] },
        { date: '2025-09-11', tithi: 'चतुर्थी', times: ['09:00', '11:00'] },
        { date: '2025-09-12', tithi: 'पंचमी व षष्टी', times: ['07:00', '09:00', '11:00'] },
        { date: '2025-09-13', tithi: 'सप्तमी', times: ['09:00', '11:00'] },
        { date: '2025-09-14', tithi: 'अष्टमी', times: ['09:00', '11:00'] },
        { date: '2025-09-15', tithi: 'नवमी', times: ['09:00', '11:00'] },
        { date: '2025-09-16', tithi: 'दशमी', times: ['09:00', '11:00'] },
        // No option for 17-9 as per rule 1
        { date: '2025-09-18', tithi: 'एकादशी व द्वादशी', times: ['07:00', '09:00', '11:00'] },
        { date: '2025-09-19', tithi: 'त्रयोदशी', times: ['09:00', '11:00'] },
        { date: '2025-09-20', tithi: 'चतुर्दशी', times: ['09:00', '11:00'] },
        { date: '2025-09-21', tithi: 'अमावस्या', times: ['07:00', '09:00', '11:00'] }
    ];
    
    // Convert date input to select
    const dateSelect = document.createElement('select');
    dateSelect.id = 'rsm-booking-form-sevaDate-select';
    dateSelect.name = 'sevaDate';
    dateSelect.required = true;
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select Date and Tithi...';
    dateSelect.add(defaultOption);
    
    // Add date options with tithi
    pakshaDates.forEach(item => {
        const option = document.createElement('option');
        option.value = item.date;
        
        // Format date for display (DD-MM-YYYY)
        const dateParts = item.date.split('-');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0].slice(2)}`;
        
        option.text = `${formattedDate} (${item.tithi})`;
        option.dataset.times = JSON.stringify(item.times);
        dateSelect.add(option);
    });
    
    // Replace date input with select
    dateInput.parentNode.replaceChild(dateSelect, dateInput);
    
    // Clear and update time select
    const timeSelect = document.getElementById('rsm-booking-form-sevaTime');
    while (timeSelect.options.length > 1) {
        timeSelect.remove(1);
    }
    
    // Event listener for date select change to update time options
    dateSelect.addEventListener('change', function() {
        // Clear previous options
        while (timeSelect.options.length > 1) {
            timeSelect.remove(1);
        }
        
        if (this.value) {
            const selectedOption = this.options[this.selectedIndex];
            const availableTimes = JSON.parse(selectedOption.dataset.times);
            
            // Add time options based on selected date
            availableTimes.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.text = time === '07:00' ? '07:00 AM' : (time === '09:00' ? '09:00 AM' : '11:00 AM');
                timeSelect.add(option);
            });
        }
    });
    
    // Set a hidden input with the original date value for database
    const hiddenDateInput = document.createElement('input');
    hiddenDateInput.type = 'hidden';
    hiddenDateInput.id = 'rsm-booking-form-sevaDate-hidden';
    hiddenDateInput.name = 'sevaDate';
    dateSelect.parentNode.appendChild(hiddenDateInput);
    
    // Update hidden input when select changes
    dateSelect.addEventListener('change', function() {
        hiddenDateInput.value = this.value;
    });
}

// Add event listener for form submission to ensure data is properly formatted
document.getElementById('rsm-booking-form').addEventListener('submit', function(event) {
    const sevaType = document.getElementById('rsm-booking-form-sevaType').value;
    
    if (sevaType === 'Pakshapandharwada') {
        // Make sure we have the date value in the correct format for the database
        const dateSelect = document.getElementById('rsm-booking-form-sevaDate-select');
        const hiddenDateInput = document.getElementById('rsm-booking-form-sevaDate-hidden');
        
        if (dateSelect && hiddenDateInput && dateSelect.value) {
            hiddenDateInput.value = dateSelect.value;
        } else {
            event.preventDefault();
            alert('Please select a valid date for Pakshapandharwada.');
            return;
        }
        
        // Ensure time is selected for Pakshapandharwada
        const timeSelect = document.getElementById('rsm-booking-form-sevaTime');
        if (!timeSelect.value) {
            event.preventDefault();
            alert('Please select a time slot.');
            return;
        }
    } else {
        // For other sevas, use default time
        const defaultTimeInput = document.getElementById('rsm-booking-form-sevaTime-default');
        if (defaultTimeInput) {
            defaultTimeInput.value = '00:00'; // 12:00 AM
        }
    }
});

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Call toggleTimeSlot initially to set up the correct options
    toggleTimeSlot();
});