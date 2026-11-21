@echo off
setlocal EnableDelayedExpansion
title Student Attendance System - React Frontend (Port 5173)
cd /d "%~dp0"

echo =======================================================================
echo   Student Attendance and Performance Tracking System - React Frontend
echo =======================================================================
echo.

REM Automatically ensure Node.js and npm are in PATH
where node.exe >nul 2>nul
if errorlevel 1 (
    if exist "C:\student-attendance-frontend\node.exe" (
        set "PATH=C:\student-attendance-frontend;%PATH%"
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
    )
)

set "NPM_CMD=npm.cmd"
where npm.cmd >nul 2>nul
if errorlevel 1 (
    if exist "C:\student-attendance-frontend\npm.cmd" (
        set "NPM_CMD=C:\student-attendance-frontend\npm.cmd"
    ) else if exist "C:\Program Files\nodejs\npm.cmd" (
        set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
    )
)

echo Using package manager: %NPM_CMD%

REM Check if Port 5173 is already in use
netstat -ano | findstr ":5173 " >nul 2>nul
if not errorlevel 1 (
    echo.
    echo =======================================================================
    echo [NOTICE] Port 5173 is ALREADY running and active!
    echo Your React Frontend is ALREADY LIVE at http://localhost:5173
    echo =======================================================================
    echo.
    echo Press [K] to terminate the existing process and restart fresh.
    echo Press [ENTER] to open http://localhost:5173 in browser and keep it running.
    set "USER_CHOICE="
    set /p USER_CHOICE="Your choice (K / Enter): "
    if /i "!USER_CHOICE!"=="K" (
        echo Stopping old process on port 5173...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do (
            taskkill /F /PID %%a >nul 2>nul
        )
        timeout /t 2 >nul
        echo Port 5173 cleared. Restarting now...
    ) else (
        start http://localhost:5173
        echo Browser opened at http://localhost:5173. Have a great day!
        timeout /t 3 >nul
        exit /b 0
    )
)

if not exist "node_modules\" (
    echo Installing node dependencies (one-time setup, please wait)...
    call "%NPM_CMD%" install
)

echo.
echo Starting React Vite development server on http://localhost:5173 ...
echo (Your browser will automatically open in a few seconds!)
echo.

REM Automatically open browser after 3 seconds in background
start "" cmd /c "timeout /t 3 >nul && start http://localhost:5173"

call "%NPM_CMD%" run dev -- --host 0.0.0.0

if errorlevel 1 (
    echo.
    echo =======================================================================
    echo [ERROR] Vite server stopped unexpectedly.
    echo =======================================================================
    pause
)
