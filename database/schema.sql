CREATE TABLE seva_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seva_name VARCHAR(255),
    seva_date DATE,
    available_slots INT DEFAULT 60,
    UNIQUE (seva_name, seva_date) -- Ensures one record per seva per date
);
