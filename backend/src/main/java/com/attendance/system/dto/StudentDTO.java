package com.attendance.system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class StudentDTO {
    private Long id;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    private String registrationNumber;
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
    private Long classId;
    private String className;
    private String department;
    private Integer semester;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private Double attendancePercentage;

    public StudentDTO() {
    }

    public StudentDTO(Long id, String rollNumber, String registrationNumber, Long userId, String username, String email, String fullName, String phone, Long classId, String className, String department, Integer semester, LocalDate dateOfBirth, String gender, String address, String guardianName, String guardianPhone, Double attendancePercentage) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.registrationNumber = registrationNumber;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.classId = classId;
        this.className = className;
        this.department = department;
        this.semester = semester;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.guardianName = guardianName;
        this.guardianPhone = guardianPhone;
        this.attendancePercentage = attendancePercentage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianPhone() {
        return guardianPhone;
    }

    public void setGuardianPhone(String guardianPhone) {
        this.guardianPhone = guardianPhone;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
}
