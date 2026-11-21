package com.attendance.system.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalStudents;
    private long totalFaculty;
    private long totalSubjects;
    private long totalClasses;
    private double overallAttendancePercentage;
    private long lowAttendanceCount; // students < 75%
    private List<StudentDTO> topPerformers;
    private Map<String, Double> subjectAttendanceRates;
    private Map<String, Double> subjectAverageScores;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalStudents, long totalFaculty, long totalSubjects, long totalClasses, double overallAttendancePercentage, long lowAttendanceCount, List<StudentDTO> topPerformers, Map<String, Double> subjectAttendanceRates, Map<String, Double> subjectAverageScores) {
        this.totalStudents = totalStudents;
        this.totalFaculty = totalFaculty;
        this.totalSubjects = totalSubjects;
        this.totalClasses = totalClasses;
        this.overallAttendancePercentage = overallAttendancePercentage;
        this.lowAttendanceCount = lowAttendanceCount;
        this.topPerformers = topPerformers;
        this.subjectAttendanceRates = subjectAttendanceRates;
        this.subjectAverageScores = subjectAverageScores;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalFaculty() {
        return totalFaculty;
    }

    public void setTotalFaculty(long totalFaculty) {
        this.totalFaculty = totalFaculty;
    }

    public long getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(long totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public double getOverallAttendancePercentage() {
        return overallAttendancePercentage;
    }

    public void setOverallAttendancePercentage(double overallAttendancePercentage) {
        this.overallAttendancePercentage = overallAttendancePercentage;
    }

    public long getLowAttendanceCount() {
        return lowAttendanceCount;
    }

    public void setLowAttendanceCount(long lowAttendanceCount) {
        this.lowAttendanceCount = lowAttendanceCount;
    }

    public List<StudentDTO> getTopPerformers() {
        return topPerformers;
    }

    public void setTopPerformers(List<StudentDTO> topPerformers) {
        this.topPerformers = topPerformers;
    }

    public Map<String, Double> getSubjectAttendanceRates() {
        return subjectAttendanceRates;
    }

    public void setSubjectAttendanceRates(Map<String, Double> subjectAttendanceRates) {
        this.subjectAttendanceRates = subjectAttendanceRates;
    }

    public Map<String, Double> getSubjectAverageScores() {
        return subjectAverageScores;
    }

    public void setSubjectAverageScores(Map<String, Double> subjectAverageScores) {
        this.subjectAverageScores = subjectAverageScores;
    }
}
