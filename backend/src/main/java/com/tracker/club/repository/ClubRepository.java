package com.tracker.club.repository;

import com.tracker.club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Club entity.
 * Spring Data JPA provides standard CRUD operations automatically:
 * - findAll()
 * - findById()
 * - save()
 * - deleteById()
 */
@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    
    // Custom query method to search clubs by name (case-insensitive)
    List<Club> findByClubNameContainingIgnoreCase(String keyword);
    
    // Custom query method to find clubs by category
    List<Club> findByCategory(String category);
}
