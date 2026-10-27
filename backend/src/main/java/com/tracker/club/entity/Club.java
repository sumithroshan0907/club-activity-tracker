package com.tracker.club.entity;

import jakarta.persistence.*;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: CLASSES AND OBJECTS & INHERITANCE (BASE CLASS)
 * ==========================================================
 * The Club class represents a general college club.
 * It serves as the PARENT (Superclass) for specialized clubs
 * like CodingClub and LiteraryClub, demonstrating OOP Inheritance.
 */
@Entity
@Table(name = "clubs")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "club_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("General")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "club_id")
    private Long clubId;

    @Column(name = "club_name", nullable = false)
    private String clubName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false)
    private String category; // Technical, Literary, Cultural, Sports, etc.

    @Column(name = "faculty_coordinator", nullable = false)
    private String facultyCoordinator;

    // Default Constructor (Required by JPA)
    public Club() {
    }

    // Parameterized Constructor
    public Club(String clubName, String description, String category, String facultyCoordinator) {
        this.clubName = clubName;
        this.description = description;
        this.category = category;
        this.facultyCoordinator = facultyCoordinator;
    }

    // Method to return club details summary (can be overridden by subclasses)
    public String getClubDetails() {
        return "Club Name: " + this.clubName + " | Category: " + this.category + " | Coordinator: " + this.facultyCoordinator;
    }

    // Getters and Setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFacultyCoordinator() {
        return facultyCoordinator;
    }

    public void setFacultyCoordinator(String facultyCoordinator) {
        this.facultyCoordinator = facultyCoordinator;
    }
}
