-- ===================================================================
-- Student Attendance and Performance Tracking System - MySQL Schema
-- ===================================================================

CREATE DATABASE IF NOT EXISTS student_attendance_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_attendance_db;

-- 1. Users Table (Authentication & User Credentials)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL, -- ROLE_ADMIN, ROLE_FACULTY, ROLE_STUDENT
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    section VARCHAR(10),
    INDEX idx_class_dept_sem (department, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    subject_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL DEFAULT 4,
    INDEX idx_subject_code (subject_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(50),
    qualification VARCHAR(100),
    date_of_joining DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_faculty_emp_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Faculty Subject Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS faculty_subject (
    faculty_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    PRIMARY KEY (faculty_id, subject_id),
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Students Table
CREATE TABLE IF NOT EXISTS students (
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
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
    INDEX idx_student_roll (roll_number),
    INDEX idx_student_class (class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
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
    UNIQUE KEY uq_student_subject_date (student_id, subject_id, attendance_date),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_att_student_sub (student_id, subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Marks Table
CREATE TABLE IF NOT EXISTS marks (
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
    UNIQUE KEY uq_student_subject_assessment (student_id, subject_id, assessment_type),
    INDEX idx_marks_student (student_id),
    INDEX idx_marks_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
