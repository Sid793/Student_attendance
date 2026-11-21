@echo off
title Student Attendance System - Backend Server (Port 8080)
cd /d "%~dp0"

echo =======================================================================
echo   Student Attendance and Performance Tracking System - Backend Server
echo =======================================================================
echo.

REM Automatically detect and set Java JDK 17
if not defined JAVA_HOME (
    if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    )
)
if defined JAVA_HOME (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

where java >nul 2>nul
if errorlevel 1 (
    if exist "C:\Program Files\Java\jdk-17\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
        set "PATH=C:\Program Files\Java\jdk-17\bin;%PATH%"
    ) else (
        echo [ERROR] Java JDK 17 is not found. Please install Java JDK 17.
        pause
        exit /b 1
    )
)

REM Check if Port 8080 is already in use by another instance
netstat -ano | findstr ":8080 " >nul 2>nul
if not errorlevel 1 (
    echo =======================================================================
    echo [NOTICE] Port 8080 is ALREADY in use by a running Spring Boot process!
    echo The backend server is ALREADY LIVE and running in the background.
    echo =======================================================================
    echo.
    echo Press [K] to terminate the existing process and restart fresh.
    echo Press [ENTER] to leave the current backend running and exit this window.
    set /p USER_CHOICE="Your choice (K / Enter): "
    if /i "!USER_CHOICE!"=="K" (
        echo Stopping old process on port 8080...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 "') do (
            taskkill /F /PID %%a >nul 2>nul
        )
        timeout /t 2 >nul
        echo Port 8080 cleared. Restarting now...
    ) else (
        echo Keeping existing backend running. You can open your frontend now!
        timeout /t 4 >nul
        exit /b 0
    )
)

echo Starting Spring Boot application on http://localhost:8080 ...
echo.

call mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo =======================================================================
    echo [ERROR] Spring Boot stopped.
    echo If port 8080 was busy, please close other command prompt windows.
    echo =======================================================================
    pause
)
