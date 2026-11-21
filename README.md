# Student Attendance and Performance Tracking System

A complete full-stack web application for managing student attendance and academic performance in educational institutions.

**Technology Stack:** React.js (Frontend) | Java Spring Boot (Backend) | MySQL (Database)

---

## 📋 Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Database Setup](#database-setup)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [Default Login Credentials](#default-login-credentials)
9. [API Documentation](#api-documentation)
10. [Testing Workflow](#testing-workflow)
11. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Administrator
- Dashboard with statistics (students, faculty, subjects, attendance rates)
- Full CRUD for Students, Faculty, Subjects, and Classes
- Assign subjects to faculty members
- View attendance and performance reports
- Manage user accounts

### Faculty
- Dashboard showing assigned subjects and stats
- Mark attendance for classes (batch marking with Present/Absent toggle)
- Enter marks for assessments (Quiz, Assignment, Mid-Term, Final Exam, Practical)
- View attendance and performance reports

### Student
- Personal dashboard with attendance and performance overview
- Subject-wise attendance breakdown with status indicators
- Full attendance history with date filtering
- Academic performance with subject-wise grades and charts
- View personal profile

### Cross-cutting
- JWT-based authentication with role-based access control
- BCrypt password hashing
- Responsive design (desktop, tablet, mobile)
- Real-time form validation
- Charts for data visualization
- Toast notifications for feedback
- Confirmation dialogs for destructive actions

---

## 🛠 Tech Stack

| Layer       | Technology                                             |
|-------------|--------------------------------------------------------|
| Frontend    | React 18, React Router 6, Axios, Bootstrap 5, Recharts, React-Toastify |
| Backend     | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, Hibernate |
| Database    | MySQL 8.0+                                              |
| Auth        | JWT (JJWT 0.12.5)                                       |
| Build       | Maven (backend), Vite (frontend)                        |

---

## 📁 Project Structure

```
student-attendance-system/
├── backend/                          # Spring Boot Application
│   ├── pom.xml                       # Maven dependencies
│   └── src/main/
│       ├── java/com/attendance/system/
│       │   ├── StudentAttendanceApplication.java  # Main class
│       │   ├── config/               # Security, JWT, CORS, Data Initializer
│       │   ├── controller/           # REST API endpoints
│       │   ├── dto/                  # Data Transfer Objects
│       │   ├── entity/               # JPA Entity classes
│       │   ├── exception/            # Custom exceptions & global handler
│       │   ├── repository/           # Spring Data JPA repositories
│       │   └── service/              # Business logic (interface + impl)
│       └── resources/
│           ├── application.properties
│           └── schema.sql
├── frontend/                         # React Application
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                  # Entry point
│       ├── App.jsx                   # Route definitions
│       ├── services/api.js           # Axios API client
│       ├── context/AuthContext.jsx    # Auth state management
│       ├── components/               # Shared components
│       ├── layouts/                  # Dashboard layout (sidebar + topbar)
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── UserProfile.jsx
│       │   ├── admin/                # Admin pages
│       │   ├── faculty/              # Faculty pages
│       │   └── student/              # Student pages
│       └── styles/index.css
├── DATABASE_SETUP.sql                # Full MySQL schema + sample data
└── README.md
```

---

## ✅ Prerequisites

Install these before starting:

1. **Java JDK 17+** — [Download from Adoptium](https://adoptium.net/)
   ```
   java -version    # Should show 17 or higher
   ```

2. **Apache Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
   ```
   mvn -version
   ```

3. **Node.js 18+** — [Download](https://nodejs.org/)
   ```
   node -v
   npm -v
   ```

4. **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/mysql/)
   ```
   mysql --version
   ```

---

## 🗄 Database Setup

### Option A: Automatic (Recommended)
The backend application creates the database and tables automatically on first startup using `spring.jpa.hibernate.ddl-auto=update` and `createDatabaseIfNotExist=true`. It also seeds sample data via `DataInitializer.java`. **Just start the backend and everything is created for you.**

### Option B: Manual
1. Open MySQL command line or MySQL Workbench
2. Run:
   ```sql
   CREATE DATABASE student_attendance_db;
   ```
3. (Optional) Run `DATABASE_SETUP.sql` for the full schema

### Configure Connection
Set the database credentials and a private JWT signing key as environment variables before starting the backend. In PowerShell:
```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-local-mysql-password"
$env:JWT_SECRET = "a-private-random-key-at-least-32-characters-long"
```
Keep these values private and do not commit them to Git.

---

## 🚀 Backend Setup

```bash
cd student-attendance-system/backend

# Install dependencies and build
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**.

On first startup you'll see:
```
>>> Initializing Default Academic Database Seed Data...
>>> Database Seed Complete!
    Admin: admin / admin123
    Faculty: neha.faculty / faculty123
    Student: aarav.student / student123
```

---

## 🖥 Frontend Setup

```bash
cd student-attendance-system/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts on **http://localhost:5173**.

The Vite dev server proxies `/api` requests to `http://localhost:8080` automatically (configured in `vite.config.js`).

---

## 🔑 Default Login Credentials

| Role     | Username        | Password     |
|----------|-----------------|--------------|
| Admin    | `admin`         | `admin123`   |
| Faculty  | `neha.faculty`  | `faculty123` |
| Faculty  | `amit.faculty`  | `faculty123` |
| Student  | `aarav.student` | `student123` |
| Student  | `ananya.student`| `student123` |
| Student  | `rohan.student` | `student123` |
| Student  | `priya.student` | `student123` |
| Student  | `kabir.student` | `student123` |

---

## 📡 API Documentation

### Authentication
| Method | Endpoint                  | Access  | Description              |
|--------|---------------------------|---------|--------------------------|
| POST   | `/api/auth/login`         | Public  | Login, returns JWT token |
| GET    | `/api/auth/me`            | Auth    | Get current user info    |
| POST   | `/api/auth/change-password`| Auth   | Change password          |

### Students
| Method | Endpoint                      | Access    | Description            |
|--------|-------------------------------|-----------|------------------------|
| GET    | `/api/students`               | Auth      | List all students      |
| GET    | `/api/students/{id}`          | Auth      | Get student by ID      |
| GET    | `/api/students/user/{userId}` | Auth      | Get student by user ID |
| GET    | `/api/students/class/{classId}`| Auth     | Students in a class    |
| POST   | `/api/students`               | ADMIN     | Create student         |
| PUT    | `/api/students/{id}`          | ADMIN     | Update student         |
| DELETE | `/api/students/{id}`          | ADMIN     | Delete student         |

### Faculty
| Method | Endpoint                           | Access    | Description              |
|--------|------------------------------------|-----------|--------------------------|
| GET    | `/api/faculty`                     | Auth      | List all faculty         |
| GET    | `/api/faculty/{id}`                | Auth      | Get faculty by ID        |
| POST   | `/api/faculty`                     | ADMIN     | Create faculty           |
| PUT    | `/api/faculty/{id}`                | ADMIN     | Update faculty           |
| DELETE | `/api/faculty/{id}`                | ADMIN     | Delete faculty           |
| POST   | `/api/faculty/{id}/assign-subjects`| ADMIN     | Assign subjects          |

### Subjects
| Method | Endpoint                        | Access    | Description            |
|--------|---------------------------------|-----------|------------------------|
| GET    | `/api/subjects`                 | Auth      | List all subjects      |
| POST   | `/api/subjects`                 | ADMIN     | Create subject         |
| PUT    | `/api/subjects/{id}`            | ADMIN     | Update subject         |
| DELETE | `/api/subjects/{id}`            | ADMIN     | Delete subject         |

### Classes
| Method | Endpoint               | Access    | Description          |
|--------|------------------------|-----------|----------------------|
| GET    | `/api/classes`         | Auth      | List all classes     |
| POST   | `/api/classes`         | ADMIN     | Create class         |
| PUT    | `/api/classes/{id}`    | ADMIN     | Update class         |
| DELETE | `/api/classes/{id}`    | ADMIN     | Delete class         |

### Attendance
| Method | Endpoint                                               | Access        | Description               |
|--------|--------------------------------------------------------|---------------|---------------------------|
| POST   | `/api/attendance/batch`                                | ADMIN/FACULTY | Mark batch attendance     |
| GET    | `/api/attendance/class/{cId}/subject/{sId}?date=`     | Auth          | Get attendance for a date |
| GET    | `/api/attendance/student/{id}/summary`                 | Auth          | Student summary           |
| GET    | `/api/attendance/student/{id}/history`                 | Auth          | Student history           |
| GET    | `/api/attendance/report?classId=&subjectId=&startDate=&endDate=` | Auth | Filtered report    |

### Marks
| Method | Endpoint                                                | Access        | Description             |
|--------|---------------------------------------------------------|---------------|-------------------------|
| POST   | `/api/marks/batch`                                      | ADMIN/FACULTY | Enter batch marks       |
| GET    | `/api/marks/student/{id}`                               | Auth          | Student marks           |
| GET    | `/api/marks/student/{id}/performance`                   | Auth          | Performance report      |
| GET    | `/api/marks/report?classId=&subjectId=`                 | Auth          | Class marks report      |

### Dashboard
| Method | Endpoint                           | Access    | Description               |
|--------|------------------------------------|-----------|---------------------------|
| GET    | `/api/dashboard/admin`             | Auth      | Admin dashboard stats     |
| GET    | `/api/dashboard/faculty/{id}`      | Auth      | Faculty dashboard stats   |
| GET    | `/api/dashboard/student/{id}`      | Auth      | Student dashboard stats   |

---

## 🧪 Testing Workflow

Follow these steps to verify the complete application:

1. **Start MySQL** — ensure MySQL server is running on port 3306
2. **Start Backend** — `cd backend && mvn spring-boot:run`
3. **Start Frontend** — `cd frontend && npm run dev`
4. **Open Browser** — go to `http://localhost:5173`

### Test as Admin
1. Login as `admin` / `admin123`
2. View dashboard — verify stats cards and charts load
3. Go to Students → verify table loads with 5 sample students
4. Add a new student → verify form submission
5. Edit a student → verify update
6. Go to Faculty → verify 2 faculty members load
7. Go to Subjects → verify 4 subjects load
8. Go to Classes → verify 2 classes load
9. View Attendance Reports → select filters and fetch
10. View Performance Reports → select filters and fetch

### Test as Faculty
1. Login as `neha.faculty` / `faculty123`
2. View dashboard — verify assigned subjects shown
3. Go to Mark Attendance → select class, subject, date → mark students → submit
4. Go to Enter Marks → select class, subject, type → enter marks → submit

### Test as Student
1. Login as `aarav.student` / `student123`
2. View dashboard — verify attendance % and performance summary
3. View My Attendance — verify subject-wise breakdown and history table
4. View My Performance — verify subject-wise marks and grades
5. View My Profile — verify personal details display

---

## 🔧 Troubleshooting

### "Connection refused" on backend startup
- Ensure MySQL is running: `mysql -u root -p` should work
- Check credentials in `application.properties`

### "CORS error" in browser console
- Both servers must be running (backend on 8080, frontend on 5173)
- The Vite proxy handles CORS in development

### "Port 8080 already in use"
- Kill the process: `netstat -ano | findstr 8080` then `taskkill /PID <pid> /F`
- Or change `server.port` in `application.properties`

### "npm install" fails
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure Node.js 18+ is installed

### Database tables not created
- Verify `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
- Verify MySQL connection URL is correct

### Login returns 401
- The DataInitializer only seeds data once (when the users table is empty)
- If you changed the database, drop it and restart: `DROP DATABASE student_attendance_db;`

---

## 📊 Database Schema (ER Diagram)

```
users (id, username, email, password, full_name, phone, role, active)
  ├── 1:1 → students (id, roll_number, registration_number, user_id, class_id, ...)
  └── 1:1 → faculty (id, employee_id, user_id, department, designation, ...)

classes (id, class_name, department, semester, academic_year, section)
  └── 1:N → students

subjects (id, subject_code, subject_name, department, semester, credits)
  └── N:M → faculty (via faculty_subject junction table)

attendance (id, student_id, subject_id, class_id, faculty_id, attendance_date, status, remarks)
  └── Unique: (student_id, subject_id, attendance_date)

marks (id, student_id, subject_id, class_id, faculty_id, assessment_type, max_marks, marks_obtained, ...)
  └── Unique: (student_id, subject_id, assessment_type)
```

---

## 📄 License

This project is developed as an MCA academic project for educational purposes.

**Course:** Master of Computer Applications (MCA)
**Project Title:** Student Attendance and Performance Tracking System
