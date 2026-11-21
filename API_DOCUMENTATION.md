# REST API Documentation

## Student Attendance and Performance Tracking System

**Base URL:** `http://localhost:8080/api`  
**Authentication Scheme:** `Bearer <JWT_TOKEN>` (passed in HTTP `Authorization` header)

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Login
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@abes.ac.in",
  "fullName": "System Administrator",
  "role": "ROLE_ADMIN",
  "profileId": null
}
```
*Note: For student logins, `profileId` returns the student's ID; for faculty logins, it returns the faculty ID.*

### 1.2 Get Current Authenticated User
- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Access:** Authenticated (Any Role)
- **Response (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@abes.ac.in",
  "fullName": "System Administrator",
  "phone": "9876543210",
  "role": "ROLE_ADMIN",
  "active": true,
  "createdAt": "2026-11-19T10:00:00"
}
```

### 1.3 Change Password
- **URL:** `/api/auth/change-password`
- **Method:** `POST`
- **Access:** Authenticated (Any Role)
- **Request Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "newSecretPassword123"
}
```
- **Response (200 OK):** `"Password changed successfully"`

---

## 2. Student Management (`/api/students`)

### 2.1 Get All Students
- **URL:** `/api/students`
- **Method:** `GET`
- **Access:** Authenticated
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "rollNumber": "MCA-2026-001",
    "registrationNumber": "REG-2026-01",
    "userId": 4,
    "username": "aarav.student",
    "email": "aarav.sharma@abes.ac.in",
    "fullName": "Aarav Sharma",
    "phone": "9876500001",
    "classId": 1,
    "className": "MCA II Year - Sec A",
    "department": "Computer Applications",
    "semester": 3,
    "dateOfBirth": "2001-05-20",
    "gender": "Male",
    "address": "Sector 62, Noida, Uttar Pradesh",
    "guardianName": "Mr. Sharma",
    "guardianPhone": "9876599901",
    "attendancePercentage": 88.5
  }
]
```

### 2.2 Get Student by ID
- **URL:** `/api/students/{id}`
- **Method:** `GET`
- **Access:** Authenticated

### 2.3 Get Students by Class ID
- **URL:** `/api/students/class/{classId}`
- **Method:** `GET`
- **Access:** Authenticated

### 2.4 Create Student
- **URL:** `/api/students`
- **Method:** `POST`
- **Access:** `ROLE_ADMIN`
- **Request Body:**
```json
{
  "rollNumber": "MCA-2026-006",
  "registrationNumber": "REG-2026-06",
  "fullName": "Kavita Rao",
  "username": "kavita.student",
  "email": "kavita@abes.ac.in",
  "password": "student123",
  "phone": "9876500006",
  "classId": 1,
  "dateOfBirth": "2001-07-12",
  "gender": "Female",
  "address": "Vasundhara, Ghaziabad",
  "guardianName": "Mr. Rao",
  "guardianPhone": "9876599906"
}
```
- **Response (201 Created):** Created StudentDTO

### 2.5 Update Student
- **URL:** `/api/students/{id}`
- **Method:** `PUT`
- **Access:** `ROLE_ADMIN`

### 2.6 Delete Student
- **URL:** `/api/students/{id}`
- **Method:** `DELETE`
- **Access:** `ROLE_ADMIN`
- **Response (204 No Content)**

---

## 3. Faculty Management (`/api/faculty`)

### 3.1 Get All Faculty
- **URL:** `/api/faculty`
- **Method:** `GET`
- **Access:** Authenticated

### 3.2 Create Faculty
- **URL:** `/api/faculty`
- **Method:** `POST`
- **Access:** `ROLE_ADMIN`
- **Request Body:**
```json
{
  "employeeId": "FAC-MCA-03",
  "fullName": "Dr. Rajesh Gupta",
  "username": "rajesh.faculty",
  "email": "rajesh.gupta@abes.ac.in",
  "password": "faculty123",
  "phone": "9833445566",
  "department": "Computer Applications",
  "designation": "Associate Professor",
  "qualification": "Ph.D. in AI",
  "dateOfJoining": "2021-01-10",
  "subjectIds": [1, 2]
}
```

### 3.3 Assign Subjects to Faculty
- **URL:** `/api/faculty/{id}/assign-subjects`
- **Method:** `POST`
- **Access:** `ROLE_ADMIN`
- **Request Body:** `[1, 3, 4]`

---

## 4. Subject Management (`/api/subjects`)

### 4.1 Get All Subjects
- **URL:** `/api/subjects`
- **Method:** `GET`

