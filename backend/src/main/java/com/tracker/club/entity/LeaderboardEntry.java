package com.tracker.club.entity;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: CLASSES AND OBJECTS / DATA TRANSFER OBJECT
 * ==========================================================
 * LeaderboardEntry represents a ranked student based on total
 * activities attended.
 * Calculated dynamically using Java Collections and loops.
 */
public class LeaderboardEntry {

    private int rank;
    private Long studentId;
    private String studentName;
    private String registrationNumber;
    private String department;
    private String academicYear;
    private int activitiesAttended;
    private String badge; // e.g., 'Gold Achiever', 'Silver Achiever', 'Bronze Achiever', 'Active Member'

    public LeaderboardEntry() {
    }

    public LeaderboardEntry(int rank, Long studentId, String studentName, String registrationNumber, 
                            String department, String academicYear, int activitiesAttended, String badge) {
        this.rank = rank;
        this.studentId = studentId;
        this.studentName = studentName;
        this.registrationNumber = registrationNumber;
        this.department = department;
        this.academicYear = academicYear;
        this.activitiesAttended = activitiesAttended;
        this.badge = badge;
    }

    // Getters and Setters
    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

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

    public int getActivitiesAttended() {
        return activitiesAttended;
    }

    public void setActivitiesAttended(int activitiesAttended) {
        this.activitiesAttended = activitiesAttended;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }
}
