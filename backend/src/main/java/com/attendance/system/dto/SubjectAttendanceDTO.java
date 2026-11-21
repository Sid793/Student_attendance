package com.attendance.system.dto;

public class SubjectAttendanceDTO {
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private long totalClasses;
    private long presentClasses;
    private long absentClasses;
    private long lateClasses;
    private double attendancePercentage;
    private String status; // "GOOD", "WARNING", "CRITICAL" (<75%)

    public SubjectAttendanceDTO() {
    }

    public SubjectAttendanceDTO(Long subjectId, String subjectCode, String subjectName, long totalClasses, long presentClasses, long absentClasses, long lateClasses, double attendancePercentage, String status) {
        this.subjectId = subjectId;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.totalClasses = totalClasses;
        this.presentClasses = presentClasses;
        this.absentClasses = absentClasses;
        this.lateClasses = lateClasses;
        this.attendancePercentage = attendancePercentage;
        this.status = status;
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

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
