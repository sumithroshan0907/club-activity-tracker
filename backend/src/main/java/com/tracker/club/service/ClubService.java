package com.tracker.club.service;

import com.tracker.club.entity.Activity;
import com.tracker.club.entity.Club;
import com.tracker.club.entity.Participation;
import com.tracker.club.exception.ResourceNotFoundException;
import com.tracker.club.repository.ActivityRepository;
import com.tracker.club.repository.ClubRepository;
import com.tracker.club.repository.ParticipationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Service class for managing Club business logic.
 * Simple, beginner-friendly methods with normal loops and if-else conditions.
 */
@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ParticipationRepository participationRepository;

    // Get all clubs
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    // Get club by ID
    public Club getClubById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with ID: " + id));
    }

    // Add new club
    public Club saveClub(Club club) {
        // Simple input validation
        if (club.getClubName() == null || club.getClubName().trim().isEmpty()) {
            throw new IllegalArgumentException("Club name cannot be empty");
        }
        return clubRepository.save(club);
    }

    // Update existing club
    public Club updateClub(Long id, Club updatedClub) {
        Club existingClub = getClubById(id);
        
        // Update fields
        existingClub.setClubName(updatedClub.getClubName());
        existingClub.setDescription(updatedClub.getDescription());
        existingClub.setCategory(updatedClub.getCategory());
        existingClub.setFacultyCoordinator(updatedClub.getFacultyCoordinator());
        
        return clubRepository.save(existingClub);
    }

    // Delete club
    public void deleteClub(Long id) {
        Club existingClub = getClubById(id);
        clubRepository.delete(existingClub);
    }

    // Search clubs by keyword
    public List<Club> searchClubs(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllClubs();
        }
        return clubRepository.findByClubNameContainingIgnoreCase(keyword.trim());
    }

    // Total clubs count
    public long getTotalClubsCount() {
        return clubRepository.count();
    }

    /**
     * Retrieves detailed club information along with all student members
     * who have participated in events organized by this club.
     * Demonstrates Java Collections (LinkedHashMap, ArrayList, and Comparator sorting).
     */
    public Map<String, Object> getClubDetailsWithMembers(Long clubId) {
        Club club = getClubById(clubId);
        List<Activity> activities = activityRepository.findByClubId(clubId);
        List<Participation> participations = participationRepository.findByActivity_ClubId(clubId);

        // Group participations by student using Java Collections
        Map<Long, Map<String, Object>> studentMap = new LinkedHashMap<>();

        for (Participation p : participations) {
            Long studentId = p.getStudent().getStudentId();
            if (!studentMap.containsKey(studentId)) {
                Map<String, Object> sData = new HashMap<>();
                sData.put("studentId", p.getStudent().getStudentId());
                sData.put("studentName", p.getStudent().getStudentName());
                sData.put("registrationNumber", p.getStudent().getRegistrationNumber());
                sData.put("email", p.getStudent().getEmail());
                sData.put("department", p.getStudent().getDepartment());
                sData.put("academicYear", p.getStudent().getAcademicYear());
                sData.put("activitiesAttendedCount", 0);
                sData.put("participations", new ArrayList<Map<String, Object>>());
                studentMap.put(studentId, sData);
            }

            Map<String, Object> sData = studentMap.get(studentId);
            int currentCount = (int) sData.get("activitiesAttendedCount");
            sData.put("activitiesAttendedCount", currentCount + 1);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> pList = (List<Map<String, Object>>) sData.get("participations");
            Map<String, Object> pItem = new HashMap<>();
            pItem.put("activityId", p.getActivity().getActivityId());
            pItem.put("activityName", p.getActivity().getActivityName());
            pItem.put("participationDate", p.getParticipationDate());
            pItem.put("remarks", p.getRemarks());
            pList.add(pItem);
        }

        // Convert to list and sort by activities attended descending
        List<Map<String, Object>> studentList = new ArrayList<>(studentMap.values());
        studentList.sort((a, b) -> Integer.compare(
                (int) b.get("activitiesAttendedCount"),
                (int) a.get("activitiesAttendedCount")
        ));

        Map<String, Object> result = new HashMap<>();
        result.put("club", club);
        result.put("totalActivities", activities.size());
        result.put("totalParticipations", participations.size());
        result.put("totalStudents", studentList.size());
        result.put("activities", activities);
        result.put("students", studentList);

        return result;
    }
}
