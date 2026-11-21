package com.attendance.system.service.impl;

import com.attendance.system.dto.FacultyDTO;
import com.attendance.system.entity.Faculty;
import com.attendance.system.entity.Role;
import com.attendance.system.entity.Subject;
import com.attendance.system.entity.User;
import com.attendance.system.exception.BadRequestException;
import com.attendance.system.exception.ResourceNotFoundException;
import com.attendance.system.repository.FacultyRepository;
import com.attendance.system.repository.SubjectRepository;
import com.attendance.system.repository.UserRepository;
import com.attendance.system.service.FacultyService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;

    public FacultyServiceImpl(FacultyRepository facultyRepository,
                              UserRepository userRepository,
                              SubjectRepository subjectRepository,
                              PasswordEncoder passwordEncoder) {
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<FacultyDTO> getAllFaculty() {
        return facultyRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FacultyDTO getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        return mapToDTO(faculty);
    }

    @Override
    public FacultyDTO getFacultyByUserId(Long userId) {
        Faculty faculty = facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found for user id: " + userId));
        return mapToDTO(faculty);
    }

    @Override
    public FacultyDTO createFaculty(FacultyDTO dto) {
        if (facultyRepository.existsByEmployeeId(dto.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists: " + dto.getEmployeeId());
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username already taken: " + dto.getUsername());
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already taken: " + dto.getEmail());
        }

        String rawPassword = (dto.getPassword() != null && !dto.getPassword().trim().isEmpty())
                ? dto.getPassword() : "faculty123";

        User user = new User(
                dto.getUsername(),
                dto.getEmail(),
                passwordEncoder.encode(rawPassword),
                dto.getFullName(),
                dto.getPhone(),
                Role.ROLE_FACULTY
        );
        User savedUser = userRepository.save(user);

        Faculty faculty = new Faculty(
                dto.getEmployeeId(),
                savedUser,
                dto.getDepartment(),
                dto.getDesignation(),
                dto.getQualification(),
                dto.getDateOfJoining()
        );

        if (dto.getSubjectIds() != null && !dto.getSubjectIds().isEmpty()) {
            Set<Subject> subjects = new HashSet<>(subjectRepository.findAllById(dto.getSubjectIds()));
            faculty.setSubjects(subjects);
        }

        Faculty savedFaculty = facultyRepository.save(faculty);
        return mapToDTO(savedFaculty);
    }

    @Override
    public FacultyDTO updateFaculty(Long id, FacultyDTO dto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        User user = faculty.getUser();

        if (!faculty.getEmployeeId().equalsIgnoreCase(dto.getEmployeeId()) &&
                facultyRepository.existsByEmployeeId(dto.getEmployeeId())) {
            throw new BadRequestException("Employee ID already in use: " + dto.getEmployeeId());
        }

        if (!user.getEmail().equalsIgnoreCase(dto.getEmail()) &&
                userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already in use: " + dto.getEmail());
        }

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        userRepository.save(user);

        faculty.setEmployeeId(dto.getEmployeeId());
        faculty.setDepartment(dto.getDepartment());
        faculty.setDesignation(dto.getDesignation());
        faculty.setQualification(dto.getQualification());
        faculty.setDateOfJoining(dto.getDateOfJoining());

        if (dto.getSubjectIds() != null) {
            Set<Subject> subjects = new HashSet<>(subjectRepository.findAllById(dto.getSubjectIds()));
            faculty.setSubjects(subjects);
        }

        Faculty updatedFaculty = facultyRepository.save(faculty);
        return mapToDTO(updatedFaculty);
    }

    @Override
    public void deleteFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        faculty.getSubjects().clear();
        facultyRepository.delete(faculty);
        userRepository.delete(faculty.getUser());
    }

    @Override
    public FacultyDTO assignSubjects(Long facultyId, List<Long> subjectIds) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + facultyId));

        Set<Subject> subjects = new HashSet<>(subjectRepository.findAllById(subjectIds));
        faculty.setSubjects(subjects);
        Faculty saved = facultyRepository.save(faculty);
        return mapToDTO(saved);
    }

    private FacultyDTO mapToDTO(Faculty faculty) {
        User user = faculty.getUser();
        List<Long> subjectIds = faculty.getSubjects().stream()
                .map(Subject::getId)
                .collect(Collectors.toList());
        List<String> subjectNames = faculty.getSubjects().stream()
                .map(Subject::getSubjectName)
                .collect(Collectors.toList());

        return new FacultyDTO(
                faculty.getId(),
                faculty.getEmployeeId(),
                user != null ? user.getId() : null,
                user != null ? user.getUsername() : null,
                user != null ? user.getEmail() : null,
                user != null ? user.getFullName() : null,
                user != null ? user.getPhone() : null,
                faculty.getDepartment(),
                faculty.getDesignation(),
                faculty.getQualification(),
                faculty.getDateOfJoining(),
                subjectIds,
                subjectNames
        );
    }
}
