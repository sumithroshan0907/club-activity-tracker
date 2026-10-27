# 🎓 Student Club Activity Tracker
### Object-Oriented Programming (Java) & Full-Stack Academic College Project
**Aligned with UN Sustainable Development Goal 4 (SDG 4): Quality Education**

---

## 📋 Table of Contents
1. [Project Introduction](#1-project-introduction)
2. [Project Objectives & SDG 4 Alignment](#2-project-objectives--sdg-4-alignment)
3. [Technologies Used](#3-technologies-used)
4. [Project Architecture & Modules](#4-project-architecture--modules)
5. [Database Schema & Table Explanations](#5-database-schema--table-explanations)
6. [Explanation of Important Java Classes](#6-explanation-of-important-java-classes)
7. [Java OOP Concept: Inheritance](#7-java-oop-concept-inheritance)
8. [Java OOP Concept: ArrayList and Collections](#8-java-oop-concept-arraylist-and-collections)
9. [Java OOP Concept: File I/O (Input/Output)](#9-java-oop-concept-file-io-inputoutput)
10. [Java OOP Concept: Exception Handling](#10-java-oop-concept-exception-handling)
11. [How React Communicates with Spring Boot (REST APIs)](#11-how-react-communicates-with-spring-boot-rest-apis)
12. [How Spring Boot Communicates with MySQL (Spring Data JPA)](#12-how-spring-boot-communicates-with-mysql-spring-data-jpa)
13. [How to Run the Project Locally](#13-how-to-run-the-project-locally)
14. [College Viva Voce Questions & Answers (25 Key Questions)](#14-college-viva-voce-questions--answers)

---

## 1. Project Introduction
In modern collegiate institutions, co-curricular and extracurricular student clubs (Coding, Robotics, Literary, Arts, Sports) play an essential role in holistic student growth. However, most colleges still track participation manually using paper sign-in sheets or disorganized spreadsheets. This leads to duplicate attendance records, loss of event history, and lack of transparency.

The **Student Club Activity Tracker** is a full-stack web application designed to automate and streamline:
- **Club Management**: Registration and categorization of technical and non-technical clubs.
- **Student Directory**: Storing student details with unique registration numbers.
- **Activity Scheduling**: Organizing and logging club events, workshops, and competitions.
- **Attendance & Participation Tracking**: Recording student participation while enforcing database integrity (preventing duplicate attendance for the same activity).
- **Gamified Leaderboard**: Automatically ranking students based on cumulative activity participation.
- **Academic Reports & Java File I/O**: Generating printable HTML reports and exporting official formatted text reports directly to disk using standard Java File I/O streams.

---

## 2. Project Objectives & SDG 4 Alignment
### Core Objectives
1. **Centralize Campus Engagement**: Provide a single, intuitive platform for faculty coordinators and students to monitor club activities.
2. **Eliminate Redundant Records**: Guarantee database-level uniqueness for student registration numbers and activity attendance.
3. **Motivate Participation**: Foster healthy peer engagement through an automated ranking and badge-awarding leaderboard system.
4. **Demonstrate Practical Java OOP**: Showcase real-world implementation of core Object-Oriented Programming concepts (Inheritance, Polymorphism, Collections Framework, File I/O, Custom Exception Handling).

### Alignment with UN Sustainable Development Goal 4 (SDG 4: Quality Education)
Target 4.4 and 4.7 of SDG 4 emphasize fostering technical, vocational, and transferable life skills such as teamwork, leadership, problem-solving, and communication. Co-curricular activities are vital practical extensions of university curricula. This project empowers educational institutions to systematically track and encourage student participation in experiential learning environments.

---

## 3. Technologies Used

| Tier | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | 18.x | Dynamic Single Page Application (SPA) UI |
| **Build Tool** | Vite | 5.4.x | Fast frontend development server & bundler |
| **Styling** | Vanilla CSS3 | Standard | Modern glassmorphism, responsive grids, custom theme variables (no heavyweight CSS frameworks) |
| **Backend** | Java (JDK) | 17+ / 25 | Core business logic and Object-Oriented design |
| **Framework** | Spring Boot | 3.3.4 | RESTful Web Services, Dependency Injection, Inversion of Control |
| **ORM / Data** | Spring Data JPA / Hibernate | 6.5.x | Object-Relational Mapping and automated SQL queries |
| **Database** | MySQL | 8.x | Relational database for persistent transactional data |
| **File I/O** | Java IO API | Standard | `FileWriter`, `PrintWriter`, `BufferedReader`, `FileReader` |

---

## 4. Project Architecture & Modules

The project is structured according to the classic **3-Tier Architecture**:
```
+-------------------------------------------------------+
|              CLIENT TIER (React Frontend)             |
|   Dashboard | Clubs | Students | Activities | Reports  |
+-------------------------------------------------------+
                           │  HTTP / JSON (REST APIs)
                           ▼
+-------------------------------------------------------+
|             APPLICATION TIER (Spring Boot)            |
|   Controllers ──► Services ──► Repositories ──► Java IO|
+-------------------------------------------------------+
                           │  JDBC / Hibernate SQL
                           ▼
+-------------------------------------------------------+
|               DATABASE TIER (MySQL Server)            |
|     clubs | students | activities | participations    |
+-------------------------------------------------------+
```

### Module Breakdown
- **Dashboard Module (`Dashboard.jsx` & `DashboardController.java`)**: Displays 4 real-time metric cards (Total Clubs, Students, Activities, Active Members), recent activities, top 5 student champions, and a pure CSS-rendered participation breakdown.
- **Clubs Module (`Clubs.jsx` & `ClubController.java`)**: CRUD management of college clubs. Demonstrates OOP Inheritance by allowing creation of General, Coding, or Literary clubs. Clicking on any club name opens an interactive modal revealing comprehensive club metadata, faculty coordinator, OOP subclass attributes, total activities/attendance stats, organized events, and the complete roster of participating student members with their attendance counts and remarks.
- **Students Module (`Students.jsx` & `StudentController.java`)**: Management of student directory with branch, academic year, and unique registration number validation.
- **Activities & Participation Module (`Activities.jsx`, `ActivityController.java`, `ParticipationController.java`)**: Scheduling events and recording student attendance. Enforces uniqueness constraint `(student_id, activity_id)`.
- **Leaderboard Module (`Leaderboard.jsx` & `LeaderboardService.java`)**: Dynamic ranking calculation using Java Collections (`ArrayList` and custom comparator) to award Gold, Silver, and Bronze badges.
- **Reports & Java File I/O Module (`Reports.jsx`, `ReportController.java`, `FileReportService.java`)**: Provides browser-printable tabular reports and invokes server-side Java File I/O to create and read `.txt` audit reports.

---

## 5. Database Schema & Table Explanations

The database `student_club_db` consists of 4 normalized relational tables:

```
  ┌───────────────┐               ┌────────────────┐
  │     CLUBS     │ 1           * │   ACTIVITIES   │
  │───────────────│───────────────│────────────────│
  │ club_id (PK)  │               │ activity_id(PK)│
  │ club_name     │               │ activity_name  │
  │ category      │               │ club_id (FK)   │
  │ coordinator   │               │ activity_date  │
  └───────────────┘               └────────────────┘
                                          │ 1
                                          │
                                          │ *
  ┌───────────────┐               ┌────────────────┐
  │   STUDENTS    │ 1           * │ PARTICIPATIONS │
  │───────────────│───────────────│────────────────│
  │ student_id(PK)│───────────────│ part_id (PK)   │
  │ student_name  │               │ student_id(FK) │
  │ reg_no (UQ)   │               │ activity_id(FK)│
  │ department    │               │ part_date      │
  └───────────────┘               │ UNIQUE(st, act)│
                                  └────────────────┘
```

### 1. `clubs` Table
Stores details of college clubs.
- `club_id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT): Unique club identifier.
- `club_name` (VARCHAR(100), NOT NULL): Official name of the club.
- `description` (TEXT): Overview and mission of the club.
- `category` (VARCHAR(50), NOT NULL): 'Technical', 'Literary', 'Cultural', or 'Sports'.
- `faculty_coordinator` (VARCHAR(100), NOT NULL): In-charge professor's name.
- `club_type` (VARCHAR(50)): Discriminator column for Java Inheritance (`General`, `Coding`, `Literary`).
- `programming_language` (VARCHAR(50)): Attribute specific to `CodingClub` subclass.
- `magazine_name` (VARCHAR(100)): Attribute specific to `LiteraryClub` subclass.

### 2. `students` Table
Stores registered students enrolled in the college.
- `student_id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT): Unique student ID.
- `student_name` (VARCHAR(100), NOT NULL): Full name of the student.
- `registration_number` (VARCHAR(50), NOT NULL, **UNIQUE**): College roll number (prevents duplicate student entries).
- `email` (VARCHAR(100), NOT NULL): Academic email address.
- `department` (VARCHAR(50), NOT NULL): Branch (e.g., CSE, IT, ECE, MECH).
- `academic_year` (VARCHAR(20), NOT NULL): Current year of study (1st Year to 4th Year).

### 3. `activities` Table
Stores events and workshops organized by clubs.
- `activity_id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT): Unique activity ID.
- `activity_name` (VARCHAR(150), NOT NULL): Title of the event.
- `club_id` (BIGINT, NOT NULL, FOREIGN KEY referencing `clubs(club_id)` ON DELETE CASCADE): Hosting club.
- `club_name` (VARCHAR(100), NOT NULL): Cached club name for rapid reporting.
- `activity_date` (DATE, NOT NULL): Scheduled date of the event.
- `description` (TEXT): Details of the workshop or competition.

### 4. `participations` Table
Associative / mapping table implementing the Many-to-Many relationship between `students` and `activities`.
- `participation_id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT): Unique participation record.
- `student_id` (BIGINT, NOT NULL, FOREIGN KEY referencing `students(student_id)` ON DELETE CASCADE).
- `activity_id` (BIGINT, NOT NULL, FOREIGN KEY referencing `activities(activity_id)` ON DELETE CASCADE).
- `participation_date` (DATE, NOT NULL): Date attendance was confirmed.
- `remarks` (VARCHAR(255)): Achievements or notes (e.g., "1st Prize", "Attended").
- **`CONSTRAINT uk_student_activity UNIQUE (student_id, activity_id)`**: Guarantees a student can never be marked present twice for the same activity.

---

## 6. Explanation of Important Java Classes

### Entity Layer (`com.tracker.club.entity`)
- **`Student.java`**: JPA Entity modeling student attributes (`studentId`, `studentName`, `registrationNumber`, `department`, `academicYear`). Contains getters, setters, constructors, and encapsulation.
- **`Club.java`**: Base entity modeling core club properties. Employs JPA `@Inheritance(strategy = InheritanceType.SINGLE_TABLE)` and `@DiscriminatorColumn(name = "club_type")`. Includes polymorphic methods `getClubDetails()` and `conductActivity()`.
- **`CodingClub.java`**: Subclass extending `Club`. Adds `programmingLanguage` field and overrides `getClubDetails()` to demonstrate polymorphism.
- **`LiteraryClub.java`**: Subclass extending `Club`. Adds `magazineName` field and overrides `getClubDetails()`.
- **`Activity.java`**: JPA Entity modeling event details and linking to host club.
- **`Participation.java`**: JPA Entity mapping a `Student` and an `Activity` with a JPA `@Table(uniqueConstraints = ...)` annotation.
- **`LeaderboardEntry.java`**: Plain Java transfer class encapsulating a student's ranking, attendance count, and badge (`Gold Champion`, `Silver Star`, etc.). Implements `Comparable<LeaderboardEntry>` for native sorting.

### Repository Layer (`com.tracker.club.repository`)
Interfaces extending `org.springframework.data.jpa.repository.JpaRepository`:
- **`StudentRepository.java`**: Handles database queries for students; includes `existsByRegistrationNumber(...)`.
- **`ClubRepository.java`**: CRUD database operations for clubs.
- **`ActivityRepository.java`**: Queries activities by club ID and date.
- **`ParticipationRepository.java`**: Includes custom queries:
  - `existsByStudent_StudentIdAndActivity_ActivityId(...)`: Checks attendance duplicate.
  - `countByStudent_StudentId(...)`: Computes total activities attended per student.
  - `countDistinctStudents()`: Counts unique participating students.

### Service Layer (`com.tracker.club.service`)
- **`ClubService.java`**: Manages club business logic, instantiating `CodingClub`, `LiteraryClub`, or base `Club` based on requested category.
- **`StudentService.java`**: Validates registration number uniqueness before saving.
- **`ActivityService.java`**: Schedules and deletes club events.
- **`ParticipationService.java`**: Verifies both student and activity exist, checks for duplicate attendance using try/catch, and persists participation.
- **`LeaderboardService.java`**: Collects all students, queries participation counts, packages them into an `ArrayList<LeaderboardEntry>`, and sorts them in descending order using Java Collections.
- **`FileReportService.java`**: Generates physical text reports on disk via `FileWriter` and `PrintWriter`, and reads them back using `BufferedReader`.

### Controller Layer (`com.tracker.club.controller`)
- Exposes RESTful JSON endpoints (`@RestController`, `@CrossOrigin(origins = "*")`, `@RequestMapping("/api/...")`).

---

## 7. Java OOP Concept: Inheritance

### What is Inheritance?
Inheritance is an OOP mechanism where a new class (subclass/child) acquires the properties and methods of an existing class (superclass/parent). It promotes code reusability and enables polymorphic behavior.

### Implementation in this Project
In `com.tracker.club.entity`:
1. **Superclass**: `Club.java` defines standard properties common to all clubs (`clubId`, `clubName`, `category`, `facultyCoordinator`) and base methods:
   ```java
   public class Club {
       public String getClubDetails() {
           return "General Club: " + clubName + " (" + category + ") coordinated by " + facultyCoordinator;
       }
   }
   ```
2. **Subclass 1**: `CodingClub.java` inherits from `Club` using the `extends` keyword and adds domain-specific attributes:
   ```java
   @Entity
   @DiscriminatorValue("Coding")
   public class CodingClub extends Club {
       private String programmingLanguage;

       @Override
       public String getClubDetails() {
           return "Technical Coding Club: " + getClubName() + 
                  " | Primary Language: " + programmingLanguage + 
                  " | Coordinator: " + getFacultyCoordinator();
       }
   }
   ```
3. **Subclass 2**: `LiteraryClub.java` inherits from `Club` and adds publication details:
   ```java
   @Entity
   @DiscriminatorValue("Literary")
   public class LiteraryClub extends Club {
       private String magazineName;

       @Override
       public String getClubDetails() {
           return "Literary & Debate Club: " + getClubName() + 
                  " | Annual Magazine: " + magazineName + 
                  " | Coordinator: " + getFacultyCoordinator();
       }
   }
   ```
4. **Polymorphism**: The controller or service can treat instances of `CodingClub` and `LiteraryClub` uniformly as `Club` references, while dynamically invoking the overridden `getClubDetails()` method at runtime (Dynamic Method Dispatch).

---

## 8. Java OOP Concept: ArrayList and Collections

### What are Collections and ArrayList?
The Java Collections Framework provides an architecture to store and manipulate a group of objects. `ArrayList` is a resizable, dynamic array implementation of the `List` interface.

### Implementation in this Project
In `LeaderboardService.java`:
1. **Dynamic Storage (`ArrayList`)**:
   ```java
   List<LeaderboardEntry> leaderboard = new ArrayList<>();
   ```
2. **Data Population**:
   The service iterates over all registered students and calculates the number of activities attended:
   ```java
   for (Student student : students) {
       long attendedCount = participationRepository.countByStudent_StudentId(student.getStudentId());
       leaderboard.add(new LeaderboardEntry(student, (int) attendedCount));
   }
   ```
3. **Sorting with `Collections.sort`**:
   The leaderboard sorts entries in descending order of activities attended using a custom Comparator:
   ```java
   Collections.sort(leaderboard, new Comparator<LeaderboardEntry>() {
       @Override
       public int compare(LeaderboardEntry e1, LeaderboardEntry e2) {
           // Descending order (highest attended first)
           return Integer.compare(e2.getActivitiesAttended(), e1.getActivitiesAttended());
       }
   });
   ```
4. **Rank & Badge Assignment**:
   After sorting, a standard loop assigns sequential ranks (1, 2, 3...) and awards gamified badges (`Gold Champion 🥇`, `Silver Star 🥈`, `Bronze Achiever 🥉`, `Active Contributor ⭐`).

---

## 9. Java OOP Concept: File I/O (Input/Output)

### What is File I/O?
Java File I/O (`java.io` package) enables a program to read from and write data to physical files stored on the file system.

### Implementation in this Project
In `FileReportService.java`:
1. **File and Directory Creation**:
   ```java
   File directory = new File("generated_reports");
   if (!directory.exists()) {
       directory.mkdirs();
   }
   File reportFile = new File(directory, "Student_Club_Activity_Report.txt");
   ```
2. **Writing Data (`FileWriter`, `BufferedWriter`, `PrintWriter`)**:
   Uses the modern **try-with-resources** statement which guarantees streams are safely flushed and closed even if an exception occurs:
   ```java
   try (FileWriter fw = new FileWriter(reportFile);
        BufferedWriter bw = new BufferedWriter(fw);
        PrintWriter pw = new PrintWriter(bw)) {

       pw.println("=================================================");
       pw.println("     STUDENT CLUB ACTIVITY TRACKER - REPORT      ");
       pw.println("=================================================");
       pw.printf("Total Clubs Registered   : %d%n", clubs.size());
       pw.printf("Total Students Enrolled  : %d%n", students.size());
       pw.printf("Total Participations     : %d%n", participations.size());
       pw.flush();
   } catch (IOException e) {
       System.err.println("File write failed: " + e.getMessage());
   }
   ```
3. **Reading Data (`FileReader`, `BufferedReader`)**:
   Reads the saved file line by line to return a preview back to the frontend:
   ```java
   StringBuilder content = new StringBuilder();
   try (FileReader fr = new FileReader(reportFile);
        BufferedReader br = new BufferedReader(fr)) {
       String line;
       while ((line = br.readLine()) != null) {
           content.append(line).append("\n");
       }
   }
   ```

---

## 10. Java OOP Concept: Exception Handling

### What is Exception Handling?
Exception Handling is a mechanism in Java to handle runtime errors (such as missing records, duplicate database entries, or disk I/O errors) gracefully, maintaining normal application flow.

### Implementation in this Project
1. **Custom Exceptions**:
   - `ResourceNotFoundException.java`: Thrown when a student, club, or activity ID does not exist in the database.
   - `DuplicateRecordException.java`: Thrown when trying to insert a registration number or participation record that already exists.
2. **Global Exception Controller Advice (`GlobalExceptionHandler.java`)**:
   Annotated with `@RestControllerAdvice`, this intercepts exceptions thrown across any controller and returns user-friendly JSON error responses with proper HTTP status codes:
   ```java
   @ExceptionHandler(ResourceNotFoundException.class)
   public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
       Map<String, Object> error = new HashMap<>();
       error.put("error", "NOT_FOUND");
       error.put("message", ex.getMessage());
       error.put("timestamp", LocalDateTime.now());
       return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
   }

   @ExceptionHandler(DuplicateRecordException.class)
   public ResponseEntity<Map<String, Object>> handleDuplicate(DuplicateRecordException ex) {
       Map<String, Object> error = new HashMap<>();
       error.put("error", "DUPLICATE_RECORD");
       error.put("message", ex.getMessage());
       error.put("timestamp", LocalDateTime.now());
       return new ResponseEntity<>(error, HttpStatus.CONFLICT);
   }
   ```
3. **Duplicate Attendance Check**:
   Before recording participation, the service validates:
   ```java
   if (participationRepository.existsByStudent_StudentIdAndActivity_ActivityId(studentId, activityId)) {
       throw new DuplicateRecordException("This student has already been recorded for this activity!");
   }
   ```

---

## 11. How React Communicates with Spring Boot (REST APIs)

1. **Protocol**: HTTP/HTTPS over localhost (`http://localhost:8080/api/...`).
2. **Data Format**: JavaScript Object Notation (JSON).
3. **JavaScript `fetch()` API**:
   React components initiate asynchronous requests inside `useEffect()` or button click handlers:
   ```javascript
   // Fetching clubs from backend
   fetch('http://localhost:8080/api/clubs')
     .then((res) => {
       if (!res.ok) throw new Error('Network error');
       return res.json();
     })
     .then((data) => setClubs(data))
     .catch((err) => console.error(err));
   ```
4. **Sending Data (POST/PUT/DELETE)**:
   ```javascript
   fetch('http://localhost:8080/api/students', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(newStudentData)
   });
   ```
5. **Cross-Origin Resource Sharing (CORS)**:
   Since React runs on port `5173` and Spring Boot runs on port `8080`, browsers enforce same-origin policy. Spring Boot enables communication using `CorsConfig.java`:
   ```java
   @Configuration
   public class CorsConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/**")
                   .allowedOrigins("http://localhost:5173")
                   .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
       }
   }
   ```

---

## 12. How Spring Boot Communicates with MySQL (Spring Data JPA)

1. **Database Driver**: `mysql-connector-j` converts Java calls into MySQL network wire protocol packets.
2. **Connection Configuration (`application.properties`)**:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_club_db?useSSL=false&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```
3. **Connection Pooling (HikariCP)**:
   Maintains a pool of reusable database connections for fast query response without renegotiating TCP handshakes.
4. **Object-Relational Mapping (ORM / Hibernate)**:
   Java classes marked with `@Entity` map directly to relational tables. Member fields map to columns.
5. **Spring Data JPA Repositories**:
   Interfaces extending `JpaRepository<Entity, ID>` provide ready-to-use methods (`save()`, `findAll()`, `findById()`, `deleteById()`) without writing boilerplate SQL:
   ```java
   public interface StudentRepository extends JpaRepository<Student, Long> {
       boolean existsByRegistrationNumber(String registrationNumber);
   }
   ```
   Spring dynamically generates the underlying SQL: `SELECT COUNT(*) > 0 FROM students WHERE registration_number = ?`.

---

## 13. How to Run the Project Locally

### Prerequisites
- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js & npm**: Node.js 18+ and npm 9+
- **MySQL Server**: Version 8.0+
- **Apache Maven**: (Or run using the system Maven wrapper)

---

### Step 1: Initialize the MySQL Database
1. Open MySQL command line or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Execute the provided SQL script:
   ```sql
   source /path/to/oopsj/database/database.sql;
   ```
   *(Or copy and paste the contents of `database/database.sql` into MySQL Workbench and run it).*
3. Verify that the tables (`clubs`, `students`, `activities`, `participations`) and initial sample records are created:
   ```sql
   USE student_club_db;
   SHOW TABLES;
   SELECT * FROM clubs;
   ```

---

### Step 2: Configure Database Credentials
Open `backend/src/main/resources/application.properties` and verify your MySQL username and password:
```properties
spring.datasource.username=root
spring.datasource.password=root
```
*(Update `password` to match your local MySQL root password if different).*

---

### Step 3: Run the Spring Boot Backend
1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on port **8080**:
   ```
   Tomcat started on port 8080 (http) with context path '/'
   Student Club Activity Tracker Backend Started Successfully
   ```
4. Verify backend health by visiting in your browser:
   `http://localhost:8080/api/dashboard/stats`

---

### Step 4: Run the React Frontend
1. Open a second terminal and navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your web browser and navigate to:
   **`http://localhost:5173/`**

---

## 14. College Viva Voce Questions & Answers

### Q1: What is the main objective of this project?
**Answer**: To automate the tracking and management of college student club activities, eliminate duplicate participation records using database constraints, motivate student engagement through an automated leaderboard, and generate official audit reports using Java File I/O.

### Q2: What are the main technologies used in this project?
**Answer**:
- **Frontend**: React.js, Vite, and Vanilla CSS3.
- **Backend**: Java 17+, Spring Boot 3.3, and Spring Data JPA.
- **Database**: MySQL 8.
- **File Handling**: Standard Java I/O (`FileWriter`, `BufferedReader`).

### Q3: How is Inheritance implemented in your Java code?
**Answer**: We have a base superclass `Club.java` containing general attributes (`clubName`, `category`, `facultyCoordinator`). Specialized subclasses `CodingClub.java` and `LiteraryClub.java` extend `Club` and add specific attributes (`programmingLanguage` and `magazineName`). Both subclasses override the `getClubDetails()` method to demonstrate runtime polymorphism.

### Q4: What is Polymorphism and where is it used?
**Answer**: Polymorphism allows an entity to take multiple forms. We use **runtime polymorphism** (method overriding) where the superclass `Club` has a method `getClubDetails()`, and subclasses `CodingClub` and `LiteraryClub` provide their own specific implementations. When invoked on a `Club` reference, Java dynamically executes the appropriate subclass method.

### Q5: How did you use the Java Collections framework?
**Answer**: We used `ArrayList<LeaderboardEntry>` in `LeaderboardService.java` to dynamically aggregate student participation data. We then used `Collections.sort()` with a custom `Comparator` to sort the list in descending order of attended activities.

### Q6: How does the Leaderboard calculate student ranks?
**Answer**: The system queries the `participations` table to count how many distinct activities each student attended. It populates an `ArrayList` of `LeaderboardEntry` objects, sorts them using `Collections.sort()` in descending order, assigns ranks (1, 2, 3...), and awards badges (`Gold Champion`, `Silver Star`, `Bronze Achiever`).

### Q7: Where and why did you use Java File I/O?
**Answer**: In `FileReportService.java`, we used `FileWriter`, `BufferedWriter`, and `PrintWriter` to write a formatted summary report (`Student_Club_Activity_Report.txt`) directly to the file system. We also used `FileReader` and `BufferedReader` to read the file contents back and preview it in the React frontend.

### Q8: What is try-with-resources and why did you use it in File I/O?
**Answer**: Try-with-resources is a Java feature introduced in Java 7 that automatically closes resources (such as file streams) when the try block finishes. It prevents resource leaks and eliminates the need for verbose `finally` blocks.

### Q9: How do you prevent a student from being marked present twice for the same activity?
**Answer**: We enforce this at two levels:
1. **Database Level**: A composite unique constraint on the `participations` table: `CONSTRAINT uk_student_activity UNIQUE (student_id, activity_id)`.
2. **Java Service Level**: `ParticipationService.java` checks `participationRepository.existsByStudent_StudentIdAndActivity_ActivityId(studentId, activityId)` before saving. If true, it throws a custom `DuplicateRecordException`.

### Q10: What custom exceptions did you create?
**Answer**:
1. `ResourceNotFoundException`: Thrown when an entity ID (student, club, or activity) does not exist in the database (HTTP 404).
2. `DuplicateRecordException`: Thrown when attempting to register a student with an existing roll number or record duplicate attendance (HTTP 409).

### Q11: What is `@RestControllerAdvice`?
**Answer**: `@RestControllerAdvice` is a Spring annotation used for global exception handling. It intercepts exceptions thrown by any `@RestController` and converts them into standardized JSON error messages with appropriate HTTP status codes.

### Q12: What is the role of Spring Data JPA?
**Answer**: Spring Data JPA reduces boilerplate code by automatically generating implementations for repository interfaces (like `JpaRepository`), providing built-in methods for CRUD operations, pagination, and derived query methods without writing manual SQL.

### Q13: What is Hibernate and what is the difference between JPA and Hibernate?
**Answer**: JPA (Jakarta Persistence API) is a standard specification defining ORM in Java. Hibernate is the actual ORM library (implementation) that executes the JPA specification and translates Java entity operations into SQL dialect statements.

### Q14: How does React communicate with Spring Boot?
**Answer**: React uses the native browser `fetch()` API to make asynchronous HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) to the Spring Boot REST API endpoints, transmitting and receiving data in JSON format.

### Q15: Why is CORS configuration necessary in Spring Boot?
**Answer**: The React frontend runs on port 5173, while the Spring Boot backend runs on port 8080. Browsers block cross-origin requests by default due to the Same-Origin Policy. Spring Boot's `@CrossOrigin` or `WebMvcConfigurer` configures CORS headers to allow requests from the React origin.

### Q16: What is the advantage of using React state (`useState`) and effects (`useEffect`)?
**Answer**:
- `useState`: Holds component state (e.g., student list, loading flags, form inputs) and automatically re-renders the UI when state changes.
- `useEffect`: Manages lifecycle operations, such as fetching data from the backend when a component mounts.

### Q17: What are the primary keys and foreign keys in your database schema?
**Answer**:
- `clubs`: Primary key `club_id`.
- `students`: Primary key `student_id`.
- `activities`: Primary key `activity_id`, Foreign key `club_id` referencing `clubs(club_id)`.
- `participations`: Primary key `participation_id`, Foreign keys `student_id` and `activity_id` referencing `students` and `activities` respectively.

### Q18: What does `ON DELETE CASCADE` do in your foreign keys?
**Answer**: If a parent record is deleted (e.g., a club or activity is removed), all child records referencing that parent (e.g., participations for that activity) are automatically deleted by the database engine to maintain referential integrity.

### Q19: How did you implement printable reports?
**Answer**: In `Reports.jsx`, we built HTML tables displaying clubs, students, activities, and the leaderboard. Clicking "Print Report" triggers the browser's native `window.print()` function. In `styles.css`, `@media print` rules hide sidebars, headers, and action buttons, leaving a clean paper report.

### Q20: What is Dependency Injection (DI) and Inversion of Control (IoC) in Spring Boot?
**Answer**: Inversion of Control means the Spring framework manages object creation and lifecycle rather than the programmer using `new`. Dependency Injection is the mechanism where Spring injects required dependencies (e.g., using `@Autowired`) into beans at runtime.

### Q21: What is the purpose of `application.properties`?
**Answer**: It is the central configuration file for Spring Boot where we define server settings (`server.port=8080`), database connection URL, credentials, Hibernate DDL settings (`spring.jpa.hibernate.ddl-auto=update`), and logging levels.

### Q22: What does `spring.jpa.hibernate.ddl-auto=update` mean?
**Answer**: It instructs Hibernate to automatically check existing database tables against JPA entity definitions upon application startup and alter tables to add missing columns without dropping existing data.

### Q23: How is this project related to Sustainable Development Goal 4 (SDG 4)?
**Answer**: SDG 4 aims for inclusive and equitable Quality Education. Participating in clubs equips students with practical engineering, communication, and leadership skills beyond textbook learning. This system simplifies the organization of these co-curricular opportunities.

### Q24: What is the difference between `Checked` and `Unchecked` exceptions in Java?
**Answer**:
- **Checked Exceptions**: Checked at compile-time (e.g., `IOException`, `SQLException`). The compiler forces handling with try-catch or `throws`. Used in our `FileReportService`.
- **Unchecked Exceptions**: Subclasses of `RuntimeException` checked at runtime (e.g., `ResourceNotFoundException`, `NullPointerException`). Used in our business validation logic.

### Q25: Can this application handle more clubs or thousands of students?
**Answer**: Yes. The backend is stateless, uses HikariCP connection pooling, uses indexed primary and unique keys in MySQL, and uses modular React rendering on the frontend, allowing it to scale effectively for university-wide deployment.

---

### 👨‍💻 Project Submission Note
- **Project Title**: Student Club Activity Tracker
- **Subject**: Object-Oriented Programming (OOPS) / Full-Stack Java Lab
- **Developed by**: Suriyaa M
- **Academic Year**: 2026
