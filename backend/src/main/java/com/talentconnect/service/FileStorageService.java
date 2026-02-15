package com.talentconnect.service;

import com.talentconnect.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service for storing and retrieving resume files on the local filesystem.
 */
@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload.dir}") String uploadPath) {
        this.uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadPath, e);
        }
    }

    /**
     * Store a resume file and return the stored file path.
     * Only PDF and DOC/DOCX files are accepted.
     */
    public String storeFile(MultipartFile file) {
        // Validate file type
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BadRequestException("Invalid file name");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        if (!extension.equals(".pdf") && !extension.equals(".doc") && !extension.equals(".docx")) {
            throw new BadRequestException("Only PDF and DOC/DOCX files are allowed");
        }

        // Generate unique filename to prevent collisions
        String storedFilename = UUID.randomUUID() + extension;
        Path targetPath = this.uploadDir.resolve(storedFilename);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalFilename, e);
        }

        return targetPath.toString();
    }

    /**
     * Get the Path object for a stored file.
     */
    public Path getFilePath(String storedPath) {
        return Paths.get(storedPath);
    }

    /**
     * Delete a previously stored file.
     */
    public void deleteFile(String storedPath) {
        try {
            Path path = Paths.get(storedPath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            // Log but don't throw — file deletion failure is not critical
        }
    }
}
