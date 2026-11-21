package com.attendance.system.service;

import com.attendance.system.dto.AuthRequest;
import com.attendance.system.dto.AuthResponse;
import com.attendance.system.dto.PasswordChangeDTO;
import com.attendance.system.dto.UserDTO;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    UserDTO getCurrentUser(String username);
    void changePassword(String username, PasswordChangeDTO request);
}
