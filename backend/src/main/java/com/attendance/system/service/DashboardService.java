package com.attendance.system.service;

import com.attendance.system.dto.DashboardStatsDTO;

public interface DashboardService {
    DashboardStatsDTO getAdminDashboardStats();
    DashboardStatsDTO getFacultyDashboardStats(Long facultyId);
}
