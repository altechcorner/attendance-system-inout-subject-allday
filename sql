CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS pending_emails;
DROP TABLE IF EXISTS subjects;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_number VARCHAR(50) UNIQUE,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_code VARCHAR(50) UNIQUE,
  subject_description VARCHAR(255) NOT NULL
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  subject_id INT,
  date DATE,
  time_in DATETIME,
  time_out DATETIME,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE pending_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  html_message TEXT,
  send_at DATETIME NOT NULL,
  sent TINYINT(1) DEFAULT 0
);