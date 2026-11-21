package com.attendance.system.controller;

import com.attendance.system.dto.ClassRoomDTO;
import com.attendance.system.service.ClassRoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassRoomController {

    private final ClassRoomService classRoomService;

    public ClassRoomController(ClassRoomService classRoomService) {
        this.classRoomService = classRoomService;
    }

    @GetMapping
    public ResponseEntity<List<ClassRoomDTO>> getAllClasses() {
        return ResponseEntity.ok(classRoomService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassRoomDTO> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classRoomService.getClassById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassRoomDTO> createClass(@Valid @RequestBody ClassRoomDTO classRoomDTO) {
        ClassRoomDTO created = classRoomService.createClass(classRoomDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassRoomDTO> updateClass(@PathVariable Long id, @Valid @RequestBody ClassRoomDTO classRoomDTO) {
        return ResponseEntity.ok(classRoomService.updateClass(id, classRoomDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classRoomService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
