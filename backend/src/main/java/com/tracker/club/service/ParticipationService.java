package com.tracker.club.service;

import com.tracker.club.entity.Activity;
import com.tracker.club.entity.Participation;
import com.tracker.club.entity.Student;
import com.tracker.club.exception.DuplicateRecordException;
import com.tracker.club.exception.ResourceNotFoundException;
import com.tracker.club.repository.ActivityRepository;
import com.tracker.club.repository.ParticipationRepository;
import com.tracker.club.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Service class for managing Student Participation in activities.
 * Enforces the rule that a student cannot be recorded twice for the same activity.
 */
@Service
public class ParticipationService {

    @Autowired
    private ParticipationRepository participationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityRepository activityRepository;

    // Get all participation records
    public List<Participation> getAllParticipations() {
        return participationRepository.findAll();
    }

    // Get participation by ID
    public Participation getParticipationById(Long id) {
        return participationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Participation record not found with ID: " + id));
    }

    // Record new participation
    public Participation recordParticipation(Long studentId, Long activityId, LocalDate date, String remarks) {
        // Validate student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        // Validate activity exists
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with ID: " + activityId));

        // Prevent duplicate attendance for the same student in the same activity
        if (participationRepository.existsByStudent_StudentIdAndActivity_ActivityId(studentId, activityId)) {
            throw new DuplicateRecordException("Duplicate Entry: Student '" + student.getStudentName() 
                    + "' is ALREADY recorded as participating in '" + activity.getActivityName() + "'!");
        }

        // Use current date if none provided
        LocalDate participationDate = (date != null) ? date : LocalDate.now();
        String participationRemarks = (remarks != null && !remarks.trim().isEmpty()) ? remarks.trim() : "Attended";

        Participation participation = new Participation(student, activity, participationDate, participationRemarks);
        return participationRepository.save(participation);
    }

    // Delete a participation record
    public void deleteParticipation(Long id) {
        Participation participation = getParticipationById(id);
        participationRepository.delete(participation);
    }

    // Count distinct students who have attended at least one activity
    public long getActiveStudentsCount() {
        Long count = participationRepository.countDistinctActiveStudents();
        return (count != null) ? count : 0L;
    }
}
