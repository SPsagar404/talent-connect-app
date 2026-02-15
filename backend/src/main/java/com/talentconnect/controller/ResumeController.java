package com.talentconnect.controller;

import com.talentconnect.dto.ApiResponse;
import com.talentconnect.entity.User;
import com.talentconnect.repository.UserRepository;
import com.talentconnect.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for resume file upload and retrieval.
 * Resume is uploaded once per user and reused for all email sends.
 */
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    /**
     * POST /api/resume/upload — Upload a resume file (PDF/DOC/DOCX).
     * Replaces any previously uploaded resume.
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadResume(
            @AuthenticationPrincipal User authUser,
            @RequestParam("file") MultipartFile file) {

        // Re-fetch user from DB to get a managed entity
        User user = userRepository.findById(authUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete old resume if exists
        if (user.getResumePath() != null) {
            fileStorageService.deleteFile(user.getResumePath());
        }

        // Store new resume
        String storedPath = fileStorageService.storeFile(file);
        user.setResumePath(storedPath);
        user.setResumeOriginalName(file.getOriginalFilename());
        userRepository.save(user);

        Map<String, String> data = new HashMap<>();
        data.put("fileName", file.getOriginalFilename());
        data.put("message", "Resume uploaded successfully");

        return ResponseEntity.ok(ApiResponse.success("Resume uploaded", data));
    }

    /**
     * GET /api/resume — Get current resume info.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResumeInfo(
            @AuthenticationPrincipal User user) {

        Map<String, Object> data = new HashMap<>();
        data.put("hasResume", user.getResumePath() != null);
        data.put("fileName", user.getResumeOriginalName());

        return ResponseEntity.ok(ApiResponse.success("Resume info retrieved", data));
    }
}
