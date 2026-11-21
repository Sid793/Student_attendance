package com.attendance.system.dto;

import com.attendance.system.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

public class StudentAttendanceRecord {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus status;

    private String remarks;

    public StudentAttendanceRecord() {
    }

    public StudentAttendanceRecord(Long studentId, AttendanceStatus status, String remarks) {
        this.studentId = studentId;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
