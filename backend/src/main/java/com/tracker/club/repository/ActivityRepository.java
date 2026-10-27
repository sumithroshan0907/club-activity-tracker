package com.tracker.club.repository;

import com.tracker.club.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Activity entity.
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    // Search activities by name or club name
    List<Activity> findByActivityNameContainingIgnoreCaseOrClubNameContainingIgnoreCase(String name, String clubName);

    // Find all activities conducted by a specific club
    List<Activity> findByClubId(Long clubId);
}
