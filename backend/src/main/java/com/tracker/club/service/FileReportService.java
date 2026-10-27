package com.tracker.club.service;

import com.tracker.club.entity.Club;
import com.tracker.club.entity.LeaderboardEntry;
import com.tracker.club.entity.Participation;
import com.tracker.club.entity.Student;
import com.tracker.club.repository.ClubRepository;
import com.tracker.club.repository.ParticipationRepository;
import com.tracker.club.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ==========================================================
 * JAVA OOP CONCEPT: FILE I/O (File, FileWriter, PrintWriter, BufferedReader)
 * ==========================================================
 * This service demonstrates standard Java File Input/Output operations.
 * It writes a formatted academic activity report to a .txt file on the disk
 * and demonstrates reading the file back into memory.
 * 
 * Demonstrates:
 * 1. File & Directory creation (java.io.File)
 * 2. Writing text using FileWriter, BufferedWriter, PrintWriter
 * 3. Reading text using FileReader, BufferedReader
 * 4. Exception Handling using try-catch-finally (and try-with-resources)
 */
@Service
public class FileReportService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ParticipationRepository participationRepository;

    @Autowired
    private LeaderboardService leaderboardService;

    // Report Directory and File Name
    private static final String REPORT_DIR = "generated_reports";
    private static final String REPORT_FILE_NAME = "Student_Club_Activity_Report.txt";

    /**
     * Generates a text file report and writes it to disk.
     * Demonstrates Java File Output (Writing to a file).
     */
    public Map<String, Object> generateTextReport() {
        Map<String, Object> response = new HashMap<>();

        // Create the directory if it does not exist
        File directory = new File(REPORT_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        File reportFile = new File(directory, REPORT_FILE_NAME);

        // Fetch data to write into the file
        List<Club> clubs = clubRepository.findAll();
        List<Student> students = studentRepository.findAll();
        List<Participation> participations = participationRepository.findAll();
        List<LeaderboardEntry> leaderboard = leaderboardService.getLeaderboard();

        // Use try-with-resources for automatic resource closing (Exception Handling & File I/O)
        try (FileWriter fw = new FileWriter(reportFile);
             BufferedWriter bw = new BufferedWriter(fw);
             PrintWriter pw = new PrintWriter(bw)) {

            // Header Section
            pw.println("================================================================================");
            pw.println("                    STUDENT CLUB ACTIVITY TRACKER - REPORT                     ");
            pw.println("              Academic Project Supporting SDG 4: Quality Education             ");
            pw.println("================================================================================");
            pw.println("Generated Date & Time: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            pw.println("File Storage Path     : " + reportFile.getAbsolutePath());
            pw.println();

            // 1. Summary Statistics
            pw.println("--------------------------------------------------------------------------------");
            pw.println("1. OVERALL SUMMARY STATISTICS");
            pw.println("--------------------------------------------------------------------------------");
            pw.printf("Total Clubs Registered   : %d%n", clubs.size());
            pw.printf("Total Students Enrolled  : %d%n", students.size());
            pw.printf("Total Participations     : %d%n", participations.size());
            pw.println();

            // 2. Clubs Details (Demonstrates OOP Polymorphism call)
            pw.println("--------------------------------------------------------------------------------");
            pw.println("2. REGISTERED CLUBS");
            pw.println("--------------------------------------------------------------------------------");
            pw.printf("%-5s | %-28s | %-12s | %-25s%n", "ID", "Club Name", "Category", "Faculty Coordinator");
            pw.println("--------------------------------------------------------------------------------");
            for (Club c : clubs) {
                pw.printf("%-5d | %-28s | %-12s | %-25s%n", 
                        c.getClubId(), c.getClubName(), c.getCategory(), c.getFacultyCoordinator());
            }
            pw.println();

            // 3. Leaderboard Section (Demonstrates Java Collections result)
            pw.println("--------------------------------------------------------------------------------");
            pw.println("3. STUDENT PARTICIPATION LEADERBOARD");
            pw.println("--------------------------------------------------------------------------------");
            pw.printf("%-6s | %-20s | %-14s | %-8s | %-12s | %-15s%n", 
                    "Rank", "Student Name", "Reg. Number", "Dept", "Activities", "Badge");
            pw.println("--------------------------------------------------------------------------------");
            for (LeaderboardEntry entry : leaderboard) {
                pw.printf("%-6d | %-20s | %-14s | %-8s | %-12d | %-15s%n",
                        entry.getRank(),
                        entry.getStudentName(),
                        entry.getRegistrationNumber(),
                        entry.getDepartment(),
                        entry.getActivitiesAttended(),
                        entry.getBadge());
            }
            pw.println();

            // Footer
            pw.println("================================================================================");
            pw.println("                       END OF ACADEMIC ACTIVITY REPORT                          ");
            pw.println("================================================================================");

            // Flush stream so disk has complete bytes before measuring file size
            pw.flush();

            // Populate success response
            response.put("success", true);
            response.put("fileName", REPORT_FILE_NAME);
            response.put("absolutePath", reportFile.getAbsolutePath());
            response.put("fileSize", reportFile.length() + " bytes");
            response.put("fileSizeBytes", reportFile.length());
            response.put("message", "Report successfully written to file using Java File I/O (FileWriter / PrintWriter)!");
            response.put("timestamp", LocalDateTime.now().toString());

        } catch (IOException e) {
            // Exception Handling demonstration
            response.put("success", false);
            response.put("error", "Error writing to file: " + e.getMessage());
        }

        return response;
    }

    /**
     * Reads the report file back from disk using BufferedReader.
     * Demonstrates Java File Input (Reading from a file).
     */
    public String readReportFile() {
        File file = new File(REPORT_DIR, REPORT_FILE_NAME);
        if (!file.exists()) {
            // If file does not exist, generate it first
            generateTextReport();
        }

        StringBuilder content = new StringBuilder();
        try (FileReader fr = new FileReader(file);
             BufferedReader br = new BufferedReader(fr)) {

            String line;
            while ((line = br.readLine()) != null) {
                content.append(line).append("\n");
            }

        } catch (IOException e) {
            return "Error reading report file: " + e.getMessage();
        }

        return content.toString();
    }

    public File getReportFile() {
        File file = new File(REPORT_DIR, REPORT_FILE_NAME);
        if (!file.exists()) {
            generateTextReport();
        }
        return file;
    }
}
