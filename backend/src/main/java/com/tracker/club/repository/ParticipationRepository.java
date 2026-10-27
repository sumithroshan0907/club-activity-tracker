package com.tracker.club.repository;

import com.tracker.club.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Participation entity.
 */
@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    // Check if the student has already participated in this activity
    boolean existsByStudent_StudentIdAndActivity_ActivityId(Long studentId, Long activityId);

    // Find all participations by a specific student
    List<Participation> findByStudent_StudentId(Long studentId);

    // Find all participations for a specific activity
    List<Participation> findByActivity_ActivityId(Long activityId);

    // Find all participations for activities hosted by a specific club
    List<Participation> findByActivity_ClubId(Long clubId);

    // Count unique active students who have attended at least one activity
    @Query("SELECT COUNT(DISTINCT p.student.studentId) FROM Participation p")
    Long countDistinctActiveStudents();
}
