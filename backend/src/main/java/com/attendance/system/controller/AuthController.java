package com.attendance.system.controller;

import com.attendance.system.dto.AuthRequest;
import com.attendance.system.dto.AuthResponse;
import com.attendance.system.dto.PasswordChangeDTO;
import com.attendance.system.dto.UserDTO;
import com.attendance.system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserDTO userDTO = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody PasswordChangeDTO request) {
        authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok().body("Password changed successfully");
    }
}
