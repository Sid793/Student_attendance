package com.attendance.system.dto;

import java.util.List;

public class StudentPerformanceDTO {
    private Long studentId;
    private String rollNumber;
    private String studentName;
    private String className;
    private Integer totalAssessments;
    private Double totalMarksObtained;
    private Double totalMaxMarks;
    private Double averagePercentage;
    private String overallGrade;
    private List<SubjectPerformanceDTO> subjectWisePerformance;

    public StudentPerformanceDTO() {
    }

    public StudentPerformanceDTO(Long studentId, String rollNumber, String studentName, String className, Integer totalAssessments, Double totalMarksObtained, Double totalMaxMarks, Double averagePercentage, String overallGrade, List<SubjectPerformanceDTO> subjectWisePerformance) {
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.studentName = studentName;
        this.className = className;
        this.totalAssessments = totalAssessments;
        this.totalMarksObtained = totalMarksObtained;
        this.totalMaxMarks = totalMaxMarks;
        this.averagePercentage = averagePercentage;
        this.overallGrade = overallGrade;
        this.subjectWisePerformance = subjectWisePerformance;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Integer getTotalAssessments() {
        return totalAssessments;
    }

    public void setTotalAssessments(Integer totalAssessments) {
        this.totalAssessments = totalAssessments;
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

    public Double getAveragePercentage() {
        return averagePercentage;
    }

    public void setAveragePercentage(Double averagePercentage) {
        this.averagePercentage = averagePercentage;
    }

    public String getOverallGrade() {
        return overallGrade;
    }

    public void setOverallGrade(String overallGrade) {
        this.overallGrade = overallGrade;
    }

    public List<SubjectPerformanceDTO> getSubjectWisePerformance() {
        return subjectWisePerformance;
    }

    public void setSubjectWisePerformance(List<SubjectPerformanceDTO> subjectWisePerformance) {
        this.subjectWisePerformance = subjectWisePerformance;
    }
}
