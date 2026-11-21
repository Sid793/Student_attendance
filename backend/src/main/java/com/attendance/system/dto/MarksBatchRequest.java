package com.attendance.system.dto;

import com.attendance.system.entity.AssessmentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class MarksBatchRequest {

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    private Long facultyId;

    @NotNull(message = "Assessment type is required")
    private AssessmentType assessmentType;

    @NotNull(message = "Maximum marks is required")
    private Double maxMarks;

    @NotNull(message = "Assessment date is required")
    private LocalDate assessmentDate;

    @NotEmpty(message = "Marks records cannot be empty")
    @Valid
    private List<StudentMarksRecord> records;

    public MarksBatchRequest() {
    }

    public MarksBatchRequest(Long classId, Long subjectId, Long facultyId, AssessmentType assessmentType, Double maxMarks, LocalDate assessmentDate, List<StudentMarksRecord> records) {
        this.classId = classId;
        this.subjectId = subjectId;
        this.facultyId = facultyId;
        this.assessmentType = assessmentType;
        this.maxMarks = maxMarks;
        this.assessmentDate = assessmentDate;
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

    public AssessmentType getAssessmentType() {
        return assessmentType;
    }

    public void setAssessmentType(AssessmentType assessmentType) {
        this.assessmentType = assessmentType;
    }

    public Double getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Double maxMarks) {
        this.maxMarks = maxMarks;
    }

    public LocalDate getAssessmentDate() {
        return assessmentDate;
    }

    public void setAssessmentDate(LocalDate assessmentDate) {
        this.assessmentDate = assessmentDate;
    }

    public List<StudentMarksRecord> getRecords() {
        return records;
    }

    public void setRecords(List<StudentMarksRecord> records) {
        this.records = records;
    }
}
