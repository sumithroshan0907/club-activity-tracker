package com.tracker.club.controller;

import com.tracker.club.entity.Club;
import com.tracker.club.entity.CodingClub;
import com.tracker.club.entity.LiteraryClub;
import com.tracker.club.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Clubs.
 * Exposes endpoints for CRUD and search operations.
 */
@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "*") // Allows React frontend to communicate with backend
public class ClubController {

    @Autowired
    private ClubService clubService;

    // 1. Get all clubs
    @GetMapping
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    // 2. Get club by ID
    @GetMapping("/{id}")
    public Club getClubById(@PathVariable Long id) {
        return clubService.getClubById(id);
    }

    // 3. Add a new club (demonstrates OOP Inheritance handling)
    @PostMapping
    public ResponseEntity<Club> addClub(@RequestBody Map<String, String> payload) {
        String clubName = payload.get("clubName");
        String description = payload.get("description");
        String category = payload.get("category");
        String facultyCoordinator = payload.get("facultyCoordinator");
        String clubType = payload.getOrDefault("clubType", "General");
        String programmingLanguage = payload.get("programmingLanguage");
        String magazineName = payload.get("magazineName");

        Club club;
        // Check if subclass should be instantiated
        if ("Coding".equalsIgnoreCase(clubType) || "Technical".equalsIgnoreCase(category)) {
            CodingClub codingClub = new CodingClub(clubName, description, category, facultyCoordinator, programmingLanguage);
            club = codingClub;
        } else if ("Literary".equalsIgnoreCase(clubType) || "Literary".equalsIgnoreCase(category)) {
            LiteraryClub literaryClub = new LiteraryClub(clubName, description, category, facultyCoordinator, magazineName);
            club = literaryClub;
        } else {
            club = new Club(clubName, description, category, facultyCoordinator);
        }

        Club savedClub = clubService.saveClub(club);
        return new ResponseEntity<>(savedClub, HttpStatus.CREATED);
    }

    // 4. Update club
    @PutMapping("/{id}")
    public Club updateClub(@PathVariable Long id, @RequestBody Club club) {
        return clubService.updateClub(id, club);
    }

    // 5. Delete club
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.ok(Map.of("message", "Club deleted successfully!"));
    }

    // 6. Search clubs by name
    @GetMapping("/search")
    public List<Club> searchClubs(@RequestParam(required = false) String keyword) {
        return clubService.searchClubs(keyword);
    }

    // 7. Get club details along with enrolled/participating students
    @GetMapping("/{id}/details")
    public ResponseEntity<Map<String, Object>> getClubDetailsWithMembers(@PathVariable Long id) {
        Map<String, Object> details = clubService.getClubDetailsWithMembers(id);
        return ResponseEntity.ok(details);
    }
}
