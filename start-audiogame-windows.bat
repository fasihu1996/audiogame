@echo off
title Audio Game - Development Server
color 0A
echo.
echo ========================================
echo    Starting Audio Game Development Server
echo ========================================
echo.

REM Change to the project directory
cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Display Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Start the development server
echo Starting development server...
echo.
echo The application will open in your browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Use PowerShell to open browser after delay (runs in background)
powershell -WindowStyle Hidden -Command "Start-Sleep 3; Start-Process 'http://localhost:3000'" >nul 2>&1 &

REM Start the development server
npm run dev

REM Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start the development server!
    pause
)
