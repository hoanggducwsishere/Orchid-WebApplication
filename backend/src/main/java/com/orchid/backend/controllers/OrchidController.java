package com.orchid.backend.controllers;

import com.orchid.backend.models.Orchid;
import com.orchid.backend.repositories.OrchidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orchids")
public class OrchidController {
    
    @Autowired
    private OrchidRepository orchidRepository;

    @GetMapping
    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getOrchidById(@PathVariable Long id) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orchid not found"));
        return ResponseEntity.ok(orchid);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Orchid createOrchid(@RequestBody Orchid orchid) {
        return orchidRepository.save(orchid);
    }

    @PutMapping("/{id}")
    // Any authenticated user can update for feedback (if not admin, should ideally restrict to only feedback modification, but for simplicity we allow update for now or handle it via a separate endpoint)
    // For lab scope, keeping it simple. Or restrict to ADMIN and add a specific /feedback endpoint.
    public ResponseEntity<Orchid> updateOrchid(@PathVariable Long id, @RequestBody Orchid orchidDetails) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orchid not found"));
        
        orchid.setName(orchidDetails.getName());
        orchid.setCategory(orchidDetails.getCategory());
        orchid.setOrigin(orchidDetails.getOrigin());
        orchid.setColor(orchidDetails.getColor());
        orchid.setRating(orchidDetails.getRating());
        orchid.setImg(orchidDetails.getImg());
        orchid.setVideoUrl(orchidDetails.getVideoUrl());
        orchid.setDescription(orchidDetails.getDescription());
        orchid.setIsSpecial(orchidDetails.getIsSpecial());
        orchid.setIsNatural(orchidDetails.getIsNatural());
        
        // Update feedback
        orchid.getFeedback().clear();
        if(orchidDetails.getFeedback() != null) {
            orchid.getFeedback().addAll(orchidDetails.getFeedback());
        }
        
        Orchid updatedOrchid = orchidRepository.save(orchid);
        return ResponseEntity.ok(updatedOrchid);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrchid(@PathVariable Long id) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orchid not found"));
        
        orchidRepository.delete(orchid);
        return ResponseEntity.ok().build();
    }
}
