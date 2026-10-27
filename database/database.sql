-- ==========================================================
-- DATABASE SCRIPT FOR STUDENT CLUB ACTIVITY TRACKER
-- Database: MySQL
-- Purpose: Academic Project for College Evaluation
-- ==========================================================

-- 1. Create the database if it does not already exist
CREATE DATABASE IF NOT EXISTS student_club_db;
USE student_club_db;

-- 2. Drop tables in reverse order of foreign key dependencies (clean reset)
DROP TABLE IF EXISTS participations;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS clubs;

-- ==========================================================
-- TABLE 1: clubs
-- Purpose: Stores details of college clubs.
-- Demonstrates OOP Inheritance in Java:
-- Base class 'Club', with specialized clubs like 'CodingClub'
-- and 'LiteraryClub' storing specific properties.
-- ==========================================================
CREATE TABLE clubs (
    club_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,         -- e.g., 'Technical', 'Literary', 'Cultural', 'Sports'
    faculty_coordinator VARCHAR(100) NOT NULL,
    club_type VARCHAR(50) DEFAULT 'General', -- Discriminator column for Java Inheritance ('General', 'Coding', 'Literary')
    programming_language VARCHAR(50),       -- Specific to CodingClub subclass
    magazine_name VARCHAR(100),              -- Specific to LiteraryClub subclass
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- TABLE 2: students
-- Purpose: Stores registered college students.
-- Each student has a unique registration number.
-- ==========================================================
CREATE TABLE students (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE, -- Prevents duplicate student registrations
    email VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,                 -- e.g., 'CSE', 'IT', 'ECE', 'MECH'
    academic_year VARCHAR(20) NOT NULL,              -- e.g., '1st Year', '2nd Year', '3rd Year', '4th Year'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- TABLE 3: activities
-- Purpose: Stores club activities/events conducted in college.
-- Linked to a club via club_id foreign key.
-- ==========================================================
CREATE TABLE activities (
    activity_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_name VARCHAR(150) NOT NULL,
    club_id BIGINT NOT NULL,
    club_name VARCHAR(100) NOT NULL,
    activity_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_club FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE
);

-- ==========================================================
-- TABLE 4: participations
-- Purpose: Stores attendance records of students in activities.
-- Many-to-Many mapping table between students and activities.
-- A student can participate in multiple activities, but cannot
-- be recorded twice for the SAME activity.
-- ==========================================================
CREATE TABLE participations (
    participation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    participation_date DATE NOT NULL,
    remarks VARCHAR(255) DEFAULT 'Attended',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_part_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_part_activity FOREIGN KEY (activity_id) REFERENCES activities(activity_id) ON DELETE CASCADE,
    -- Prevent duplicate participation for the same student in the same activity
    CONSTRAINT uk_student_activity UNIQUE (student_id, activity_id)
);

-- ==========================================================
-- SAMPLE INSERT STATEMENTS
-- Ready-made data for testing and faculty project demo
-- ==========================================================

-- Insert Sample Clubs
INSERT INTO clubs (club_name, description, category, faculty_coordinator, club_type, programming_language, magazine_name) VALUES
('CodeCrafters Club', 'Fosters software development, algorithms, and hackathon skills.', 'Technical', 'Dr. Ramesh Kumar', 'Coding', 'Java & Python', NULL),
('Literary & Debate Society', 'Organizes debates, essay writing, and college literary fests.', 'Literary', 'Prof. Meera Sharma', 'Literary', NULL, 'The Campus Voice'),
('Robotics & IoT Club', 'Focuses on microcontrollers, robotics builds, and automation projects.', 'Technical', 'Dr. Anand Verma', 'General', NULL, NULL),
('Fine Arts & Cultural Club', 'Promotes dance, music, theater, and creative cultural expressions.', 'Cultural', 'Prof. Priya Nair', 'General', NULL, NULL),
('Sports & Fitness Club', 'Encourages athletics, cricket, football, and physical wellness.', 'Sports', 'Coach Vikram Singh', 'General', NULL, NULL);

-- Insert Sample Students
INSERT INTO students (student_name, registration_number, email, department, academic_year) VALUES
('Priya Sharma', '2023CSE0101', 'priya.sharma@college.edu', 'CSE', '3rd Year'),
('Arun Patel', '2023IT0204', 'arun.patel@college.edu', 'IT', '3rd Year'),
('Divya Nair', '2024ECE0312', 'divya.nair@college.edu', 'ECE', '2nd Year'),
('Rahul Verma', '2022MECH0405', 'rahul.verma@college.edu', 'MECH', '4th Year'),
('Sneha Reddy', '2023CSE0155', 'sneha.reddy@college.edu', 'CSE', '3rd Year'),
('Karthik Raja', '2024IT0289', 'karthik.raja@college.edu', 'IT', '2nd Year'),
('Ananya Gupta', '2025CSE0042', 'ananya.gupta@college.edu', 'CSE', '1st Year'),
('Manoj Kumar', '2022ECE0199', 'manoj.kumar@college.edu', 'ECE', '4th Year');

-- Insert Sample Activities
INSERT INTO activities (activity_name, club_id, club_name, activity_date, description) VALUES
('Java Spring Boot Bootcamp', 1, 'CodeCrafters Club', '2026-09-10', 'Hands-on workshop building REST APIs and web services.'),
('Inter-College Debate Championship', 2, 'Literary & Debate Society', '2026-09-15', 'Debate on the ethical implications of Artificial Intelligence.'),
('Autonomous Line Follower Workshop', 3, 'Robotics & IoT Club', '2026-09-20', 'Building Arduino-based line follower robots from scratch.'),
('Annual Cultural Fest Auditions', 4, 'Fine Arts & Cultural Club', '2026-09-28', 'Talent hunt for college dance and music teams.'),
('Intra-Department Cricket Tournament', 5, 'Sports & Fitness Club', '2026-10-02', 'Friendly 10-over cricket tournament among all branches.'),
('Web Development Hackathon 2026', 1, 'CodeCrafters Club', '2026-10-08', '24-hour hackathon creating community impact applications.');

-- Insert Sample Participations
-- Priya: 4 activities
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (1, 1, '2026-09-10', 'Excellent participation');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (1, 2, '2026-09-15', 'Best Speaker runner-up');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (1, 3, '2026-09-20', 'Built working hardware');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (1, 6, '2026-10-08', 'First Prize Winner');

-- Arun: 3 activities
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (2, 1, '2026-09-10', 'Completed API project');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (2, 5, '2026-10-02', 'Team Captain');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (2, 6, '2026-10-08', 'Second Prize Winner');

-- Divya: 3 activities
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (3, 2, '2026-09-15', 'Active Participant');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (3, 3, '2026-09-20', 'Sensor calibration lead');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (3, 4, '2026-09-28', 'Solo Classical Dance selected');

-- Rahul: 2 activities
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (4, 3, '2026-09-20', 'Chassis fabrication');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (4, 5, '2026-10-02', 'Best Bowler award');

-- Sneha: 2 activities
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (5, 1, '2026-09-10', 'Completed API project');
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (5, 6, '2026-10-08', 'Finalist');

-- Karthik: 1 activity
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (6, 5, '2026-10-02', 'Played in opening match');

-- Ananya: 1 activity
INSERT INTO participations (student_id, activity_id, participation_date, remarks) VALUES (7, 4, '2026-09-28', 'Vocal Music Selected');
