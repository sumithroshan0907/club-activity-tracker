package com.tracker.club.exception;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: EXCEPTION HANDLING (CUSTOM EXCEPTION)
 * ==========================================================
 * Thrown when a requested resource (Student, Club, Activity) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
