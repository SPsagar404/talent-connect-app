package com.talentconnect.dto;

import lombok.*;

/**
 * DTO for dashboard statistics.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalHrContacts;
    private long emailsSent;
    private long emailsPending;
    private long emailsFailed;
}
