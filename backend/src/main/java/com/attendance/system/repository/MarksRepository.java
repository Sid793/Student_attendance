package com.attendance.system.repository;

import com.attendance.system.entity.AssessmentType;
import com.attendance.system.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentId(Long studentId);

    List<Marks> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    Optional<Marks> findByStudentIdAndSubjectIdAndAssessmentType(Long studentId, Long subjectId, AssessmentType assessmentType);

    List<Marks> findByClassRoomIdAndSubjectIdAndAssessmentType(Long classId, Long subjectId, AssessmentType assessmentType);

    List<Marks> findByClassRoomIdAndSubjectId(Long classId, Long subjectId);

    List<Marks> findByClassRoomId(Long classId);

    @Query("SELECT AVG((m.marksObtained / m.maxMarks) * 100) FROM Marks m WHERE m.subject.id = :subjectId")
    Double calculateAveragePercentageBySubject(@Param("subjectId") Long subjectId);

    @Query("SELECT AVG((m.marksObtained / m.maxMarks) * 100) FROM Marks m WHERE m.classRoom.id = :classId")
    Double calculateAveragePercentageByClass(@Param("classId") Long classId);
}
