package com.attendance.system.service;

import com.attendance.system.dto.AttendanceBatchRequest;
import com.attendance.system.dto.AttendanceDTO;
import com.attendance.system.dto.AttendanceSummaryDTO;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceDTO> markBatchAttendance(AttendanceBatchRequest request);
    List<AttendanceDTO> getAttendanceByClassSubjectAndDate(Long classId, Long subjectId, LocalDate date);
    AttendanceSummaryDTO getStudentAttendanceSummary(Long studentId);
    List<AttendanceDTO> getStudentAttendanceHistory(Long studentId);
    List<AttendanceDTO> getClassAttendanceReport(Long classId, Long subjectId, LocalDate startDate, LocalDate endDate);
}
