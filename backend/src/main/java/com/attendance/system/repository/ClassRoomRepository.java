package com.attendance.system.repository;

import com.attendance.system.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    List<ClassRoom> findByDepartment(String department);
    List<ClassRoom> findBySemester(Integer semester);
    List<ClassRoom> findByDepartmentAndSemester(String department, Integer semester);
}
