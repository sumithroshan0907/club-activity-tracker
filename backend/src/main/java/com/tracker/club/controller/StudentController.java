package com.tracker.club.controller;

import com.tracker.club.entity.Student;
import com.tracker.club.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Students.
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // 1. Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // 2. Get student by ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // 3. Add a new student
    @PostMapping
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student savedStudent = studentService.saveStudent(student);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    // 4. Update student details
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    // 5. Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully!"));
    }

    // 6. Search students
    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam(required = false) String keyword) {
        return studentService.searchStudents(keyword);
    }

    // 7. Get full student profile & activity details
    @GetMapping("/{id}/details")
    public ResponseEntity<Map<String, Object>> getStudentDetails(@PathVariable Long id) {
        Map<String, Object> details = studentService.getStudentDetailsWithActivities(id);
        return ResponseEntity.ok(details);
    }
}
