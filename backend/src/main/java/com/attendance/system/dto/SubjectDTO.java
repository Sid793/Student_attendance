package com.attendance.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SubjectDTO {
    private Long id;

    @NotBlank(message = "Subject code is required")
    private String subjectCode;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Semester is required")
    private Integer semester;

    private Integer credits = 4;
    private List<String> facultyNames;

    public SubjectDTO() {
    }

    public SubjectDTO(Long id, String subjectCode, String subjectName, String department, Integer semester, Integer credits, List<String> facultyNames) {
        this.id = id;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.department = department;
        this.semester = semester;
        this.credits = credits;
        this.facultyNames = facultyNames;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public List<String> getFacultyNames() {
        return facultyNames;
    }

    public void setFacultyNames(List<String> facultyNames) {
        this.facultyNames = facultyNames;
    }
}
