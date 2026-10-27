package com.tracker.club.controller;

import com.tracker.club.service.FileReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Map;

/**
 * REST Controller for generating and exporting Reports.
 * Demonstrates Java File I/O via REST APIs.
 */
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private FileReportService fileReportService;

    // 1. Trigger File I/O writing report to disk
    @PostMapping("/export-file")
    public ResponseEntity<Map<String, Object>> exportReportToFile() {
        Map<String, Object> result = fileReportService.generateTextReport();
        return ResponseEntity.ok(result);
    }

    // 2. Read report text using Java BufferedReader
    @GetMapping("/preview-file")
    public ResponseEntity<Map<String, String>> previewReportFile() {
        String content = fileReportService.readReportFile();
        return ResponseEntity.ok(Map.of("reportContent", content));
    }

    // 3. Download the generated text report file
    @GetMapping("/download-file")
    public ResponseEntity<Resource> downloadReportFile() {
        File file = fileReportService.getReportFile();
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .contentLength(file.length())
                .body(resource);
    }
}
