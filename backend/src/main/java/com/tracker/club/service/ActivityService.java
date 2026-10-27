package com.tracker.club.service;

import com.tracker.club.entity.Activity;
import com.tracker.club.entity.Club;
import com.tracker.club.exception.ResourceNotFoundException;
import com.tracker.club.repository.ActivityRepository;
import com.tracker.club.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for managing Club Activities.
 */
@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ClubRepository clubRepository;

    // Get all activities
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    // Get activity by ID
    public Activity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with ID: " + id));
    }

    // Add new activity
    public Activity saveActivity(Activity activity) {
        // Simple validation
        if (activity.getActivityName() == null || activity.getActivityName().trim().isEmpty()) {
            throw new IllegalArgumentException("Activity name cannot be empty");
        }

        // Verify that the club exists
        Club club = clubRepository.findById(activity.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected Club does not exist with ID: " + activity.getClubId()));

        // Ensure club name is synced
        activity.setClubName(club.getClubName());

        return activityRepository.save(activity);
    }

    // Update activity
    public Activity updateActivity(Long id, Activity updatedActivity) {
        Activity existingActivity = getActivityById(id);

        Club club = clubRepository.findById(updatedActivity.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected Club does not exist with ID: " + updatedActivity.getClubId()));

        existingActivity.setActivityName(updatedActivity.getActivityName());
        existingActivity.setClubId(updatedActivity.getClubId());
        existingActivity.setClubName(club.getClubName());
        existingActivity.setActivityDate(updatedActivity.getActivityDate());
        existingActivity.setDescription(updatedActivity.getDescription());

        return activityRepository.save(existingActivity);
    }

    // Delete activity
    public void deleteActivity(Long id) {
        Activity existingActivity = getActivityById(id);
        activityRepository.delete(existingActivity);
    }

    // Search activities
    public List<Activity> searchActivities(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllActivities();
        }
        return activityRepository.findByActivityNameContainingIgnoreCaseOrClubNameContainingIgnoreCase(keyword.trim(), keyword.trim());
    }

    // Total activities count
    public long getTotalActivitiesCount() {
        return activityRepository.count();
    }
}
