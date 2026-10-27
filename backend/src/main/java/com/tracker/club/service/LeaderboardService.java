package com.tracker.club.service;

import com.tracker.club.entity.LeaderboardEntry;
import com.tracker.club.entity.Participation;
import com.tracker.club.entity.Student;
import com.tracker.club.repository.ParticipationRepository;
import com.tracker.club.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: COLLECTIONS (ArrayList, Map, Sorting)
 * ==========================================================
 * This service calculates the student leaderboard rankings using
 * Java Collections and simple loops.
 * 
 * LOGIC EXPLANATION (FOR FACULTY VIVA):
 * 1. Fetch all registered students and all participation records.
 * 2. Use a Map to count how many activities each student attended.
 * 3. Store each student's results into an ArrayList of LeaderboardEntry objects.
 * 4. Sort the ArrayList in descending order (highest attendance first)
 *    using Collections.sort() with a simple Comparator.
 * 5. Loop through the sorted list to assign sequential ranks (1, 2, 3...)
 *    and award achievement badges (Gold, Silver, Bronze, Active).
 */
@Service
public class LeaderboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ParticipationRepository participationRepository;

    public List<LeaderboardEntry> getLeaderboard() {
        // Step 1: Retrieve all students and participations from MySQL
        List<Student> allStudents = studentRepository.findAll();
        List<Participation> allParticipations = participationRepository.findAll();

        // Step 2: Count activities attended by each student using a Map
        // Key = studentId, Value = activity count
        Map<Long, Integer> attendanceCountMap = new HashMap<>();

        // Loop through participation records and increment count for each student
        for (Participation p : allParticipations) {
            if (p.getStudent() != null) {
                Long sId = p.getStudent().getStudentId();
                int currentCount = attendanceCountMap.getOrDefault(sId, 0);
                attendanceCountMap.put(sId, currentCount + 1);
            }
        }

        // Step 3: Create an ArrayList of LeaderboardEntry objects
        // Demonstrates ArrayList and Object creation
        List<LeaderboardEntry> leaderboardList = new ArrayList<>();

        for (Student student : allStudents) {
            int count = attendanceCountMap.getOrDefault(student.getStudentId(), 0);

            LeaderboardEntry entry = new LeaderboardEntry();
            entry.setStudentId(student.getStudentId());
            entry.setStudentName(student.getStudentName());
            entry.setRegistrationNumber(student.getRegistrationNumber());
            entry.setDepartment(student.getDepartment());
            entry.setAcademicYear(student.getAcademicYear());
            entry.setActivitiesAttended(count);

            leaderboardList.add(entry);
        }

        // Step 4: Sort the ArrayList in descending order of activities attended
        // Demonstrates Collections.sort with a basic Comparator
        Collections.sort(leaderboardList, new Comparator<LeaderboardEntry>() {
            @Override
            public int compare(LeaderboardEntry a, LeaderboardEntry b) {
                // Descending order: b - a
                return Integer.compare(b.getActivitiesAttended(), a.getActivitiesAttended());
            }
        });

        // Step 5: Assign sequential ranks and award badges
        int currentRank = 1;
        for (LeaderboardEntry entry : leaderboardList) {
            entry.setRank(currentRank);

            // Simple if-else logic to assign badges
            if (currentRank == 1 && entry.getActivitiesAttended() > 0) {
                entry.setBadge("Gold Champion");
            } else if (currentRank == 2 && entry.getActivitiesAttended() > 0) {
                entry.setBadge("Silver Star");
            } else if (currentRank == 3 && entry.getActivitiesAttended() > 0) {
                entry.setBadge("Bronze Achiever");
            } else if (entry.getActivitiesAttended() > 0) {
                entry.setBadge("Active Contributor");
            } else {
                entry.setBadge("Member");
            }

            currentRank++;
        }

        return leaderboardList;
    }

    // Get Top 5 students for the Dashboard
    public List<LeaderboardEntry> getTopFiveStudents() {
        List<LeaderboardEntry> fullLeaderboard = getLeaderboard();
        List<LeaderboardEntry> topFive = new ArrayList<>();

        int limit = Math.min(5, fullLeaderboard.size());
        for (int i = 0; i < limit; i++) {
            topFive.add(fullLeaderboard.get(i));
        }

        return topFive;
    }
}
