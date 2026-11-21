package com.attendance.system.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class AttendanceBatchRequest {

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    private Long facultyId;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotEmpty(message = "Attendance records cannot be empty")
    @Valid
    private List<StudentAttendanceRecord> records;

    public AttendanceBatchRequest() {
    }

    public AttendanceBatchRequest(Long classId, Long subjectId, Long facultyId, LocalDate attendanceDate, List<StudentAttendanceRecord> records) {
        this.classId = classId;
        this.subjectId = subjectId;
        this.facultyId = facultyId;
        this.attendanceDate = attendanceDate;
        this.records = records;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public List<StudentAttendanceRecord> getRecords() {
        return records;
    }

    public void setRecords(List<StudentAttendanceRecord> records) {
        this.records = records;
    }
}
