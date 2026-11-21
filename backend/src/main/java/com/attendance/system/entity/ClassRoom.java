package com.attendance.system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "classes")
public class ClassRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_name", nullable = false, length = 100)
    private String className; // e.g. "MCA II Year"

    @Column(nullable = false, length = 50)
    private String department; // e.g. "Master of Computer Applications"

    @Column(nullable = false)
    private Integer semester; // e.g. 3

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear; // e.g. "2026-2027"

    @Column(length = 10)
    private String section; // e.g. "A"

    public ClassRoom() {
    }

    public ClassRoom(String className, String department, Integer semester, String academicYear, String section) {
        this.className = className;
        this.department = department;
        this.semester = semester;
        this.academicYear = academicYear;
        this.section = section;
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
}
