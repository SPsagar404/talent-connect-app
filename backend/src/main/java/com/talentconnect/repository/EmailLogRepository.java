package com.talentconnect.repository;

import com.talentconnect.entity.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for EmailLog entity operations.
 */
@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    List<EmailLog> findByHrDetailIdOrderBySentAtDesc(Long hrDetailId);
    List<EmailLog> findByUserIdOrderBySentAtDesc(Long userId);
}
