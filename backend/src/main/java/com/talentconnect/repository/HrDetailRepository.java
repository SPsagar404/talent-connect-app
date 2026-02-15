package com.talentconnect.repository;

import com.talentconnect.entity.EmailStatus;
import com.talentconnect.entity.HrDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/**
 * Repository for HrDetail entity with custom filtering queries.
 */
@Repository
public interface HrDetailRepository extends JpaRepository<HrDetail, Long> {

    /**
     * Find all HR details for a user with optional filtering by status, date range, and company name.
     * All filter params are optional — pass null to skip a filter.
     */
    @Query("SELECT h FROM HrDetail h WHERE h.user.id = :userId " +
            "AND (:status IS NULL OR h.emailStatus = :status) " +
            "AND (:companyName IS NULL OR LOWER(h.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))) " +
            "AND (:startDate IS NULL OR h.dateAdded >= :startDate) " +
            "AND (:endDate IS NULL OR h.dateAdded <= :endDate) " +
            "ORDER BY h.dateAdded DESC")
    Page<HrDetail> findByUserWithFilters(
            @Param("userId") Long userId,
            @Param("status") EmailStatus status,
            @Param("companyName") String companyName,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    long countByUserIdAndEmailStatus(Long userId, EmailStatus status);

    long countByUserId(Long userId);
}
