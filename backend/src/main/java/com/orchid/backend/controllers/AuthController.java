package com.orchid.backend.controllers;

import com.orchid.backend.models.User;
import com.orchid.backend.payload.GoogleLoginRequest;
import com.orchid.backend.payload.JwtResponse;
import com.orchid.backend.payload.LoginRequest;
import com.orchid.backend.payload.MessageResponse;
import com.orchid.backend.payload.SignupRequest;
import com.orchid.backend.repositories.UserRepository;
import com.orchid.backend.security.GoogleTokenVerifier;
import com.orchid.backend.security.JwtUtils;
import com.orchid.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    GoogleTokenVerifier googleTokenVerifier;

    @Value("${app.seed.admin-email}")
    private String adminEmail;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt, 
                                                 userDetails.getId(), 
                                                 userDetails.getName(), 
                                                 userDetails.getEmail(), 
                                                 userDetails.isAdmin()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getName(), 
                             signUpRequest.getEmail(),
                             encoder.encode(signUpRequest.getPassword()));

        // Optional: set first user as admin or based on email logic
        // if(signUpRequest.getEmail().equals("admin@gmail.com")) user.setAdmin(true);

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    /**
     * Đổi Google access token lấy JWT của chính hệ thống này.
     * Frontend phải lưu JWT trả về ở đây, không được lưu token của Google:
     * token Google không phải JWT nên AuthTokenFilter không đọc được.
     */
    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody GoogleLoginRequest googleLoginRequest) {
        if (googleLoginRequest.getAccessToken() == null || googleLoginRequest.getAccessToken().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Missing Google access token!"));
        }

        GoogleTokenVerifier.GoogleProfile profile;
        try {
            profile = googleTokenVerifier.verify(googleLoginRequest.getAccessToken());
        } catch (GoogleTokenVerifier.InvalidGoogleTokenException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }

        User user = userRepository.findByEmail(profile.getEmail())
                .orElseGet(() -> createUserFromGoogle(profile));

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt,
                                                 userDetails.getId(),
                                                 userDetails.getName(),
                                                 userDetails.getEmail(),
                                                 userDetails.isAdmin()));
    }

    private User createUserFromGoogle(GoogleTokenVerifier.GoogleProfile profile) {
        String name = (profile.getName() == null || profile.getName().isBlank())
                ? profile.getEmail()
                : profile.getName();

        // User.name giới hạn 50 ký tự, tên Google có thể dài hơn.
        if (name.length() > 50) {
            name = name.substring(0, 50);
        }

        // Tài khoản Google không đăng nhập bằng mật khẩu local, nên đặt một mật khẩu
        // ngẫu nhiên không ai đoán được thay vì để trống (cột password là NOT NULL).
        User user = new User(name, profile.getEmail(), encoder.encode(UUID.randomUUID().toString()));
        user.setAdmin(profile.getEmail().equalsIgnoreCase(adminEmail));

        return userRepository.save(user);
    }
}
