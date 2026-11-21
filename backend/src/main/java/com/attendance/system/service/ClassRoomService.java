package com.attendance.system.service;

import com.attendance.system.dto.ClassRoomDTO;
import java.util.List;

public interface ClassRoomService {
    List<ClassRoomDTO> getAllClasses();
    ClassRoomDTO getClassById(Long id);
    ClassRoomDTO createClass(ClassRoomDTO classRoomDTO);
    ClassRoomDTO updateClass(Long id, ClassRoomDTO classRoomDTO);
    void deleteClass(Long id);
}
