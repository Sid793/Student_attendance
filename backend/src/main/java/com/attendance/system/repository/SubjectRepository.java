package com.attendance.system.repository;

import com.attendance.system.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findBySubjectCode(String subjectCode);
    Boolean existsBySubjectCode(String subjectCode);
    List<Subject> findByDepartment(String department);
    List<Subject> findBySemester(Integer semester);
    List<Subject> findByDepartmentAndSemester(String department, Integer semester);
}
