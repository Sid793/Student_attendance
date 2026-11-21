package com.attendance.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentAttendanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentAttendanceApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("Student Attendance & Performance Tracking System Started!");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("Swagger/H2/Console ready (if enabled)");
        System.out.println("Default Login:");
        System.out.println("  Admin:   admin / admin123");
        System.out.println("  Faculty: neha.faculty / faculty123");
        System.out.println("  Student: aarav.student / student123");
        System.out.println("==========================================================");
    }
}