### 4.2 Create Subject
- **URL:** `/api/subjects`
- **Method:** `POST`
- **Access:** `ROLE_ADMIN`
- **Request Body:**
```json
{
  "subjectCode": "MCA305",
  "subjectName": "Mobile Application Development",
  "department": "Computer Applications",
  "semester": 3,
  "credits": 4
}
```

---

## 5. Class Management (`/api/classes`)

### 5.1 Get All Classes
- **URL:** `/api/classes`
- **Method:** `GET`

### 5.2 Create Class
- **URL:** `/api/classes`
- **Method:** `POST`
- **Access:** `ROLE_ADMIN`
- **Request Body:**
```json
{
  "className": "MCA I Year - Sec B",
  "department": "Computer Applications",
  "semester": 1,
  "academicYear": "2026-2027",
  "section": "B"
}
```

---

## 6. Attendance Management (`/api/attendance`)

### 6.1 Mark Batch Attendance
- **URL:** `/api/attendance/batch`
- **Method:** `POST`
- **Access:** `ROLE_ADMIN`, `ROLE_FACULTY`
- **Request Body:**
```json
{
  "classId": 1,
  "subjectId": 1,
  "facultyId": 1,
  "attendanceDate": "2026-11-20",
  "records": [
    {
      "studentId": 1,
      "status": "PRESENT",
      "remarks": "On time"
    },
    {
      "studentId": 2,
      "status": "ABSENT",
      "remarks": "Medical leave"
    }
  ]
}
```
- **Response (200 OK):** List of saved AttendanceDTO records

### 6.2 Get Attendance by Date, Class & Subject
- **URL:** `/api/attendance/class/{classId}/subject/{subjectId}?date=2026-11-20`
- **Method:** `GET`

### 6.3 Student Attendance Summary
- **URL:** `/api/attendance/student/{studentId}/summary`
- **Method:** `GET`
- **Response (200 OK):**
```json
{
  "studentId": 1,
  "rollNumber": "MCA-2026-001",
  "studentName": "Aarav Sharma",
  "totalClasses": 40,
  "presentClasses": 36,
  "absentClasses": 4,
  "lateClasses": 0,
  "overallPercentage": 90.0,
  "isDefaulter": false,
  "subjectBreakdown": [
    {
      "subjectId": 1,
      "subjectCode": "MCA301",
      "subjectName": "Advanced Database Management Systems",
      "totalClasses": 10,
      "presentClasses": 9,
      "absentClasses": 1,
      "lateClasses": 0,
      "attendancePercentage": 90.0,
      "status": "GOOD"
    }
  ]
}
```

### 6.4 Student Attendance History
- **URL:** `/api/attendance/student/{studentId}/history`
- **Method:** `GET`

### 6.5 Attendance Filtered Report
- **URL:** `/api/attendance/report?classId=1&subjectId=1&startDate=2026-11-01&endDate=2026-11-20`
- **Method:** `GET`

---

## 7. Marks & Performance Management (`/api/marks`)

### 7.1 Record Batch Marks
- **URL:** `/api/marks/batch`
- **Method:** `POST`
- **Access:** `ROLE_ADMIN`, `ROLE_FACULTY`
- **Request Body:**
```json
{
  "classId": 1,
  "subjectId": 1,
  "facultyId": 1,
  "assessmentType": "QUIZ",
  "maxMarks": 20.0,
  "assessmentDate": "2026-11-20",
  "records": [
    {
      "studentId": 1,
      "marksObtained": 18.5,
      "remarks": "Excellent"
    },
    {
      "studentId": 2,
      "marksObtained": 17.0,
      "remarks": "Good"
    }
  ]
}
```

### 7.2 Student Performance Report
- **URL:** `/api/marks/student/{studentId}/performance`
- **Method:** `GET`
- **Response (200 OK):**
```json
{
  "studentId": 1,
  "rollNumber": "MCA-2026-001",
  "studentName": "Aarav Sharma",
  "className": "MCA II Year - Sec A",
  "totalAssessments": 6,
  "totalMarksObtained": 175.0,
  "totalMaxMarks": 200.0,
  "averagePercentage": 87.5,
  "overallGrade": "A",
  "subjectWisePerformance": [ ... ]
}
```

---

## 8. Dashboard Statistics (`/api/dashboard`)

### 8.1 Admin Dashboard
- **URL:** `/api/dashboard/admin`
- **Method:** `GET`
- **Access:** `ROLE_ADMIN`

### 8.2 Faculty Dashboard
- **URL:** `/api/dashboard/faculty/{facultyId}`
- **Method:** `GET`
- **Access:** `ROLE_FACULTY`, `ROLE_ADMIN`

### 8.3 Student Dashboard
- **URL:** `/api/dashboard/student/{studentId}`
- **Method:** `GET`
- **Access:** `ROLE_STUDENT`, `ROLE_ADMIN`
