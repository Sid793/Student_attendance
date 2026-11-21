package com.attendance.system.service.impl;

import com.attendance.system.dto.DashboardStatsDTO;
import com.attendance.system.dto.StudentDTO;
import com.attendance.system.entity.AttendanceStatus;
import com.attendance.system.entity.Faculty;
import com.attendance.system.entity.Subject;
import com.attendance.system.repository.*;
import com.attendance.system.service.DashboardService;
import com.attendance.system.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final StudentService studentService;

    public DashboardServiceImpl(StudentRepository studentRepository,
                                FacultyRepository facultyRepository,
                                SubjectRepository subjectRepository,
                                ClassRoomRepository classRoomRepository,
                                AttendanceRepository attendanceRepository,
                                MarksRepository marksRepository,
                                StudentService studentService) {
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.subjectRepository = subjectRepository;
        this.classRoomRepository = classRoomRepository;
        this.attendanceRepository = attendanceRepository;
        this.marksRepository = marksRepository;
        this.studentService = studentService;
    }

    @Override
    public DashboardStatsDTO getAdminDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalFaculty = facultyRepository.count();
        long totalSubjects = subjectRepository.count();
        long totalClasses = classRoomRepository.count();

        long totalAttendanceRecords = attendanceRepository.count();
        long totalPresentRecords = attendanceRepository.findAll().stream()
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                .count();

        double overallAttendancePercentage = 0.0;
        if (totalAttendanceRecords > 0) {
            overallAttendancePercentage = Math.round(((double) totalPresentRecords / totalAttendanceRecords) * 100.0 * 10.0) / 10.0;
        }

        List<StudentDTO> allStudents = studentService.getAllStudents();
        long lowAttendanceCount = allStudents.stream()
                .filter(s -> s.getAttendancePercentage() != null && s.getAttendancePercentage() < 75.0)
                .count();

        // Top 5 students by attendance
        List<StudentDTO> topPerformers = allStudents.stream()
                .filter(s -> s.getAttendancePercentage() != null)
                .sorted((a, b) -> Double.compare(b.getAttendancePercentage(), a.getAttendancePercentage()))
                .limit(5)
                .toList();

        // Subject attendance rates
        Map<String, Double> subjectAttendanceRates = new HashMap<>();
        List<Subject> subjects = subjectRepository.findAll();
        for (Subject sub : subjects) {
            long subTotal = attendanceRepository.findAll().stream()
                    .filter(a -> a.getSubject().getId().equals(sub.getId()))
                    .count();
            long subPresent = attendanceRepository.findAll().stream()
                    .filter(a -> a.getSubject().getId().equals(sub.getId()) && a.getStatus() == AttendanceStatus.PRESENT)
                    .count();
            double rate = subTotal > 0 ? Math.round(((double) subPresent / subTotal) * 100.0 * 10.0) / 10.0 : 0.0;
            subjectAttendanceRates.put(sub.getSubjectName(), rate);
        }

        // Subject average marks
        Map<String, Double> subjectAverageScores = new HashMap<>();
        for (Subject sub : subjects) {
            Double avg = marksRepository.calculateAveragePercentageBySubject(sub.getId());
            subjectAverageScores.put(sub.getSubjectName(), avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        }

        return new DashboardStatsDTO(
                totalStudents,
                totalFaculty,
                totalSubjects,
                totalClasses,
                overallAttendancePercentage,
                lowAttendanceCount,
                topPerformers,
                subjectAttendanceRates,
                subjectAverageScores
        );
    }

    @Override
    public DashboardStatsDTO getFacultyDashboardStats(Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
        int assignedSubjectsCount = faculty != null ? faculty.getSubjects().size() : 0;

        DashboardStatsDTO adminStats = getAdminDashboardStats();
        adminStats.setTotalSubjects(assignedSubjectsCount);
        return adminStats;
    }
}
