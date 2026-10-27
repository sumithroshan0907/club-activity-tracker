package com.tracker.club.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: CLASSES AND OBJECTS & ASSOCIATIONS
 * ==========================================================
 * The Participation class links a Student to an Activity.
 * It represents an attendance record of a student attending an activity.
 */
@Entity
@Table(
    name = "participations",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "activity_id"}, name = "uk_student_activity")
    }
)
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participation_id")
    private Long participationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "participation_date", nullable = false)
    private LocalDate participationDate;

    @Column(name = "remarks")
    private String remarks; // e.g., 'Attended', 'First Prize', 'Speaker'

    // Default Constructor
    public Participation() {
    }

    // Parameterized Constructor
    public Participation(Student student, Activity activity, LocalDate participationDate, String remarks) {
        this.student = student;
        this.activity = activity;
        this.participationDate = participationDate;
        this.remarks = remarks;
    }

    // Helper method
    public String getParticipationDetails() {
        return student.getStudentName() + " participated in " + activity.getActivityName() + " on " + participationDate;
    }

    // Getters and Setters
    public Long getParticipationId() {
        return participationId;
    }

    public void setParticipationId(Long participationId) {
        this.participationId = participationId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public LocalDate getParticipationDate() {
        return participationDate;
    }

    public void setParticipationDate(LocalDate participationDate) {
        this.participationDate = participationDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
