package com.talentconnect.dto;

import com.talentconnect.entity.EmailStatus;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for HR detail responses sent to the frontend.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HrDetailResponse {
    private Long id;
    private String hrName;
    private String email;
    private String mobileNumber;
    private String companyName;
    private String jobRole;
    private String notes;
    private EmailStatus emailStatus;
    private LocalDateTime emailSentAt;
    private LocalDateTime dateAdded;
}
