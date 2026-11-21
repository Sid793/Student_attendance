package com.attendance.system.controller;

import com.attendance.system.dto.AttendanceBatchRequest;
import com.attendance.system.dto.AttendanceDTO;
import com.attendance.system.dto.AttendanceSummaryDTO;
import com.attendance.system.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/batch")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<AttendanceDTO>> markBatchAttendance(@Valid @RequestBody AttendanceBatchRequest request) {
        return ResponseEntity.ok(attendanceService.markBatchAttendance(request));
    }

    @GetMapping("/class/{classId}/subject/{subjectId}")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByDate(
            @PathVariable Long classId,
            @PathVariable Long subjectId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByClassSubjectAndDate(classId, subjectId, date));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<AttendanceSummaryDTO> getStudentSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceSummary(studentId));
    }

    @GetMapping("/student/{studentId}/history")
    public ResponseEntity<List<AttendanceDTO>> getStudentHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceHistory(studentId));
    }

    @GetMapping("/report")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceReport(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getClassAttendanceReport(classId, subjectId, startDate, endDate));
    }
}
