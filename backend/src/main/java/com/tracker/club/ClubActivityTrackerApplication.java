package com.tracker.club;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ==========================================================
 * MAIN SPRING BOOT APPLICATION ENTRY POINT
 * Academic Project: Student Club Activity Tracker
 * ==========================================================
 * This class boots up the Spring Boot REST API server,
 * initializes Spring Data JPA repositories, and connects to MySQL.
 */
@SpringBootApplication
public class ClubActivityTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClubActivityTrackerApplication.class, args);
        System.out.println("==========================================================");
        System.out.println(" Student Club Activity Tracker Backend Started Successfully ");
        System.out.println(" REST API URL: http://localhost:8080/api/dashboard/stats ");
        System.out.println("==========================================================");
    }
}
