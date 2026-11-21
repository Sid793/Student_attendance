package com.attendance.system.dto;

import jakarta.validation.constraints.NotNull;

public class StudentMarksRecord {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Marks obtained is required")
    private Double marksObtained;

    private String remarks;

    public StudentMarksRecord() {
    }

    public StudentMarksRecord(Long studentId, Double marksObtained, String remarks) {
        this.studentId = studentId;
        this.marksObtained = marksObtained;
        this.remarks = remarks;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
