package com.attendance.system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public class FacultyDTO {
    private Long id;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    private Long userId;

    @NotBlank(message = "Username is required")
    private String username;

    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    private String designation;
    private String qualification;
    private LocalDate dateOfJoining;
    private List<Long> subjectIds;
    private List<String> subjectNames;

    public FacultyDTO() {
    }

    public FacultyDTO(Long id, String employeeId, Long userId, String username, String email, String fullName, String phone, String department, String designation, String qualification, LocalDate dateOfJoining, List<Long> subjectIds, List<String> subjectNames) {
        this.id = id;
        this.employeeId = employeeId;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.qualification = qualification;
        this.dateOfJoining = dateOfJoining;
        this.subjectIds = subjectIds;
        this.subjectNames = subjectNames;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public LocalDate getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(LocalDate dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public List<Long> getSubjectIds() {
        return subjectIds;
    }

    public void setSubjectIds(List<Long> subjectIds) {
        this.subjectIds = subjectIds;
    }

    public List<String> getSubjectNames() {
        return subjectNames;
    }

    public void setSubjectNames(List<String> subjectNames) {
        this.subjectNames = subjectNames;
    }
}
