package com.attendance.system.controller;

import com.attendance.system.dto.MarksBatchRequest;
import com.attendance.system.dto.MarksDTO;
import com.attendance.system.dto.StudentPerformanceDTO;
import com.attendance.system.entity.AssessmentType;
import com.attendance.system.service.MarksService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping("/batch")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<MarksDTO>> saveBatchMarks(@Valid @RequestBody MarksBatchRequest request) {
        return ResponseEntity.ok(marksService.saveBatchMarks(request));
    }

    @GetMapping("/class/{classId}/subject/{subjectId}")
    public ResponseEntity<List<MarksDTO>> getMarksByAssessment(
            @PathVariable Long classId,
            @PathVariable Long subjectId,
            @RequestParam AssessmentType assessmentType) {
        return ResponseEntity.ok(marksService.getMarksByClassSubjectAndAssessment(classId, subjectId, assessmentType));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MarksDTO>> getMarksByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getMarksByStudentId(studentId));
    }

    @GetMapping("/student/{studentId}/performance")
    public ResponseEntity<StudentPerformanceDTO> getStudentPerformance(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getStudentPerformanceReport(studentId));
    }

    @GetMapping("/report")
    public ResponseEntity<List<MarksDTO>> getMarksReport(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long subjectId) {
        return ResponseEntity.ok(marksService.getClassMarksReport(classId, subjectId));
    }
}
