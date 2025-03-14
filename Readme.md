# 🏰 Raghavendra Swami Math Website  

This is the official website for **Raghavendra Swami Math, Chhatrapati Sambhaji Nagar**, designed to provide devotees with an easy and minimalistic way to book **sevas**, make **donations**, and stay updated with **announcements and events**.  

---

## 🌟 Features  

✅ **Home Page** – Introduction, announcements, seva details, donation info, contact form, and a chatbot.  
✅ **Seva Booking** – List of available poojas & a form to book sevas online.  
✅ **Donations** – Explanation of donation purposes & a form for online donations.  
✅ **Announcements & Events** – Latest temple updates & gallery.  
✅ **About Us** – History of the Math, Guru Parampara, mission & vision.  
✅ **Contact Us** – Google Maps for directions & a contact form.  
✅ **AI Chatbot** – A floating assistant using **Gemini API** to answer queries.  

---

🌐 Website Overview

Your website is designed to provide an easy and minimalistic interface for seva booking, donations, announcements, and AI chatbot interaction.

📌 Key Features

✅ Home Page – Introduction, announcements, seva details, donation info, and chatbot.✅ Seva Booking – List of available poojas & a form to book sevas online.✅ Donations – Explanation of donation purposes & a form for online donations.✅ Announcements – Latest temple updates & gallery.✅ About Us – History of the Math, Guru Parampara, mission & vision.✅ Contact Us – Google Maps for directions & a contact form.✅ AI Chatbot – A floating assistant (bottom-right) that replies Hare Krishna.

📂 Pages & Functionalities (Every Button & Link)

1️⃣ Home Page (index.html)

📌 URL: / or /index🔹 Displays Introduction, Announcements, Seva Details, and Donation Info.🔹 Contains Navigation Bar with buttons:

🏠 Home → /

📖 About Us → /about

📢 Announcements → /announcements

🙏 Seva Booking → /booking

💰 Donations → /donation

📞 Contact Us → /contact
🔹 Floating Chatbot Button (Bottom-Right) → Click to chat.

2️⃣ About Us (about.html)

📌 URL: /about🔹 Contains details about Guru Parampara, history, and mission.

3️⃣ Announcements (announcements.html)

📌 URL: /announcements🔹 Displays latest temple news, events, and festival updates.

4️⃣ Seva Booking (booking.html)

📌 URL: /booking🔹 Displays list of available sevas with descriptions.🔹 Booking Form:

✍ Seva Name (Dropdown/List)

🙏 Devotee Name (Text Input)

📞 Contact Number (Text Input)

✅ Submit Button → Sends data to /seva/book-seva

✅ After submitting, user is redirected to home page (/index).

5️⃣ Donations (donation.html)

📌 URL: /donation🔹 Displays donation purposes & benefits.🔹 Donation Form:

👤 Donor Name (Text Input)

💰 Amount (Number Input)

🏦 Payment Method (Dropdown: UPI/Bank Transfer/Cash)

✅ Submit Button → Sends data to /donation/process-donation

✅ After submitting, user is redirected to home page (/index).

6️⃣ Contact Us (contact.html)

📌 URL: /contact🔹 Displays:

📍 Temple Location with Google Maps

📞 Phone Number

📧 Email Address
🔹 Contact Form:

👤 Name (Text Input)

📧 Email (Email Input)

✉ Message (Textarea)

✅ Submit Button → Sends data to /contact/submit

✅ After submitting, user is redirected to home page (/index).

7️⃣ AI Chatbot (Persistent on All Pages)

📌 Appears on Every Page (bottom-right corner).🔹 Robot Icon → Click to open chatbot.🔹 Chatbox Input:

📝 User enters message

🤖 Chatbot always replies "Hare Krishna 🙏"

✅ Works on every page without reloading.

⚙️ Backend (Flask + MySQL)

Flask Routes & APIs

📌 Registered Blueprints

Module

Route Prefix

Purpose

seva.py

/seva

Handles seva bookings

donation.py

/donation

Handles donations

chatbot.py

/chatbot

Handles chatbot responses

Database (MySQL)

📌 Tables

Table

Purpose

sevas

Stores seva booking details

donations

Stores donation transactions

✅ Data is stored securely and can be retrieved for reports.


## 🏗️ Technologies Used  

- **Flask (Python)** – Backend framework  
- **MySQL** – Database for seva & donation records  
- **HTML, CSS, JavaScript** – Frontend UI  
- **Bootstrap/Tailwind** – Responsive design  
- **Gemini API** – AI Chatbot integration  

---

## 📂 Folder & File Structure  

raghavendra_math_website/
│── app.py # Main Flask application
│── config.py # Configuration (DB, API keys)
│── requirements.txt # Dependencies
│
│── static/ # Static files (CSS, JS, Images)
│ │── css/
│ │ ├── styles.css # Main CSS file
│ │── js/
│ │ ├── chatbot.js # JavaScript for AI chatbot UI
│ │── images/ # Website images
│
│── templates/ # HTML templates
│ │── base.html # Common base template
│ │── index.html # Home page
│ │── about.html # About Us page
│ │── announcements.html # Announcements page
│ │── booking.html # Seva Booking page
│ │── donation.html # Donations page
│
│── database/ # Database-related files
│ │── schema.sql # MySQL schema for tables
│
│── routes/ # Flask routes (modularized)
│ │── init.py
│ │── seva.py # Seva booking routes
│ │── donation.py # Donation routes
│ │── chatbot.py # AI Chatbot API integration
│
│── models/ # Database models
│ │── seva.py # Seva booking model
│ │── donation.py # Donation model
│
│── instance/ # Stores database (if using SQLite)
│── .env # Environment variables (API keys)
│── README.md # Project Documentation