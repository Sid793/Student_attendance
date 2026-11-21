package com.attendance.system.service.impl;

import com.attendance.system.dto.StudentDTO;
import com.attendance.system.entity.AttendanceStatus;
import com.attendance.system.entity.ClassRoom;
import com.attendance.system.entity.Role;
import com.attendance.system.entity.Student;
import com.attendance.system.entity.User;
import com.attendance.system.exception.BadRequestException;
import com.attendance.system.exception.ResourceNotFoundException;
import com.attendance.system.repository.AttendanceRepository;
import com.attendance.system.repository.ClassRoomRepository;
import com.attendance.system.repository.StudentRepository;
import com.attendance.system.repository.UserRepository;
import com.attendance.system.service.StudentService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ClassRoomRepository classRoomRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentServiceImpl(StudentRepository studentRepository,
                              UserRepository userRepository,
                              ClassRoomRepository classRoomRepository,
                              AttendanceRepository attendanceRepository,
                              PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.classRoomRepository = classRoomRepository;
        this.attendanceRepository = attendanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToDTO(student);
    }

    @Override
    public StudentDTO getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user id: " + userId));
        return mapToDTO(student);
    }

    @Override
    public List<StudentDTO> getStudentsByClassId(Long classId) {
        return studentRepository.findByClassRoomId(classId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new BadRequestException("Roll number already exists: " + dto.getRollNumber());
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username already taken: " + dto.getUsername());
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already taken: " + dto.getEmail());
        }

        ClassRoom classRoom = null;
        if (dto.getClassId() != null) {
            classRoom = classRoomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + dto.getClassId()));
        }

        String rawPassword = (dto.getPassword() != null && !dto.getPassword().trim().isEmpty())
                ? dto.getPassword() : "student123";

        User user = new User(
                dto.getUsername(),
                dto.getEmail(),
                passwordEncoder.encode(rawPassword),
                dto.getFullName(),
                dto.getPhone(),
                Role.ROLE_STUDENT
        );
        User savedUser = userRepository.save(user);

        Student student = new Student(
                dto.getRollNumber(),
                dto.getRegistrationNumber(),
                savedUser,
                classRoom,
                dto.getDateOfBirth(),
                dto.getGender(),
                dto.getAddress(),
                dto.getGuardianName(),
                dto.getGuardianPhone()
        );

        Student savedStudent = studentRepository.save(student);
        return mapToDTO(savedStudent);
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = student.getUser();

        if (!student.getRollNumber().equalsIgnoreCase(dto.getRollNumber()) &&
                studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new BadRequestException("Roll number already in use: " + dto.getRollNumber());
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

        student.setRollNumber(dto.getRollNumber());
        student.setRegistrationNumber(dto.getRegistrationNumber());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setGender(dto.getGender());
        student.setAddress(dto.getAddress());
        student.setGuardianName(dto.getGuardianName());
        student.setGuardianPhone(dto.getGuardianPhone());

        if (dto.getClassId() != null) {
            ClassRoom classRoom = classRoomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + dto.getClassId()));
            student.setClassRoom(classRoom);
        }

        Student updated = studentRepository.save(student);
        return mapToDTO(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        studentRepository.delete(student);
        userRepository.delete(student.getUser());
    }

    @Override
    public Double calculateOverallAttendance(Long studentId) {
        long totalClasses = attendanceRepository.countByStudentId(studentId);
        if (totalClasses == 0) {
            return 0.0;
        }
        long presentClasses = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        return Math.round(((double) presentClasses / totalClasses) * 100.0 * 10.0) / 10.0;
    }

    private StudentDTO mapToDTO(Student student) {
        User user = student.getUser();
        ClassRoom classRoom = student.getClassRoom();
        Double attendancePercentage = calculateOverallAttendance(student.getId());

        return new StudentDTO(
                student.getId(),
                student.getRollNumber(),
                student.getRegistrationNumber(),
                user != null ? user.getId() : null,
                user != null ? user.getUsername() : null,
                user != null ? user.getEmail() : null,
                user != null ? user.getFullName() : null,
                user != null ? user.getPhone() : null,
                classRoom != null ? classRoom.getId() : null,
                classRoom != null ? classRoom.getClassName() : null,
                classRoom != null ? classRoom.getDepartment() : null,
                classRoom != null ? classRoom.getSemester() : null,
                student.getDateOfBirth(),
                student.getGender(),
                student.getAddress(),
                student.getGuardianName(),
                student.getGuardianPhone(),
                attendancePercentage
        );
    }
}
