package com.talentconnect.service;

import com.talentconnect.dto.EmailSendRequest;
import com.talentconnect.entity.EmailLog;
import com.talentconnect.entity.EmailStatus;
import com.talentconnect.entity.HrDetail;
import com.talentconnect.entity.User;
import com.talentconnect.exception.BadRequestException;
import com.talentconnect.exception.ResourceNotFoundException;
import com.talentconnect.repository.EmailLogRepository;
import com.talentconnect.repository.HrDetailRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for sending emails (single and bulk) with resume attachment.
 * Updates HR detail status and creates email log entries for each send attempt.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final HrDetailRepository hrDetailRepository;
    private final EmailLogRepository emailLogRepository;

    /**
     * Send emails to selected HR contacts with resume attachment.
     * Returns a summary map with counts of successful and failed sends.
     */
    public Map<String, Object> sendEmails(User user, EmailSendRequest request) {
        // Verify user has a resume uploaded
        if (user.getResumePath() == null || user.getResumePath().isBlank()) {
            throw new BadRequestException("Please upload your resume before sending emails");
        }

        File resumeFile = new File(user.getResumePath());
        if (!resumeFile.exists()) {
            throw new BadRequestException("Resume file not found. Please re-upload your resume");
        }

        List<Long> hrIds = request.getHrDetailIds();
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (Long hrId : hrIds) {
            HrDetail hrDetail = hrDetailRepository.findById(hrId).orElse(null);

            // Skip if not found or not owned by user
            if (hrDetail == null || !hrDetail.getUser().getId().equals(user.getId())) {
                failCount++;
                errors.add("HR contact ID " + hrId + " not found");
                continue;
            }

            try {
                sendEmailWithAttachment(
                        user.getEmail(),
                        hrDetail.getEmail(),
                        request.getSubject(),
                        request.getBody(),
                        resumeFile,
                        user.getResumeOriginalName()
                );

                // Update HR detail status to SENT
                hrDetail.setEmailStatus(EmailStatus.SENT);
                hrDetail.setEmailSentAt(LocalDateTime.now());
                hrDetailRepository.save(hrDetail);

                // Log successful send
                createEmailLog(hrDetail, user, EmailStatus.SENT, null);
                successCount++;

                log.info("Email sent successfully to {} for HR: {}", hrDetail.getEmail(), hrDetail.getHrName());

            } catch (Exception e) {
                // Update HR detail status to FAILED
                hrDetail.setEmailStatus(EmailStatus.FAILED);
                hrDetailRepository.save(hrDetail);

                // Log failed send
                createEmailLog(hrDetail, user, EmailStatus.FAILED, e.getMessage());
                failCount++;
                errors.add("Failed to send to " + hrDetail.getEmail() + ": " + e.getMessage());

                log.error("Failed to send email to {}: {}", hrDetail.getEmail(), e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRequested", hrIds.size());
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        if (!errors.isEmpty()) {
            result.put("errors", errors);
        }

        return result;
    }

    /**
     * Send a single email with resume attached via SMTP.
     */
    private void sendEmailWithAttachment(String from, String to, String subject,
                                          String body, File attachment, String attachmentName)
            throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, false); // plain text

        // Attach resume
        String fileName = attachmentName != null ? attachmentName : attachment.getName();
        FileSystemResource file = new FileSystemResource(attachment);
        helper.addAttachment(fileName, file);

        mailSender.send(message);
    }

    /**
     * Create an email log entry.
     */
    private void createEmailLog(HrDetail hrDetail, User user, EmailStatus status, String errorMessage) {
        EmailLog emailLog = EmailLog.builder()
                .hrDetail(hrDetail)
                .user(user)
                .status(status)
                .errorMessage(errorMessage)
                .build();
        emailLogRepository.save(emailLog);
    }
}
