package com.attendance.system.controller;

import com.attendance.system.dto.FacultyDTO;
import com.attendance.system.service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public ResponseEntity<List<FacultyDTO>> getAllFaculty() {
        return ResponseEntity.ok(facultyService.getAllFaculty());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultyDTO> getFacultyById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<FacultyDTO> getFacultyByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(facultyService.getFacultyByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyDTO> createFaculty(@Valid @RequestBody FacultyDTO facultyDTO) {
        FacultyDTO created = facultyService.createFaculty(facultyDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyDTO> updateFaculty(@PathVariable Long id, @Valid @RequestBody FacultyDTO facultyDTO) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, facultyDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign-subjects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyDTO> assignSubjects(@PathVariable Long id, @RequestBody List<Long> subjectIds) {
        return ResponseEntity.ok(facultyService.assignSubjects(id, subjectIds));
    }
}
