package com.attendance.system.service;

import com.attendance.system.dto.MarksBatchRequest;
import com.attendance.system.dto.MarksDTO;
import com.attendance.system.dto.StudentPerformanceDTO;
import com.attendance.system.entity.AssessmentType;
import java.util.List;

public interface MarksService {
    List<MarksDTO> saveBatchMarks(MarksBatchRequest request);
    List<MarksDTO> getMarksByClassSubjectAndAssessment(Long classId, Long subjectId, AssessmentType assessmentType);
    List<MarksDTO> getMarksByStudentId(Long studentId);
    StudentPerformanceDTO getStudentPerformanceReport(Long studentId);
    List<MarksDTO> getClassMarksReport(Long classId, Long subjectId);
}
