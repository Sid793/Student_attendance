package com.attendance.system.service.impl;

import com.attendance.system.dto.ClassRoomDTO;
import com.attendance.system.entity.ClassRoom;
import com.attendance.system.exception.ResourceNotFoundException;
import com.attendance.system.repository.ClassRoomRepository;
import com.attendance.system.repository.StudentRepository;
import com.attendance.system.service.ClassRoomService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClassRoomServiceImpl implements ClassRoomService {

    private final ClassRoomRepository classRoomRepository;
    private final StudentRepository studentRepository;

    public ClassRoomServiceImpl(ClassRoomRepository classRoomRepository, StudentRepository studentRepository) {
        this.classRoomRepository = classRoomRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public List<ClassRoomDTO> getAllClasses() {
        return classRoomRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClassRoomDTO getClassById(Long id) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return mapToDTO(classRoom);
    }

    @Override
    public ClassRoomDTO createClass(ClassRoomDTO dto) {
        ClassRoom classRoom = new ClassRoom(
                dto.getClassName(),
                dto.getDepartment(),
                dto.getSemester(),
                dto.getAcademicYear(),
                dto.getSection()
        );
        ClassRoom saved = classRoomRepository.save(classRoom);
        return mapToDTO(saved);
    }

    @Override
    public ClassRoomDTO updateClass(Long id, ClassRoomDTO dto) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        classRoom.setClassName(dto.getClassName());
        classRoom.setDepartment(dto.getDepartment());
        classRoom.setSemester(dto.getSemester());
        classRoom.setAcademicYear(dto.getAcademicYear());
        classRoom.setSection(dto.getSection());

        ClassRoom updated = classRoomRepository.save(classRoom);
        return mapToDTO(updated);
    }

    @Override
    public void deleteClass(Long id) {
        if (!classRoomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class not found with id: " + id);
        }
        classRoomRepository.deleteById(id);
    }

    private ClassRoomDTO mapToDTO(ClassRoom classRoom) {
        long studentCount = studentRepository.countByClassRoomId(classRoom.getId());
        return new ClassRoomDTO(
                classRoom.getId(),
                classRoom.getClassName(),
                classRoom.getDepartment(),
                classRoom.getSemester(),
                classRoom.getAcademicYear(),
                classRoom.getSection(),
                studentCount
        );
    }
}
