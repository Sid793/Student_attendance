package com.attendance.system.dto;

import java.util.List;

public class SubjectPerformanceDTO {
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private Double totalMarksObtained;
    private Double totalMaxMarks;
    private Double percentage;
    private String grade;
    private List<MarksDTO> assessments;

    public SubjectPerformanceDTO() {
    }

    public SubjectPerformanceDTO(Long subjectId, String subjectCode, String subjectName, Double totalMarksObtained, Double totalMaxMarks, Double percentage, String grade, List<MarksDTO> assessments) {
        this.subjectId = subjectId;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.totalMarksObtained = totalMarksObtained;
        this.totalMaxMarks = totalMaxMarks;
        this.percentage = percentage;
        this.grade = grade;
        this.assessments = assessments;
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

    public Double getTotalMarksObtained() {
        return totalMarksObtained;
    }

    public void setTotalMarksObtained(Double totalMarksObtained) {
        this.totalMarksObtained = totalMarksObtained;
    }

    public Double getTotalMaxMarks() {
        return totalMaxMarks;
    }

    public void setTotalMaxMarks(Double totalMaxMarks) {
        this.totalMaxMarks = totalMaxMarks;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public List<MarksDTO> getAssessments() {
        return assessments;
    }

    public void setAssessments(List<MarksDTO> assessments) {
        this.assessments = assessments;
    }
}
