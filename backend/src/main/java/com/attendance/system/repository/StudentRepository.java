package com.attendance.system.repository;

import com.attendance.system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByRegistrationNumber(String registrationNumber);
    Optional<Student> findByUserId(Long userId);
    Boolean existsByRollNumber(String rollNumber);
    List<Student> findByClassRoomId(Long classId);
    long countByClassRoomId(Long classId);
}
