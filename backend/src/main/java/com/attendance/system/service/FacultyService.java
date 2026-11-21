package com.attendance.system.service;

import com.attendance.system.dto.FacultyDTO;
import java.util.List;

public interface FacultyService {
    List<FacultyDTO> getAllFaculty();
    FacultyDTO getFacultyById(Long id);
    FacultyDTO getFacultyByUserId(Long userId);
    FacultyDTO createFaculty(FacultyDTO facultyDTO);
    FacultyDTO updateFaculty(Long id, FacultyDTO facultyDTO);
    void deleteFaculty(Long id);
    FacultyDTO assignSubjects(Long facultyId, List<Long> subjectIds);
}
