package com.talentconnect.dto;

import lombok.*;

/**
 * DTO for authentication responses containing JWT token and user info.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String fullName;
    private String email;
    private boolean hasResume;
}
