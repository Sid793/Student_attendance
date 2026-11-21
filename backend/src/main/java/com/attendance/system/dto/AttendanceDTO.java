package com.attendance.system.dto;

import com.attendance.system.entity.AttendanceStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceDTO {
    private Long id;
    private Long studentId;
    private String studentRollNumber;
    private String studentName;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private Long classId;
    private String className;
    private Long facultyId;
    private String facultyName;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private String remarks;
    private LocalDateTime recordedAt;

    public AttendanceDTO() {
    }

    public AttendanceDTO(Long id, Long studentId, String studentRollNumber, String studentName, Long subjectId, String subjectCode, String subjectName, Long classId, String className, Long facultyId, String facultyName, LocalDate attendanceDate, AttendanceStatus status, String remarks, LocalDateTime recordedAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentRollNumber = studentRollNumber;
        this.studentName = studentName;
        this.subjectId = subjectId;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.classId = classId;
        this.className = className;
        this.facultyId = facultyId;
        this.facultyName = facultyName;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.remarks = remarks;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentRollNumber() {
        return studentRollNumber;
    }

    public void setStudentRollNumber(String studentRollNumber) {
        this.studentRollNumber = studentRollNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
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

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
