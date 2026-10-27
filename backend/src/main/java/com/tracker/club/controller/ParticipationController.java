package com.tracker.club.controller;

import com.tracker.club.entity.Participation;
import com.tracker.club.service.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Student Participation records.
 */
@RestController
@RequestMapping("/api/participations")
@CrossOrigin(origins = "*")
public class ParticipationController {

    @Autowired
    private ParticipationService participationService;

    // 1. Get all participation records
    @GetMapping
    public List<Participation> getAllParticipations() {
        return participationService.getAllParticipations();
    }

    // 2. Record new student participation
    @PostMapping
    public ResponseEntity<Participation> recordParticipation(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        Long activityId = Long.valueOf(payload.get("activityId").toString());
        
        LocalDate date = null;
        if (payload.get("participationDate") != null && !payload.get("participationDate").toString().isEmpty()) {
            date = LocalDate.parse(payload.get("participationDate").toString());
        }

        String remarks = (payload.get("remarks") != null) ? payload.get("remarks").toString() : "Attended";

        Participation saved = participationService.recordParticipation(studentId, activityId, date, remarks);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // 3. Delete participation record
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteParticipation(@PathVariable Long id) {
        participationService.deleteParticipation(id);
        return ResponseEntity.ok(Map.of("message", "Participation record deleted successfully!"));
    }
}
