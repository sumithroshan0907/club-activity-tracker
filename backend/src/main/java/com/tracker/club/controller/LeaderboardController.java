package com.tracker.club.controller;

import com.tracker.club.entity.LeaderboardEntry;
import com.tracker.club.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for Student Leaderboard.
 */
@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    // 1. Get full leaderboard ranked by activities attended
    @GetMapping
    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }

    // 2. Get top 5 active students
    @GetMapping("/top5")
    public List<LeaderboardEntry> getTopFive() {
        return leaderboardService.getTopFiveStudents();
    }
}
