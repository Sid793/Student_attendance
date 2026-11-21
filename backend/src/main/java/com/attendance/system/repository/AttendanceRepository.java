package com.attendance.system.repository;

import com.attendance.system.entity.Attendance;
import com.attendance.system.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByStudentIdOrderByAttendanceDateDesc(Long studentId);

    List<Attendance> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    List<Attendance> findByClassRoomIdAndSubjectIdAndAttendanceDate(Long classId, Long subjectId, LocalDate attendanceDate);

    Optional<Attendance> findByStudentIdAndSubjectIdAndAttendanceDate(Long studentId, Long subjectId, LocalDate attendanceDate);

    List<Attendance> findByClassRoomIdAndAttendanceDate(Long classId, LocalDate attendanceDate);

    List<Attendance> findByClassRoomIdAndSubjectId(Long classId, Long subjectId);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    long countByStudentIdAndSubjectId(Long studentId, Long subjectId);

    long countByStudentIdAndSubjectIdAndStatus(Long studentId, Long subjectId, AttendanceStatus status);

    @Query("SELECT COUNT(DISTINCT a.attendanceDate) FROM Attendance a WHERE a.classRoom.id = :classId AND a.subject.id = :subjectId")
    long countConductedClassesByClassAndSubject(@Param("classId") Long classId, @Param("subjectId") Long subjectId);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate BETWEEN :startDate AND :endDate")
    List<Attendance> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM Attendance a WHERE a.classRoom.id = :classId AND a.subject.id = :subjectId AND a.attendanceDate BETWEEN :startDate AND :endDate")
    List<Attendance> findByClassSubjectAndDateRange(@Param("classId") Long classId, @Param("subjectId") Long subjectId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
