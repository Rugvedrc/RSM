CREATE TABLE IF NOT EXISTS seva_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seva_name VARCHAR(255),
    seva_date DATE,
    available_slots INT DEFAULT 60,
    UNIQUE (seva_name, seva_date) -- Ensures one record per seva per date
);

CREATE TABLE IF NOT EXISTS seva_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gothra VARCHAR(100),
    nakshatra VARCHAR(100),
    seva_type VARCHAR(100) NOT NULL,
    seva_date DATE NOT NULL,
    seva_time VARCHAR(20) NOT NULL,
    special_instructions TEXT,
    payment_method VARCHAR(50) NOT NULL,
    family_members JSON,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
