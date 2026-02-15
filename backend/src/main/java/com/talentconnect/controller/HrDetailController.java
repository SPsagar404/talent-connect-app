package com.talentconnect.controller;

import com.talentconnect.dto.*;
import com.talentconnect.entity.User;
import com.talentconnect.service.HrDetailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * REST controller for HR detail CRUD operations, filtering, and dashboard stats.
 * All endpoints require JWT authentication.
 */
@RestController
@RequestMapping("/api/hr-details")
@RequiredArgsConstructor
public class HrDetailController {

    private final HrDetailService hrDetailService;

    /**
     * GET /api/hr-details — List HR details with optional filters and pagination.
     * Query params: status, companyName, startDate, endDate, page, size
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<HrDetailResponse>>> getHrDetails(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PagedResponse<HrDetailResponse> response =
                hrDetailService.getHrDetails(user, status, companyName, startDate, endDate, page, size);

        return ResponseEntity.ok(ApiResponse.success("HR details retrieved", response));
    }

    /**
     * GET /api/hr-details/{id} — Get a single HR detail.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HrDetailResponse>> getHrDetail(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        HrDetailResponse response = hrDetailService.getHrDetail(user, id);
        return ResponseEntity.ok(ApiResponse.success("HR detail retrieved", response));
    }

    /**
     * POST /api/hr-details — Create a new HR contact.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<HrDetailResponse>> createHrDetail(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody HrDetailRequest request) {
        HrDetailResponse response = hrDetailService.createHrDetail(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("HR detail created", response));
    }

    /**
     * PUT /api/hr-details/{id} — Update an existing HR contact.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HrDetailResponse>> updateHrDetail(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody HrDetailRequest request) {
        HrDetailResponse response = hrDetailService.updateHrDetail(user, id, request);
        return ResponseEntity.ok(ApiResponse.success("HR detail updated", response));
    }

    /**
     * DELETE /api/hr-details/{id} — Delete an HR contact.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHrDetail(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        hrDetailService.deleteHrDetail(user, id);
        return ResponseEntity.ok(ApiResponse.success("HR detail deleted"));
    }

    /**
     * GET /api/hr-details/stats — Get dashboard statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats(
            @AuthenticationPrincipal User user) {
        DashboardStats stats = hrDetailService.getDashboardStats(user);
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }
}
