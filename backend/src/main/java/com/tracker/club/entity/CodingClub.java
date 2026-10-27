package com.tracker.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: INHERITANCE (SUBCLASS)
 * ==========================================================
 * CodingClub inherits all properties and methods from Club (Superclass).
 * It demonstrates:
 * 1. Extending the parent class using 'extends Club'.
 * 2. Adding subclass-specific attributes: programmingLanguage.
 * 3. Method Overriding: customizing getClubDetails().
 */
@Entity
@DiscriminatorValue("Coding")
public class CodingClub extends Club {

    @Column(name = "programming_language")
    private String programmingLanguage;

    // Default Constructor
    public CodingClub() {
        super();
    }

    // Parameterized Constructor using 'super' keyword to initialize parent fields
    public CodingClub(String clubName, String description, String category, 
                      String facultyCoordinator, String programmingLanguage) {
        super(clubName, description, category, facultyCoordinator);
        this.programmingLanguage = programmingLanguage;
    }

    // Method Overriding (Polymorphism)
    @Override
    public String getClubDetails() {
        return super.getClubDetails() + " | Tech Stack: " + this.programmingLanguage;
    }

    // Getter and Setter for subclass attribute
    public String getProgrammingLanguage() {
        return programmingLanguage;
    }

    public void setProgrammingLanguage(String programmingLanguage) {
        this.programmingLanguage = programmingLanguage;
    }
}
