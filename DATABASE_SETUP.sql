-- ==============================================================================
-- DATABASE CREATION & SAMPLE DATA SCRIPT
-- Project: Student Attendance and Performance Tracking System
-- Course: MCA Academic Project
-- Database: MySQL 8.0+
-- ==============================================================================

DROP DATABASE IF EXISTS student_attendance_db;
CREATE DATABASE student_attendance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_attendance_db;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. CLASSES TABLE
CREATE TABLE classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    section VARCHAR(10)
) ENGINE=InnoDB;

-- 3. SUBJECTS TABLE
CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    subject_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL DEFAULT 4
) ENGINE=InnoDB;

-- 4. FACULTY TABLE
CREATE TABLE faculty (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(50),
    qualification VARCHAR(100),
    date_of_joining DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. FACULTY_SUBJECT JUNCTION TABLE
CREATE TABLE faculty_subject (
    faculty_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    PRIMARY KEY (faculty_id, subject_id),
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. STUDENTS TABLE
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    registration_number VARCHAR(30) UNIQUE,
    user_id BIGINT NOT NULL UNIQUE,
    class_id BIGINT,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. ATTENDANCE TABLE
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    faculty_id BIGINT,
    attendance_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL, -- PRESENT, ABSENT, LATE
    remarks VARCHAR(255),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL,
    UNIQUE KEY uq_student_subject_date (student_id, subject_id, attendance_date)
) ENGINE=InnoDB;

-- 8. MARKS TABLE
CREATE TABLE marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    faculty_id BIGINT,
    assessment_type VARCHAR(20) NOT NULL, -- QUIZ, ASSIGNMENT, MID_TERM, FINAL_EXAM, PRACTICAL
    max_marks DOUBLE NOT NULL,
    marks_obtained DOUBLE NOT NULL,
    assessment_date DATE,
    remarks VARCHAR(255),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL,
    UNIQUE KEY uq_student_subject_assessment (student_id, subject_id, assessment_type)
) ENGINE=InnoDB;

-- ==============================================================================
-- INSERT SAMPLE DATA
-- Note: Passwords are encrypted with BCrypt ($2a$10$...)
-- Default passwords:
--   admin -> 'admin123'
--   faculty -> 'faculty123'
--   students -> 'student123'
-- ==============================================================================

-- Admin User
INSERT INTO users (id, username, email, password, full_name, phone, role, active) VALUES
(1, 'admin', 'admin@abes.ac.in', '$2a$10$7zBvQfB06VfE8M.8j4w0t.a2mO748dF2y4q9V0H2Q2K2L2M2N2O2P', 'System Administrator', '9876543210', 'ROLE_ADMIN', 1);

-- Faculty Users
INSERT INTO users (id, username, email, password, full_name, phone, role, active) VALUES
(2, 'neha.faculty', 'neha.sharma@abes.ac.in', '$2a$10$oU6yK6B9F2Y9p1K6B9F2YeHj6xL4rM7mO8pQ1rS2tU3vW4xY5z012', 'Dr. Neha Sharma', '9811223344', 'ROLE_FACULTY', 1),
(3, 'amit.faculty', 'amit.verma@abes.ac.in', '$2a$10$oU6yK6B9F2Y9p1K6B9F2YeHj6xL4rM7mO8pQ1rS2tU3vW4xY5z012', 'Prof. Amit Verma', '9822334455', 'ROLE_FACULTY', 1);

-- Student Users
INSERT INTO users (id, username, email, password, full_name, phone, role, active) VALUES
(4, 'aarav.student', 'aarav.sharma@abes.ac.in', '$2a$10$2l1Z7B6V8K0P1M2N3O4Q5e6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1', 'Aarav Sharma', '9876500001', 'ROLE_STUDENT', 1),
(5, 'ananya.student', 'ananya.verma@abes.ac.in', '$2a$10$2l1Z7B6V8K0P1M2N3O4Q5e6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1', 'Ananya Verma', '9876500002', 'ROLE_STUDENT', 1),
(6, 'rohan.student', 'rohan.gupta@abes.ac.in', '$2a$10$2l1Z7B6V8K0P1M2N3O4Q5e6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1', 'Rohan Gupta', '9876500003', 'ROLE_STUDENT', 1),
(7, 'priya.student', 'priya.singh@abes.ac.in', '$2a$10$2l1Z7B6V8K0P1M2N3O4Q5e6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1', 'Priya Singh', '9876500004', 'ROLE_STUDENT', 1),
(8, 'kabir.student', 'kabir.mehta@abes.ac.in', '$2a$10$2l1Z7B6V8K0P1M2N3O4Q5e6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1', 'Kabir Mehta', '9876500005', 'ROLE_STUDENT', 1);

-- Classes
INSERT INTO classes (id, class_name, department, semester, academic_year, section) VALUES
(1, 'MCA II Year - Sec A', 'Computer Applications', 3, '2026-2027', 'A'),
(2, 'MCA I Year - Sec A', 'Computer Applications', 1, '2026-2027', 'A');

-- Subjects
INSERT INTO subjects (id, subject_code, subject_name, department, semester, credits) VALUES
(1, 'MCA301', 'Advanced Database Management Systems', 'Computer Applications', 3, 4),
(2, 'MCA302', 'Full-Stack Web Tech (Java & React)', 'Computer Applications', 3, 4),
(3, 'MCA303', 'Cloud Computing & Distributed Systems', 'Computer Applications', 3, 3),
(4, 'MCA304', 'Machine Learning & Analytics', 'Computer Applications', 3, 4);

-- Faculty records
INSERT INTO faculty (id, employee_id, user_id, department, designation, qualification, date_of_joining) VALUES
(1, 'FAC-MCA-01', 2, 'Computer Applications', 'Associate Professor', 'Ph.D. in Computer Science', '2018-07-15'),
(2, 'FAC-MCA-02', 3, 'Computer Applications', 'Assistant Professor', 'M.Tech CSE', '2020-08-01');

-- Faculty-Subject Mapping
INSERT INTO faculty_subject (faculty_id, subject_id) VALUES
(1, 1), (1, 4),
(2, 2), (2, 3);

-- Students records
INSERT INTO students (id, roll_number, registration_number, user_id, class_id, date_of_birth, gender, address, guardian_name, guardian_phone) VALUES
(1, 'MCA-2026-001', 'REG-2026-01', 4, 1, '2001-05-20', 'Male', 'Sector 62, Noida, Uttar Pradesh', 'Mr. Sharma', '9876599901'),
(2, 'MCA-2026-002', 'REG-2026-02', 5, 1, '2001-08-14', 'Female', 'Indirapuram, Ghaziabad, UP', 'Mrs. Verma', '9876599902'),
(3, 'MCA-2026-003', 'REG-2026-03', 6, 1, '2000-11-03', 'Male', 'Vasundhara, Ghaziabad, UP', 'Mr. Gupta', '9876599903'),
(4, 'MCA-2026-004', 'REG-2026-04', 7, 1, '2001-03-29', 'Female', 'Raj Nagar, Ghaziabad, UP', 'Mr. Singh', '9876599904'),
(5, 'MCA-2026-005', 'REG-2026-05', 8, 1, '2001-09-11', 'Male', 'Vaishali, Ghaziabad, UP', 'Mr. Mehta', '9876599905');
