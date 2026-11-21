package com.attendance.system.dto;

import java.util.List;

public class AttendanceSummaryDTO {
    private Long studentId;
    private String rollNumber;
    private String studentName;
    private long totalClasses;
    private long presentClasses;
    private long absentClasses;
    private long lateClasses;
    private double overallPercentage;
    private boolean isDefaulter; // true if overallPercentage < 75.0
    private List<SubjectAttendanceDTO> subjectBreakdown;

    public AttendanceSummaryDTO() {
    }

    public AttendanceSummaryDTO(Long studentId, String rollNumber, String studentName, long totalClasses, long presentClasses, long absentClasses, long lateClasses, double overallPercentage, boolean isDefaulter, List<SubjectAttendanceDTO> subjectBreakdown) {
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.studentName = studentName;
        this.totalClasses = totalClasses;
        this.presentClasses = presentClasses;
        this.absentClasses = absentClasses;
        this.lateClasses = lateClasses;
        this.overallPercentage = overallPercentage;
        this.isDefaulter = isDefaulter;
        this.subjectBreakdown = subjectBreakdown;
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

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public long getPresentClasses() {
        return presentClasses;
    }

    public void setPresentClasses(long presentClasses) {
        this.presentClasses = presentClasses;
    }

    public long getAbsentClasses() {
        return absentClasses;
    }

    public void setAbsentClasses(long absentClasses) {
        this.absentClasses = absentClasses;
    }

    public long getLateClasses() {
        return lateClasses;
    }

    public void setLateClasses(long lateClasses) {
        this.lateClasses = lateClasses;
    }

    public double getOverallPercentage() {
        return overallPercentage;
    }

    public void setOverallPercentage(double overallPercentage) {
        this.overallPercentage = overallPercentage;
    }

    public boolean isDefaulter() {
        return isDefaulter;
    }

    public void setDefaulter(boolean defaulter) {
        isDefaulter = defaulter;
    }

    public List<SubjectAttendanceDTO> getSubjectBreakdown() {
        return subjectBreakdown;
    }

    public void setSubjectBreakdown(List<SubjectAttendanceDTO> subjectBreakdown) {
        this.subjectBreakdown = subjectBreakdown;
    }
}
