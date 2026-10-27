package com.tracker.club.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: CLASSES AND OBJECTS
 * ==========================================================
 * The Activity class represents an event or session organized by a club.
 */
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Long activityId;

    @Column(name = "activity_name", nullable = false)
    private String activityName;

    @Column(name = "club_id", nullable = false)
    private Long clubId;

    @Column(name = "club_name", nullable = false)
    private String clubName;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Default Constructor
    public Activity() {
    }

    // Parameterized Constructor
    public Activity(String activityName, Long clubId, String clubName, LocalDate activityDate, String description) {
        this.activityName = activityName;
        this.clubId = clubId;
        this.clubName = clubName;
        this.activityDate = activityDate;
        this.description = description;
    }

    // Helper method
    public String getActivityInfo() {
        return activityName + " organized by " + clubName + " on " + activityDate;
    }

    // Getters and Setters
    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public String getClubName() {
        return clubName;
    }

    public void setClubName(String clubName) {
        this.clubName = clubName;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
