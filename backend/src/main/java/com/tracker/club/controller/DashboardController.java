package com.tracker.club.controller;

import com.tracker.club.entity.Activity;
import com.tracker.club.entity.Club;
import com.tracker.club.entity.LeaderboardEntry;
import com.tracker.club.entity.Participation;
import com.tracker.club.service.ActivityService;
import com.tracker.club.service.ClubService;
import com.tracker.club.service.LeaderboardService;
import com.tracker.club.service.ParticipationService;
import com.tracker.club.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * REST Controller for Dashboard statistics and summaries.
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private ParticipationService participationService;

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> data = new HashMap<>();

        // 1. Four Summary Cards
        long totalClubs = clubService.getTotalClubsCount();
        long totalStudents = studentService.getTotalStudentsCount();
        long totalActivities = activityService.getTotalActivitiesCount();
        long activeMembers = participationService.getActiveStudentsCount();

        data.put("totalClubs", totalClubs);
        data.put("totalStudents", totalStudents);
        data.put("totalActivities", totalActivities);
        data.put("activeMembers", activeMembers);

        // 2. Recent Activities (up to 5 recent)
        List<Activity> allActivities = activityService.getAllActivities();
        // Sort activities by date descending
        allActivities.sort((a, b) -> b.getActivityDate().compareTo(a.getActivityDate()));
        List<Activity> recentActivities = allActivities.subList(0, Math.min(5, allActivities.size()));
        data.put("recentActivities", recentActivities);

        // 3. Top Five Active Students
        List<LeaderboardEntry> topFive = leaderboardService.getTopFiveStudents();
        data.put("topStudents", topFive);

        // 4. Club Participation Summary for CSS Visual Bars
        // For each club, calculate how many participations occurred
        List<Club> allClubs = clubService.getAllClubs();
        List<Participation> allParticipations = participationService.getAllParticipations();
        
        List<Map<String, Object>> clubSummary = new ArrayList<>();
        int maxParticipationInAnyClub = 1;

        for (Club club : allClubs) {
            int partCount = 0;
            for (Participation p : allParticipations) {
                if (p.getActivity() != null && club.getClubId().equals(p.getActivity().getClubId())) {
                    partCount++;
                }
            }
            if (partCount > maxParticipationInAnyClub) {
                maxParticipationInAnyClub = partCount;
            }

            Map<String, Object> clubStat = new HashMap<>();
            clubStat.put("clubId", club.getClubId());
            clubStat.put("clubName", club.getClubName());
            clubStat.put("category", club.getCategory());
            clubStat.put("participationCount", partCount);
            clubSummary.add(clubStat);
        }

        // Add calculated percentage for CSS bar width
        for (Map<String, Object> cStat : clubSummary) {
            int pCount = (int) cStat.get("participationCount");
            int percentage = (int) Math.round(((double) pCount / maxParticipationInAnyClub) * 100);
            cStat.put("percentage", Math.max(5, percentage)); // At least 5% width for visual clarity
        }

        data.put("clubSummary", clubSummary);

        return data;
    }
}
