package com.tracker.club.repository;

import com.tracker.club.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Check if a registration number already exists (prevents duplicate registrations)
    boolean existsByRegistrationNumber(String registrationNumber);

    // Check if registration number exists for another student during update
    boolean existsByRegistrationNumberAndStudentIdNot(String registrationNumber, Long studentId);

    // Find student by registration number
    Optional<Student> findByRegistrationNumber(String registrationNumber);

    // Search students by name or registration number
    List<Student> findByStudentNameContainingIgnoreCaseOrRegistrationNumberContainingIgnoreCase(String name, String regNo);
}
