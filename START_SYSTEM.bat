@echo off
title Student Attendance System - Master Launcher
cd /d "%~dp0"

echo =======================================================================
echo   Student Attendance and Performance Tracking System - Master Launcher
echo =======================================================================
echo.
echo 1. Launching Backend (Spring Boot :8080)...
start "SAPTS - Backend (:8080)" cmd /k "cd /d "%~dp0backend" && run-backend.bat"

echo 2. Launching Frontend (React Vite :5173)...
start "SAPTS - Frontend (:5173)" cmd /k "cd /d "%~dp0frontend" && run-frontend.bat"

echo.
echo =======================================================================
echo Both Backend and Frontend have been launched!
echo Your web browser will automatically open at: http://localhost:5173
echo =======================================================================
echo.
pause
