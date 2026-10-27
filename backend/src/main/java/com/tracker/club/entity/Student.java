package com.tracker.club.entity;

import jakarta.persistence.*;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: CLASSES AND OBJECTS
 * ==========================================================
 * The Student class represents an enrolled student in the college.
 * It encapsulates student data with private fields, public getters/setters,
 * constructors, and business helper methods.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber; // Must be unique

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "department", nullable = false)
    private String department; // e.g., CSE, IT, ECE, MECH

    @Column(name = "academic_year", nullable = false)
    private String academicYear; // e.g., 1st Year, 2nd Year, 3rd Year, 4th Year

    // Default Constructor
    public Student() {
    }

    // Parameterized Constructor
    public Student(String studentName, String registrationNumber, String email, String department, String academicYear) {
        this.studentName = studentName;
        this.registrationNumber = registrationNumber;
        this.email = email;
        this.department = department;
        this.academicYear = academicYear;
    }

    // Helper method to display a formatted summary of the student
    public String getStudentSummary() {
        return studentName + " (" + registrationNumber + ") - " + department + " - " + academicYear;
    }

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
}
