package com.talentconnect.controller;

import com.talentconnect.dto.ApiResponse;
import com.talentconnect.dto.EmailSendRequest;
import com.talentconnect.entity.User;
import com.talentconnect.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for email sending operations.
 * Supports both single and bulk email sends with resume attachment.
 */
@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    /**
     * POST /api/emails/send — Send emails to selected HR contacts.
     * Request body contains list of HR IDs, subject, and body.
     * Resume is automatically attached from user's uploaded file.
     */
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendEmails(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody EmailSendRequest request) {
        Map<String, Object> result = emailService.sendEmails(user, request);
        return ResponseEntity.ok(ApiResponse.success("Email sending completed", result));
    }
}
