package com.attendance.system.service.impl;

import com.attendance.system.config.JwtTokenProvider;
import com.attendance.system.dto.AuthRequest;
import com.attendance.system.dto.AuthResponse;
import com.attendance.system.dto.PasswordChangeDTO;
import com.attendance.system.dto.UserDTO;
import com.attendance.system.entity.Faculty;
import com.attendance.system.entity.Role;
import com.attendance.system.entity.Student;
import com.attendance.system.entity.User;
import com.attendance.system.exception.BadRequestException;
import com.attendance.system.exception.ResourceNotFoundException;
import com.attendance.system.repository.FacultyRepository;
import com.attendance.system.repository.StudentRepository;
import com.attendance.system.repository.UserRepository;
import com.attendance.system.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           StudentRepository studentRepository,
                           FacultyRepository facultyRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + request.getUsername()));

        Long profileId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            profileId = studentRepository.findByUserId(user.getId())
                    .map(Student::getId)
                    .orElse(null);
        } else if (user.getRole() == Role.ROLE_FACULTY) {
            profileId = facultyRepository.findByUserId(user.getId())
                    .map(Faculty::getId)
                    .orElse(null);
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                profileId
        );
    }

    @Override
    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getActive(),
                user.getCreatedAt()
        );
    }

    @Override
    public void changePassword(String username, PasswordChangeDTO request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is not correct");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
