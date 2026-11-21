# MCA Academic Project Viva & Architecture Guide

## Project Title: Student Attendance and Performance Tracking System

This document is prepared specifically for your **MCA Final Project Evaluation, Viva Voce, and College Presentation**. It provides in-depth explanations of the architecture, design choices, formulas, and typical questions asked by external examiners.

---

## 1. System Architecture Overview

The system implements a **Separation of Concerns (SoC)** principle following the Industry Standard **3-Tier Layered Architecture**:

```
+-------------------------------------------------------------+
|                      PRESENTATION TIER                      |
|           React.js 18 + Vite + Bootstrap 5 + Recharts        |
|  - Role-based routing (Admin, Faculty, Student)             |
|  - Centralized Axios API client with JWT interceptor        |
|  - Client-side validation & Interactive responsive UI       |
+------------------------------+------------------------------+
                               |  HTTP REST (JSON)
                               |  CORS Enabled on :8080
+------------------------------v------------------------------+
|                       APPLICATION TIER                       |
|               Java 17 + Spring Boot 3.2.5                   |
|  - Controller Layer: REST Endpoints & Request Validation    |
|  - Service Layer: Business Logic & Transaction Management    |
|  - DTO Layer: Data encapsulation & Security Decoupling      |
|  - Security Layer: Spring Security 6 + JJWT + BCrypt        |
|  - Repository Layer: Spring Data JPA + Hibernate ORM         |
+------------------------------+------------------------------+
                               |  JDBC / SQL Queries
+------------------------------v------------------------------+
|                         DATA TIER                           |
|                         MySQL 8.0+                          |
|  - Relational Schema (8 normalized tables)                  |
|  - Primary & Foreign Key integrity constraints              |
|  - Unique constraints (Prevent duplicate attendance/marks)  |
+-------------------------------------------------------------+
```

---

## 2. Key Modules & Technical Flow

### A. Authentication & Security Workflow (JWT)
1. User enters username and password in React login form.
2. React sends `POST /api/auth/login` via Axios.
3. Spring Security's `AuthenticationManager` uses `CustomUserDetailsService` to query MySQL for the user.
4. Passwords are verified against the stored hash using **BCrypt** with salt rounds.
5. If valid, `JwtTokenProvider` generates an HMAC-SHA256 signed JWT containing the username, role, and expiry time.
6. The frontend stores this token in `localStorage`.
7. For all subsequent requests, Axios request interceptor injects:
   ```http
   Authorization: Bearer <token>
   ```
8. The backend's `JwtAuthenticationFilter` intercepts the request, validates the cryptographic signature, extracts the user role, and sets Spring's `SecurityContext`.

### B. Attendance Calculation Algorithm
The attendance percentage is calculated using the following mathematical formulation:

$$\text{Attendance Percentage} = \left( \frac{\text{Conducted Classes Attended}}{\text{Total Conducted Classes}} \right) \times 100$$

**Defaulter Rule:** If aggregate percentage is $< 75.0\%$, the student is automatically flagged with `isDefaulter = true`.

**Division-by-Zero Handling in Java:**
```java
long totalClasses = attendanceRepository.countByStudentId(studentId);
if (totalClasses == 0) {
    return 0.0; // Gracefully handles newly enrolled students with zero classes
}
long presentClasses = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
return Math.round(((double) presentClasses / totalClasses) * 100.0 * 10.0) / 10.0;
```

### C. Academic Marks & Grade Evaluation Matrix
Grades are computed dynamically based on the percentage scored across evaluations:

| Percentage Range | Letter Grade | Academic Performance Classification |
|---|---|---|
| $90.0\% - 100\%$ | **A+** | Outstanding |
| $80.0\% - 89.9\%$ | **A** | Excellent |
| $70.0\% - 79.9\%$ | **B** | Very Good |
| $60.0\% - 69.9\%$ | **C** | Good |
| $50.0\% - 59.9\%$ | **D** | Satisfactory / Pass |
| Below $50.0\%$ | **F** | Fail / Remedial Required |

---

## 3. Database Schema Relationships

