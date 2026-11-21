package com.attendance.system.controller;

import com.attendance.system.dto.AttendanceSummaryDTO;
import com.attendance.system.dto.DashboardStatsDTO;
import com.attendance.system.dto.StudentPerformanceDTO;
import com.attendance.system.service.AttendanceService;
import com.attendance.system.service.DashboardService;
import com.attendance.system.service.MarksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AttendanceService attendanceService;
    private final MarksService marksService;

    public DashboardController(DashboardService dashboardService,
                               AttendanceService attendanceService,
                               MarksService marksService) {
        this.dashboardService = dashboardService;
        this.attendanceService = attendanceService;
        this.marksService = marksService;
    }

    @GetMapping("/admin")
    public ResponseEntity<DashboardStatsDTO> getAdminDashboardStats() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<DashboardStatsDTO> getFacultyDashboardStats(@PathVariable Long facultyId) {
        return ResponseEntity.ok(dashboardService.getFacultyDashboardStats(facultyId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentDashboardStats(@PathVariable Long studentId) {
        AttendanceSummaryDTO attendanceSummary = attendanceService.getStudentAttendanceSummary(studentId);
        StudentPerformanceDTO performanceSummary = marksService.getStudentPerformanceReport(studentId);

        Map<String, Object> response = new HashMap<>();
        response.put("attendance", attendanceSummary);
        response.put("performance", performanceSummary);

        return ResponseEntity.ok(response);
    }
}
