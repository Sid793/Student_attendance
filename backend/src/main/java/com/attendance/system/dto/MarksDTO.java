package com.attendance.system.dto;

import com.attendance.system.entity.AssessmentType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MarksDTO {
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
    private AssessmentType assessmentType;
    private Double maxMarks;
    private Double marksObtained;
    private Double percentage;
    private String grade;
    private LocalDate assessmentDate;
    private String remarks;
    private LocalDateTime recordedAt;

    public MarksDTO() {
    }

    public MarksDTO(Long id, Long studentId, String studentRollNumber, String studentName, Long subjectId, String subjectCode, String subjectName, Long classId, String className, Long facultyId, String facultyName, AssessmentType assessmentType, Double maxMarks, Double marksObtained, Double percentage, String grade, LocalDate assessmentDate, String remarks, LocalDateTime recordedAt) {
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
        this.assessmentType = assessmentType;
        this.maxMarks = maxMarks;
        this.marksObtained = marksObtained;
        this.percentage = percentage;
        this.grade = grade;
        this.assessmentDate = assessmentDate;
        this.remarks = remarks;
        this.recordedAt = recordedAt;
    }

    public static String calculateGrade(Double percentage) {
        if (percentage == null) return "N/A";
        if (percentage >= 90.0) return "A+";
        if (percentage >= 80.0) return "A";
        if (percentage >= 70.0) return "B";
        if (percentage >= 60.0) return "C";
        if (percentage >= 50.0) return "D";
        return "F";
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

    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
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

    public LocalDate getAssessmentDate() {
        return assessmentDate;
    }

    public void setAssessmentDate(LocalDate assessmentDate) {
        this.assessmentDate = assessmentDate;
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
