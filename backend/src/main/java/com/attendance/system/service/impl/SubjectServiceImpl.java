package com.attendance.system.service.impl;

import com.attendance.system.dto.SubjectDTO;
import com.attendance.system.entity.Faculty;
import com.attendance.system.entity.Subject;
import com.attendance.system.exception.BadRequestException;
import com.attendance.system.exception.ResourceNotFoundException;
import com.attendance.system.repository.SubjectRepository;
import com.attendance.system.service.SubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return mapToDTO(subject);
    }

    @Override
    public SubjectDTO createSubject(SubjectDTO dto) {
        if (subjectRepository.existsBySubjectCode(dto.getSubjectCode())) {
            throw new BadRequestException("Subject code already exists: " + dto.getSubjectCode());
        }

        Subject subject = new Subject(
                dto.getSubjectCode(),
                dto.getSubjectName(),
                dto.getDepartment(),
                dto.getSemester(),
                dto.getCredits() != null ? dto.getCredits() : 4
        );

        Subject saved = subjectRepository.save(subject);
        return mapToDTO(saved);
    }

    @Override
    public SubjectDTO updateSubject(Long id, SubjectDTO dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        if (!subject.getSubjectCode().equalsIgnoreCase(dto.getSubjectCode()) &&
                subjectRepository.existsBySubjectCode(dto.getSubjectCode())) {
            throw new BadRequestException("Subject code already in use: " + dto.getSubjectCode());
        }

        subject.setSubjectCode(dto.getSubjectCode());
        subject.setSubjectName(dto.getSubjectName());
        subject.setDepartment(dto.getDepartment());
        subject.setSemester(dto.getSemester());
        if (dto.getCredits() != null) {
            subject.setCredits(dto.getCredits());
        }

        Subject updated = subjectRepository.save(subject);
        return mapToDTO(updated);
    }

    @Override
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
    }

    @Override
    public List<SubjectDTO> getSubjectsBySemester(Integer semester) {
        return subjectRepository.findBySemester(semester).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubjectDTO> getSubjectsByDepartment(String department) {
        return subjectRepository.findByDepartment(department).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private SubjectDTO mapToDTO(Subject subject) {
        List<String> facultyNames = subject.getFaculties().stream()
                .map(f -> f.getUser().getFullName())
                .collect(Collectors.toList());

        return new SubjectDTO(
                subject.getId(),
                subject.getSubjectCode(),
                subject.getSubjectName(),
                subject.getDepartment(),
                subject.getSemester(),
                subject.getCredits(),
                facultyNames
        );
    }
}
