package com.orchid.backend.security;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Xác minh Google OAuth access token bằng cách hỏi thẳng Google.
 * Không tự parse token: access token của Google là chuỗi mờ đục (dạng "ya29...."),
 * không phải JWT, nên chỉ Google mới nói được nó có hợp lệ hay không.
 */
@Component
public class GoogleTokenVerifier {

    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final RestTemplate restTemplate = new RestTemplate();

    public GoogleProfile verify(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        ResponseEntity<Map> response;
        try {
            response = restTemplate.exchange(
                    USERINFO_URL, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
        } catch (RestClientException e) {
            // Token sai, hết hạn hoặc đã bị thu hồi. Không log token ra ngoài.
            throw new InvalidGoogleTokenException("Google rejected the access token");
        }

        Map<?, ?> body = response.getBody();
        if (body == null) {
            throw new InvalidGoogleTokenException("Google returned an empty profile");
        }

        Object email = body.get("email");
        if (email == null || email.toString().isBlank()) {
            throw new InvalidGoogleTokenException("Google profile has no email");
        }

        if (!isEmailVerified(body.get("email_verified"))) {
            throw new InvalidGoogleTokenException("Google email is not verified");
        }

        Object name = body.get("name");
        return new GoogleProfile(email.toString(), name == null ? null : name.toString());
    }

    // v3/userinfo trả về boolean, nhưng vài endpoint cũ của Google trả chuỗi "true".
    private boolean isEmailVerified(Object value) {
        if (value instanceof Boolean bool) {
            return bool;
        }
        return value != null && Boolean.parseBoolean(value.toString());
    }

    public static class GoogleProfile {
        private final String email;
        private final String name;

        public GoogleProfile(String email, String name) {
            this.email = email;
            this.name = name;
        }

        public String getEmail() { return email; }
        public String getName() { return name; }
    }

    public static class InvalidGoogleTokenException extends RuntimeException {
        public InvalidGoogleTokenException(String message) {
            super(message);
        }
    }
}
