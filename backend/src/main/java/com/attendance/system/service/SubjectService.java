package com.attendance.system.service;

import com.attendance.system.dto.SubjectDTO;
import java.util.List;

public interface SubjectService {
    List<SubjectDTO> getAllSubjects();
    SubjectDTO getSubjectById(Long id);
    SubjectDTO createSubject(SubjectDTO subjectDTO);
    SubjectDTO updateSubject(Long id, SubjectDTO subjectDTO);
    void deleteSubject(Long id);
    List<SubjectDTO> getSubjectsBySemester(Integer semester);
    List<SubjectDTO> getSubjectsByDepartment(String department);
}
