package com.mini.erp.orderinvoiceservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Service
public class ImageService {
    @Value("${mini.erp.upload-dir:uploads}")
    private String uploadDir;

    public String save(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        Files.createDirectories(Paths.get(uploadDir));
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file");
        String sanitized = original.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
        String filename = System.currentTimeMillis() + "_" + sanitized;
        Path target = Paths.get(uploadDir).resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }
}
