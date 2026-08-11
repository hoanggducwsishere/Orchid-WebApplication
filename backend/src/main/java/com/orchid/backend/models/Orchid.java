package com.orchid.backend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orchids")
public class Orchid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    private String origin;
    private String color;
    private double rating = 5.0;
    
    @Column(length = 1000)
    private String img;
    
    @Column(length = 1000)
    private String videoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private boolean isSpecial;
    private boolean isNatural;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "orchid_id")
    private List<Feedback> feedback = new ArrayList<>();

    public Orchid() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean getIsSpecial() { return isSpecial; }
    public void setIsSpecial(boolean special) { isSpecial = special; }
    public boolean getIsNatural() { return isNatural; }
    public void setIsNatural(boolean natural) { isNatural = natural; }
    public List<Feedback> getFeedback() { return feedback; }
    public void setFeedback(List<Feedback> feedback) { this.feedback = feedback; }
}
