package com.attendance.system.service.impl;

import com.attendance.system.dto.*;
import com.attendance.system.entity.*;
import com.attendance.system.exception.BadRequestException;
import com.attendance.system.exception.ResourceNotFoundException;
import com.attendance.system.repository.*;
import com.attendance.system.service.MarksService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class MarksServiceImpl implements MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRoomRepository classRoomRepository;
    private final FacultyRepository facultyRepository;

    public MarksServiceImpl(MarksRepository marksRepository,
                            StudentRepository studentRepository,
                            SubjectRepository subjectRepository,
                            ClassRoomRepository classRoomRepository,
                            FacultyRepository facultyRepository) {
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.classRoomRepository = classRoomRepository;
        this.facultyRepository = facultyRepository;
    }

    @Override
    public List<MarksDTO> saveBatchMarks(MarksBatchRequest request) {
        ClassRoom classRoom = classRoomRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        Faculty faculty = null;
        if (request.getFacultyId() != null) {
            faculty = facultyRepository.findById(request.getFacultyId()).orElse(null);
        }

        List<Marks> savedMarks = new ArrayList<>();

        for (StudentMarksRecord rec : request.getRecords()) {
            Student student = studentRepository.findById(rec.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + rec.getStudentId()));

            if (rec.getMarksObtained() > request.getMaxMarks()) {
                throw new BadRequestException("Marks obtained cannot exceed maximum marks (" + request.getMaxMarks() + ") for student: " + student.getRollNumber());
            }

            Optional<Marks> existing = marksRepository.findByStudentIdAndSubjectIdAndAssessmentType(
                    student.getId(), subject.getId(), request.getAssessmentType()
            );

            Marks marks;
            if (existing.isPresent()) {
                marks = existing.get();
                marks.setMaxMarks(request.getMaxMarks());
                marks.setMarksObtained(rec.getMarksObtained());
                marks.setAssessmentDate(request.getAssessmentDate());
                marks.setRemarks(rec.getRemarks());
                if (faculty != null) {
                    marks.setFaculty(faculty);
                }
            } else {
                marks = new Marks(
                        student,
                        subject,
                        classRoom,
                        faculty,
                        request.getAssessmentType(),
                        request.getMaxMarks(),
                        rec.getMarksObtained(),
                        request.getAssessmentDate(),
                        rec.getRemarks()
                );
            }

            savedMarks.add(marksRepository.save(marks));
        }

        return savedMarks.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<MarksDTO> getMarksByClassSubjectAndAssessment(Long classId, Long subjectId, AssessmentType assessmentType) {
        return marksRepository.findByClassRoomIdAndSubjectIdAndAssessmentType(classId, subjectId, assessmentType)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MarksDTO> getMarksByStudentId(Long studentId) {
        return marksRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentPerformanceDTO getStudentPerformanceReport(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        List<Marks> allMarks = marksRepository.findByStudentId(studentId);

        double totalMarksObtained = 0.0;
        double totalMaxMarks = 0.0;

        // Group by subject
        Map<Subject, List<Marks>> subjectMarksMap = allMarks.stream()
                .collect(Collectors.groupingBy(Marks::getSubject));

        List<SubjectPerformanceDTO> subjectPerformances = new ArrayList<>();

        for (Map.Entry<Subject, List<Marks>> entry : subjectMarksMap.entrySet()) {
            Subject sub = entry.getKey();
            List<Marks> marksList = entry.getValue();

            double subObtained = marksList.stream().mapToDouble(Marks::getMarksObtained).sum();
            double subMax = marksList.stream().mapToDouble(Marks::getMaxMarks).sum();
            double subPercentage = subMax > 0 ? (subObtained / subMax) * 100.0 : 0.0;
            subPercentage = Math.round(subPercentage * 10.0) / 10.0;

            totalMarksObtained += subObtained;
            totalMaxMarks += subMax;

            List<MarksDTO> dtoList = marksList.stream().map(this::mapToDTO).collect(Collectors.toList());

            subjectPerformances.add(new SubjectPerformanceDTO(
                    sub.getId(),
                    sub.getSubjectCode(),
                    sub.getSubjectName(),
                    subObtained,
                    subMax,
                    subPercentage,
                    MarksDTO.calculateGrade(subPercentage),
                    dtoList
            ));
        }

        double averagePercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100.0 : 0.0;
        averagePercentage = Math.round(averagePercentage * 10.0) / 10.0;

        return new StudentPerformanceDTO(
                student.getId(),
                student.getRollNumber(),
                student.getUser() != null ? student.getUser().getFullName() : "N/A",
                student.getClassRoom() != null ? student.getClassRoom().getClassName() : "N/A",
                allMarks.size(),
                totalMarksObtained,
                totalMaxMarks,
                averagePercentage,
                MarksDTO.calculateGrade(averagePercentage),
                subjectPerformances
        );
    }

    @Override
    public List<MarksDTO> getClassMarksReport(Long classId, Long subjectId) {
        List<Marks> list;
        if (classId != null && subjectId != null) {
            list = marksRepository.findByClassRoomIdAndSubjectId(classId, subjectId);
        } else if (classId != null) {
            list = marksRepository.findByClassRoomId(classId);
        } else {
            list = marksRepository.findAll();
        }
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private MarksDTO mapToDTO(Marks m) {
        double percentage = (m.getMaxMarks() != null && m.getMaxMarks() > 0)
                ? Math.round(((m.getMarksObtained() / m.getMaxMarks()) * 100.0) * 10.0) / 10.0
                : 0.0;

        return new MarksDTO(
                m.getId(),
                m.getStudent() != null ? m.getStudent().getId() : null,
                m.getStudent() != null ? m.getStudent().getRollNumber() : null,
                (m.getStudent() != null && m.getStudent().getUser() != null) ? m.getStudent().getUser().getFullName() : null,
                m.getSubject() != null ? m.getSubject().getId() : null,
                m.getSubject() != null ? m.getSubject().getSubjectCode() : null,
                m.getSubject() != null ? m.getSubject().getSubjectName() : null,
                m.getClassRoom() != null ? m.getClassRoom().getId() : null,
                m.getClassRoom() != null ? m.getClassRoom().getClassName() : null,
                m.getFaculty() != null ? m.getFaculty().getId() : null,
                (m.getFaculty() != null && m.getFaculty().getUser() != null) ? m.getFaculty().getUser().getFullName() : null,
                m.getAssessmentType(),
                m.getMaxMarks(),
                m.getMarksObtained(),
                percentage,
                MarksDTO.calculateGrade(percentage),
                m.getAssessmentDate(),
                m.getRemarks(),
                m.getRecordedAt()
        );
    }
}
