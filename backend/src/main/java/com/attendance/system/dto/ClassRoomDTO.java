package com.attendance.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClassRoomDTO {
    private Long id;

    @NotBlank(message = "Class name is required")
    private String className;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Semester is required")
    private Integer semester;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    private String section;
    private Long studentCount;

    public ClassRoomDTO() {
    }

    public ClassRoomDTO(Long id, String className, String department, Integer semester, String academicYear, String section, Long studentCount) {
        this.id = id;
        this.className = className;
        this.department = department;
        this.semester = semester;
        this.academicYear = academicYear;
        this.section = section;
        this.studentCount = studentCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
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

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Long studentCount) {
        this.studentCount = studentCount;
    }
}
