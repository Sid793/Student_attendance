package com.attendance.system.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "subject_id", "assessment_type"})
})
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @Enumerated(EnumType.STRING)
    @Column(name = "assessment_type", nullable = false, length = 20)
    private AssessmentType assessmentType;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks;

    @Column(name = "marks_obtained", nullable = false)
    private Double marksObtained;

    @Column(name = "assessment_date")
    private LocalDate assessmentDate;

    @Column(length = 255)
    private String remarks;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    public Marks() {
    }

    public Marks(Student student, Subject subject, ClassRoom classRoom, Faculty faculty, AssessmentType assessmentType, Double maxMarks, Double marksObtained, LocalDate assessmentDate, String remarks) {
        this.student = student;
        this.subject = subject;
        this.classRoom = classRoom;
        this.faculty = faculty;
        this.assessmentType = assessmentType;
        this.maxMarks = maxMarks;
        this.marksObtained = marksObtained;
        this.assessmentDate = assessmentDate;
        this.remarks = remarks;
    }

    @PrePersist
    protected void onCreate() {
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public ClassRoom getClassRoom() {
        return classRoom;
    }

    public void setClassRoom(ClassRoom classRoom) {
        this.classRoom = classRoom;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
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
