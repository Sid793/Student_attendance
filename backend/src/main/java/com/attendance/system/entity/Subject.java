package com.attendance.system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", nullable = false, unique = true, length = 20)
    private String subjectCode; // e.g. "MCA301"

    @Column(name = "subject_name", nullable = false, length = 100)
    private String subjectName; // e.g. "Advanced Database Management Systems"

    @Column(nullable = false, length = 50)
    private String department;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private Integer credits = 4;

    @JsonIgnore
    @ManyToMany(mappedBy = "subjects")
    private Set<Faculty> faculties = new HashSet<>();

    public Subject() {
    }

    public Subject(String subjectCode, String subjectName, String department, Integer semester, Integer credits) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.department = department;
        this.semester = semester;
        this.credits = credits;
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

    public Set<Faculty> getFaculties() {
        return faculties;
    }

    public void setFaculties(Set<Faculty> faculties) {
        this.faculties = faculties;
    }
}
