package com.attendance.system.service.impl;

import com.attendance.system.dto.*;
import com.attendance.system.entity.*;
import com.attendance.system.exception.ResourceNotFoundException;
import com.attendance.system.repository.*;
import com.attendance.system.service.AttendanceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final FacultyRepository facultyRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository,
                                 StudentRepository studentRepository,
                                 SubjectRepository subjectRepository,
                                 ClassRoomRepository classRoomRepository,
                                 FacultyRepository facultyRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.classRoomRepository = classRoomRepository;
        this.facultyRepository = facultyRepository;
    }

    @Override
    public List<AttendanceDTO> markBatchAttendance(AttendanceBatchRequest request) {
        ClassRoom classRoom = classRoomRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        Faculty faculty = null;
        if (request.getFacultyId() != null) {
            faculty = facultyRepository.findById(request.getFacultyId()).orElse(null);
        }

        List<Attendance> savedRecords = new ArrayList<>();

        for (StudentAttendanceRecord rec : request.getRecords()) {
            Student student = studentRepository.findById(rec.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + rec.getStudentId()));

            // Check if record exists for this date, student, subject (upsert)
            Optional<Attendance> existing = attendanceRepository.findByStudentIdAndSubjectIdAndAttendanceDate(
                    student.getId(), subject.getId(), request.getAttendanceDate()
            );

            Attendance attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
                attendance.setStatus(rec.getStatus());
                attendance.setRemarks(rec.getRemarks());
                if (faculty != null) {
                    attendance.setFaculty(faculty);
                }
            } else {
                attendance = new Attendance(
                        student,
                        subject,
                        classRoom,
                        faculty,
                        request.getAttendanceDate(),
                        rec.getStatus(),
                        rec.getRemarks()
                );
            }
            savedRecords.add(attendanceRepository.save(attendance));
        }

        return savedRecords.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByClassSubjectAndDate(Long classId, Long subjectId, LocalDate date) {
        return attendanceRepository.findByClassRoomIdAndSubjectIdAndAttendanceDate(classId, subjectId, date)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceSummaryDTO getStudentAttendanceSummary(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        long totalClasses = attendanceRepository.countByStudentId(studentId);
        long presentClasses = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        long absentClasses = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.ABSENT);
        long lateClasses = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.LATE);

        double overallPercentage = 0.0;
        if (totalClasses > 0) {
            overallPercentage = Math.round(((double) presentClasses / totalClasses) * 100.0 * 10.0) / 10.0;
        }

        boolean isDefaulter = overallPercentage < 75.0 && totalClasses > 0;

        // Subject-wise breakdown
        List<Subject> allSubjects = (student.getClassRoom() != null)
                ? subjectRepository.findBySemester(student.getClassRoom().getSemester())
                : subjectRepository.findAll();

        List<SubjectAttendanceDTO> subjectBreakdown = new ArrayList<>();
        for (Subject sub : allSubjects) {
            long subTotal = attendanceRepository.countByStudentIdAndSubjectId(studentId, sub.getId());
            long subPresent = attendanceRepository.countByStudentIdAndSubjectIdAndStatus(studentId, sub.getId(), AttendanceStatus.PRESENT);
            long subAbsent = attendanceRepository.countByStudentIdAndSubjectIdAndStatus(studentId, sub.getId(), AttendanceStatus.ABSENT);
            long subLate = attendanceRepository.countByStudentIdAndSubjectIdAndStatus(studentId, sub.getId(), AttendanceStatus.LATE);

            double subPercentage = 0.0;
            if (subTotal > 0) {
                subPercentage = Math.round(((double) subPresent / subTotal) * 100.0 * 10.0) / 10.0;
            }

            String status = "GOOD";
            if (subTotal > 0) {
                if (subPercentage < 75.0) {
                    status = "CRITICAL";
                } else if (subPercentage < 80.0) {
                    status = "WARNING";
                }
            }

            subjectBreakdown.add(new SubjectAttendanceDTO(
                    sub.getId(),
                    sub.getSubjectCode(),
                    sub.getSubjectName(),
                    subTotal,
                    subPresent,
                    subAbsent,
                    subLate,
                    subPercentage,
                    status
            ));
        }

        return new AttendanceSummaryDTO(
                student.getId(),
                student.getRollNumber(),
                student.getUser() != null ? student.getUser().getFullName() : "N/A",
                totalClasses,
                presentClasses,
                absentClasses,
                lateClasses,
                overallPercentage,
                isDefaulter,
                subjectBreakdown
        );
    }

    @Override
    public List<AttendanceDTO> getStudentAttendanceHistory(Long studentId) {
        return attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getClassAttendanceReport(Long classId, Long subjectId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> list;
        if (classId != null && subjectId != null && startDate != null && endDate != null) {
            list = attendanceRepository.findByClassSubjectAndDateRange(classId, subjectId, startDate, endDate);
        } else if (startDate != null && endDate != null) {
            list = attendanceRepository.findByDateRange(startDate, endDate);
        } else if (classId != null && subjectId != null) {
            list = attendanceRepository.findByClassRoomIdAndSubjectId(classId, subjectId);
        } else {
            list = attendanceRepository.findAll();
        }

        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private AttendanceDTO mapToDTO(Attendance att) {
        return new AttendanceDTO(
                att.getId(),
                att.getStudent() != null ? att.getStudent().getId() : null,
                att.getStudent() != null ? att.getStudent().getRollNumber() : null,
                (att.getStudent() != null && att.getStudent().getUser() != null) ? att.getStudent().getUser().getFullName() : null,
                att.getSubject() != null ? att.getSubject().getId() : null,
                att.getSubject() != null ? att.getSubject().getSubjectCode() : null,
                att.getSubject() != null ? att.getSubject().getSubjectName() : null,
                att.getClassRoom() != null ? att.getClassRoom().getId() : null,
                att.getClassRoom() != null ? att.getClassRoom().getClassName() : null,
                att.getFaculty() != null ? att.getFaculty().getId() : null,
                (att.getFaculty() != null && att.getFaculty().getUser() != null) ? att.getFaculty().getUser().getFullName() : null,
                att.getAttendanceDate(),
                att.getStatus(),
                att.getRemarks(),
                att.getRecordedAt()
        );
    }
}
