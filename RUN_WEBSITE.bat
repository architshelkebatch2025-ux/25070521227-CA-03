@echo off
title Smart Library Management System Launcher
color 0b
echo ===============================================================
echo        SMART LIBRARY MANAGEMENT SYSTEM - CA-03 LAUNCHER
echo ===============================================================
echo.

:: Add Node.js to PATH
set "PATH=C:\Users\HP\nodejs\node-v20.18.0-win-x64;%PATH%"

echo [1/2] Starting Express Backend Server (Port 5000)...
start "Smart Library - Backend (Port 5000)" cmd /k "title Backend Server [Port 5000] && cd /d ""%~dp0server"" && node server.js"

:: Wait 3 seconds for MongoDB and Express to initialize
echo Waiting for backend and MongoDB to initialize...
timeout /t 3 /nobreak > nul

echo [2/2] Starting React Vite Frontend (Port 5173)...
start "Smart Library - Frontend (Port 5173)" cmd /k "title Frontend Client [Port 5173] && cd /d ""%~dp0client"" && npm run dev"

:: Wait 2 seconds for Vite dev server
timeout /t 2 /nobreak > nul

echo.
echo ===============================================================
echo   Opening website in your browser: http://localhost:5173
echo ===============================================================
start http://localhost:5173

echo.
echo Keep both black terminal windows OPEN while using the website!
echo (To stop the website later, simply close those two windows).
echo.
pause
