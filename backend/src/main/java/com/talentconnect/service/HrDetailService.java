package com.talentconnect.service;

import com.talentconnect.dto.*;
import com.talentconnect.entity.EmailStatus;
import com.talentconnect.entity.HrDetail;
import com.talentconnect.entity.User;
import com.talentconnect.exception.ResourceNotFoundException;
import com.talentconnect.repository.HrDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Service for HR detail CRUD operations, filtering, and pagination.
 */
@Service
@RequiredArgsConstructor
public class HrDetailService {

    private final HrDetailRepository hrDetailRepository;

    /**
     * Create a new HR contact for the given user.
     */
    public HrDetailResponse createHrDetail(User user, HrDetailRequest request) {
        HrDetail hrDetail = HrDetail.builder()
                .user(user)
                .hrName(request.getHrName())
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .companyName(request.getCompanyName())
                .jobRole(request.getJobRole())
                .notes(request.getNotes())
                .emailStatus(EmailStatus.PENDING)
                .build();

        hrDetail = hrDetailRepository.save(hrDetail);
        return mapToResponse(hrDetail);
    }

    /**
     * Update an existing HR contact.
     */
    public HrDetailResponse updateHrDetail(User user, Long id, HrDetailRequest request) {
        HrDetail hrDetail = hrDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HR detail not found with id: " + id));

        // Verify ownership
        if (!hrDetail.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("HR detail not found with id: " + id);
        }

        hrDetail.setHrName(request.getHrName());
        hrDetail.setEmail(request.getEmail());
        hrDetail.setMobileNumber(request.getMobileNumber());
        hrDetail.setCompanyName(request.getCompanyName());
        hrDetail.setJobRole(request.getJobRole());
        hrDetail.setNotes(request.getNotes());

        hrDetail = hrDetailRepository.save(hrDetail);
        return mapToResponse(hrDetail);
    }

    /**
     * Delete an HR contact.
     */
    public void deleteHrDetail(User user, Long id) {
        HrDetail hrDetail = hrDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HR detail not found with id: " + id));

        if (!hrDetail.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("HR detail not found with id: " + id);
        }

        hrDetailRepository.delete(hrDetail);
    }

    /**
     * Get a single HR detail by ID.
     */
    public HrDetailResponse getHrDetail(User user, Long id) {
        HrDetail hrDetail = hrDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HR detail not found with id: " + id));

        if (!hrDetail.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("HR detail not found with id: " + id);
        }

        return mapToResponse(hrDetail);
    }

    /**
     * Get paginated HR details with optional filters.
     */
    public PagedResponse<HrDetailResponse> getHrDetails(
            User user, String status, String companyName,
            LocalDate startDate, LocalDate endDate,
            int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        // Convert filter params
        EmailStatus emailStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                emailStatus = EmailStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {
                // Invalid status, ignore filter
            }
        }

        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime end = endDate != null ? endDate.atTime(LocalTime.MAX) : null;
        String company = (companyName != null && !companyName.isBlank()) ? companyName : null;

        Page<HrDetail> hrPage = hrDetailRepository.findByUserWithFilters(
                user.getId(), emailStatus, company, start, end, pageable);

        List<HrDetailResponse> content = hrPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return PagedResponse.<HrDetailResponse>builder()
                .content(content)
                .page(hrPage.getNumber())
                .size(hrPage.getSize())
                .totalElements(hrPage.getTotalElements())
                .totalPages(hrPage.getTotalPages())
                .last(hrPage.isLast())
                .build();
    }

    /**
     * Get dashboard statistics for the user.
     */
    public DashboardStats getDashboardStats(User user) {
        return DashboardStats.builder()
                .totalHrContacts(hrDetailRepository.countByUserId(user.getId()))
                .emailsSent(hrDetailRepository.countByUserIdAndEmailStatus(user.getId(), EmailStatus.SENT))
                .emailsPending(hrDetailRepository.countByUserIdAndEmailStatus(user.getId(), EmailStatus.PENDING))
                .emailsFailed(hrDetailRepository.countByUserIdAndEmailStatus(user.getId(), EmailStatus.FAILED))
                .build();
    }

    /**
     * Map entity to response DTO.
     */
    private HrDetailResponse mapToResponse(HrDetail hrDetail) {
        return HrDetailResponse.builder()
                .id(hrDetail.getId())
                .hrName(hrDetail.getHrName())
                .email(hrDetail.getEmail())
                .mobileNumber(hrDetail.getMobileNumber())
                .companyName(hrDetail.getCompanyName())
                .jobRole(hrDetail.getJobRole())
                .notes(hrDetail.getNotes())
                .emailStatus(hrDetail.getEmailStatus())
                .emailSentAt(hrDetail.getEmailSentAt())
                .dateAdded(hrDetail.getDateAdded())
                .build();
    }
}