| Relationship | Entities | JPA Annotation | Real-World Meaning |
|---|---|---|---|
| 1-to-1 | `User` $\leftrightarrow$ `Student` | `@OneToOne(cascade = CascadeType.ALL)` | Every student has exactly one login account. |
| 1-to-1 | `User` $\leftrightarrow$ `Faculty` | `@OneToOne(cascade = CascadeType.ALL)` | Every faculty has exactly one login account. |
| Many-to-1 | `Student` $\rightarrow$ `ClassRoom` | `@ManyToOne` | Multiple students belong to one cohort/class. |
| Many-to-Many | `Faculty` $\leftrightarrow$ `Subject` | `@ManyToMany` via `faculty_subject` | A faculty can teach multiple subjects, and subjects can be shared. |
| Many-to-1 | `Attendance` $\rightarrow$ `Student` | `@ManyToOne` | One student has many attendance day records. |
| Unique Constraint | `(student_id, subject_id, attendance_date)` | `@UniqueConstraint` | Prevents marking attendance twice for the same student on the same date for the same subject. |
| Unique Constraint | `(student_id, subject_id, assessment_type)` | `@UniqueConstraint` | Ensures only one grade entry per assessment type (e.g., Mid-Term). |

---

## 4. Top Viva Voce Questions & Answers

### Q1: Why did you use DTOs (Data Transfer Objects) instead of returning JPA Entities directly in Controllers?
**Answer:**
1. **Security:** Exposing Entities directly can leak sensitive information like hashed passwords (`password` column).
2. **Infinite Recursion / Circular References:** In bidirectional relationships (e.g., Subject and Faculty), serializing entities to JSON leads to `StackOverflowError` without DTOs or `@JsonIgnore`.
3. **Decoupling:** DTOs allow the frontend payload to evolve independently of the underlying database schema.

### Q2: How does Spring Security protect routes?
**Answer:**
We use a two-level defense:
1. **HTTP Security Filter Chain:** Configured in `SecurityConfig.java` to restrict URL paths:
   - `/api/auth/**` is `permitAll()`
   - `/api/admin/**` requires `ROLE_ADMIN`
   - `/api/faculty/**` requires `ROLE_FACULTY` or `ROLE_ADMIN`
2. **Method-Level Security:** Using `@PreAuthorize("hasRole('ADMIN')")` directly above controller methods for fine-grained authorization.

### Q3: Why is BCrypt used instead of MD5 or SHA-256 for passwords?
**Answer:**
MD5 and SHA-256 are fast cryptographic hashes designed for integrity verification, making them vulnerable to brute-force and rainbow table attacks. **BCrypt** incorporates a salt and is computationally intensive with an adaptable work factor (cost parameter), making brute-force dictionary attacks practically infeasible.

### Q4: How does the React frontend maintain login state across page reloads?
**Answer:**
The authentication token and serialized user object are stored in the browser's `localStorage`. When the app loads, `AuthContext` initializes its state from `localStorage`. If a valid token exists, the user remains logged in. If a request returns an HTTP `401 Unauthorized` status (e.g., token expired), the Axios response interceptor clears `localStorage` and redirects the user to `/login`.

### Q5: How is Cross-Origin Resource Sharing (CORS) handled?
**Answer:**
The React development server runs on port `5173` while Spring Boot runs on port `8080`. Browsers block cross-origin requests by default due to the Same-Origin Policy (SOP). We resolve this in two complementary ways:
1. **Spring Boot CORS configuration:** In `SecurityConfig.java` and `WebMvcConfig.java`, we explicitly allow `http://localhost:5173` with credentials and standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
2. **Vite Proxy:** In `vite.config.js`, we configure a proxy forwarding `/api` requests directly to `http://localhost:8080`.

---

## 5. College Presentation Checklist

When presenting your MCA project:
1. **Demonstrate Role Separation:**
   - Log in as **Admin** (`admin` / `admin123`): Show the KPI dashboard, create a new student, assign a subject to a faculty member.
   - Log in as **Faculty** (`neha.faculty` / `faculty123`): Show the assigned subjects, mark attendance for today's lecture, enter marks for Quiz 1.
   - Log in as **Student** (`aarav.student` / `student123`): Show the attendance percentage, subject breakdown, and the newly entered quiz marks.
2. **Highlight the Defaulter Logic:**
   - Log in as **Rohan Gupta** (`rohan.student` / `student123`): Show the **Defaulter Warning Banner** indicating attendance is below 75%.
3. **Show Data Persistence:**
   - Open MySQL Workbench / CLI and run `SELECT * FROM attendance;` or `SELECT * FROM marks;` to prove records are stored in the relational database.
