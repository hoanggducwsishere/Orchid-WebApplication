package com.orchid.backend.payload;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    @com.fasterxml.jackson.annotation.JsonProperty("isAdmin")
    private boolean isAdmin;

    public JwtResponse(String accessToken, Long id, String name, String email, boolean isAdmin) {
        this.token = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    @com.fasterxml.jackson.annotation.JsonProperty("isAdmin")
    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean isAdmin) { this.isAdmin = isAdmin; }
}
