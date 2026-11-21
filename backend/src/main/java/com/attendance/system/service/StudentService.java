package com.attendance.system.service;

import com.attendance.system.dto.StudentDTO;
import java.util.List;

public interface StudentService {
    List<StudentDTO> getAllStudents();
    StudentDTO getStudentById(Long id);
    StudentDTO getStudentByUserId(Long userId);
    List<StudentDTO> getStudentsByClassId(Long classId);
    StudentDTO createStudent(StudentDTO studentDTO);
    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    void deleteStudent(Long id);
    Double calculateOverallAttendance(Long studentId);
}
