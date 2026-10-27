package com.tracker.club.service;

import com.tracker.club.entity.LeaderboardEntry;
import com.tracker.club.entity.Participation;
import com.tracker.club.entity.Student;
import com.tracker.club.exception.DuplicateRecordException;
import com.tracker.club.exception.ResourceNotFoundException;
import com.tracker.club.repository.ParticipationRepository;
import com.tracker.club.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service class for managing Student business logic.
 * Enforces business rules like unique student registration numbers.
 */
@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ParticipationRepository participationRepository;

    @Autowired
    private LeaderboardService leaderboardService;

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    // Add new student
    public Student saveStudent(Student student) {
        // Simple input validation
        if (student.getRegistrationNumber() == null || student.getRegistrationNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Registration number cannot be empty");
        }

        // Prevent duplicate registration numbers
        if (studentRepository.existsByRegistrationNumber(student.getRegistrationNumber().trim())) {
            throw new DuplicateRecordException("Student with Registration Number '" 
                    + student.getRegistrationNumber() + "' already exists!");
        }

        student.setRegistrationNumber(student.getRegistrationNumber().trim());
        return studentRepository.save(student);
    }

    // Update student details
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = getStudentById(id);

        // Check if the updated registration number belongs to another student
        String newRegNo = updatedStudent.getRegistrationNumber().trim();
        if (studentRepository.existsByRegistrationNumberAndStudentIdNot(newRegNo, id)) {
            throw new DuplicateRecordException("Registration Number '" + newRegNo + "' is already used by another student!");
        }

        existingStudent.setStudentName(updatedStudent.getStudentName());
        existingStudent.setRegistrationNumber(newRegNo);
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setAcademicYear(updatedStudent.getAcademicYear());

        return studentRepository.save(existingStudent);
    }

    // Delete student
    public void deleteStudent(Long id) {
        Student existingStudent = getStudentById(id);
        studentRepository.delete(existingStudent);
    }

    // Search students by name or registration number
    public List<Student> searchStudents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.findByStudentNameContainingIgnoreCaseOrRegistrationNumberContainingIgnoreCase(keyword.trim(), keyword.trim());
    }

    // Total students count
    public long getTotalStudentsCount() {
        return studentRepository.count();
    }

    // Get comprehensive student details (events attended, events won, active clubs, rank)
    public Map<String, Object> getStudentDetailsWithActivities(Long studentId) {
        Student student = getStudentById(studentId);
        List<Participation> participations = participationRepository.findByStudent_StudentId(studentId);

        // Find student leaderboard rank & badge
        List<LeaderboardEntry> leaderboard = leaderboardService.getLeaderboard();
        LeaderboardEntry studentEntry = leaderboard.stream()
                .filter(e -> e.getStudentId().equals(studentId))
                .findFirst()
                .orElse(null);

        int rank = studentEntry != null ? studentEntry.getRank() : leaderboard.size() + 1;
        String badge = studentEntry != null ? studentEntry.getBadge() : "Member";

        // Count events won / honors
        long eventsWon = participations.stream()
                .filter(p -> {
                    if (p.getRemarks() == null) return false;
                    String r = p.getRemarks().toLowerCase();
                    return r.contains("winner") || r.contains("prize") || r.contains("1st") 
                            || r.contains("2nd") || r.contains("runner") || r.contains("speaker") || r.contains("honors");
                })
                .count();

        // Unique clubs the student has participated in
        Set<String> uniqueClubs = participations.stream()
                .map(p -> p.getActivity() != null && p.getActivity().getClubName() != null ? p.getActivity().getClubName() : "General")
                .collect(Collectors.toSet());

        Map<String, Object> details = new HashMap<>();
        details.put("student", student);
        details.put("totalEventsAttended", participations.size());
        details.put("eventsWon", eventsWon);
        details.put("clubsCount", uniqueClubs.size());
        details.put("clubsList", uniqueClubs);
        details.put("rank", rank);
        details.put("badge", badge);
        details.put("participations", participations);

        return details;
    }
}
