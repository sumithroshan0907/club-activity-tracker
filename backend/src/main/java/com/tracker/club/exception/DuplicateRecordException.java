package com.tracker.club.exception;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: EXCEPTION HANDLING (CUSTOM EXCEPTION)
 * ==========================================================
 * Thrown when attempting to insert a duplicate record,
 * such as a duplicate Student Registration Number or duplicate
 * participation record for the same activity.
 */
public class DuplicateRecordException extends RuntimeException {

    public DuplicateRecordException(String message) {
        super(message);
    }
}
