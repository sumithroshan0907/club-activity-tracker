package com.tracker.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: INHERITANCE (SUBCLASS)
 * ==========================================================
 * LiteraryClub inherits all properties and methods from Club (Superclass).
 * It demonstrates:
 * 1. Extending the parent class using 'extends Club'.
 * 2. Adding subclass-specific attributes: magazineName.
 * 3. Method Overriding: customizing getClubDetails().
 */
@Entity
@DiscriminatorValue("Literary")
public class LiteraryClub extends Club {

    @Column(name = "magazine_name")
    private String magazineName;

    // Default Constructor
    public LiteraryClub() {
        super();
    }

    // Parameterized Constructor using 'super' keyword
    public LiteraryClub(String clubName, String description, String category, 
                        String facultyCoordinator, String magazineName) {
        super(clubName, description, category, facultyCoordinator);
        this.magazineName = magazineName;
    }

    // Method Overriding
    @Override
    public String getClubDetails() {
        return super.getClubDetails() + " | Official Magazine: " + this.magazineName;
    }

    // Getter and Setter
    public String getMagazineName() {
        return magazineName;
    }

    public void setMagazineName(String magazineName) {
        this.magazineName = magazineName;
    }
}
