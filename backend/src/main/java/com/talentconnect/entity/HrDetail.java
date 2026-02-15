package com.talentconnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * JPA entity representing an HR contact managed by a user.
 * Tracks contact details, email status, and send history.
 */
@Entity
@Table(name = "hr_details", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_email_status", columnList = "email_status"),
        @Index(name = "idx_company_name", columnList = "company_name"),
        @Index(name = "idx_date_added", columnList = "date_added")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HrDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "hr_name", nullable = false, length = 100)
    private String hrName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "mobile_number", length = 20)
    private String mobileNumber;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "job_role", length = 150)
    private String jobRole;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_status", nullable = false)
    @Builder.Default
    private EmailStatus emailStatus = EmailStatus.PENDING;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    @Column(name = "date_added", updatable = false)
    private LocalDateTime dateAdded;

    @PrePersist
    protected void onCreate() {
        this.dateAdded = LocalDateTime.now();
    }
}
