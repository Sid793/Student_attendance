package com.attendance.system.repository;

import com.attendance.system.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmployeeId(String employeeId);
    Optional<Faculty> findByUserId(Long userId);
    Boolean existsByEmployeeId(String employeeId);
    List<Faculty> findByDepartment(String department);

    @Query("SELECT f FROM Faculty f JOIN f.subjects s WHERE s.id = :subjectId")
    List<Faculty> findBySubjectId(@Param("subjectId") Long subjectId);
}
