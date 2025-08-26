@echo off
REM MediaPlayer Quick Start Script
REM Author: Ron Lederer
REM This script checks prerequisites and starts the MediaPlayer application on Windows

echo ========================================
echo MediaPlayer Quick Start Script
echo Author: Ron Lederer
echo ========================================
echo.

REM Set ports
set FRONTEND_PORT=3200
set BACKEND_PORT=3201

echo Checking prerequisites...
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH.
    echo Please install npm (usually comes with Node.js)
    echo.
    pause
    exit /b 1
)

REM Check npm version
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm found: v%NPM_VERSION%
echo.

REM Check if frontend directory exists
if not exist "%~dp0..\frontend" (
    echo [ERROR] Frontend directory not found.
    echo Please ensure you're running this script from the correct location.
    echo Expected path: %~dp0..\frontend
    echo.
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "%~dp0..\backend" (
    echo [ERROR] Backend directory not found.
    echo Please ensure you're running this script from the correct location.
    echo Expected path: %~dp0..\backend
    echo.
    pause
    exit /b 1
)

echo Installing dependencies...
echo.

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd /d "%~dp0..\frontend"
if not exist "package.json" (
    echo [WARNING] package.json not found in frontend directory.
    echo Skipping frontend dependency installation.
) else (
    npm install --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo [ERROR] Frontend dependency installation failed.
        echo Please check the error messages above.
        echo.
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed successfully.
)

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd /d "%~dp0..\backend"
if not exist "package.json" (
    echo [WARNING] package.json not found in backend directory.
    echo Skipping backend dependency installation.
) else (
    npm install --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo [ERROR] Backend dependency installation failed.
        echo Please check the error messages above.
        echo.
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed successfully.
)

echo.
echo ========================================
echo Starting MediaPlayer Application
echo ========================================
echo Frontend URL: http://localhost:%FRONTEND_PORT%
echo Backend URL: http://localhost:%BACKEND_PORT%
echo ========================================
echo.

REM Check if ports are available
netstat -an | find ":%FRONTEND_PORT%" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port %FRONTEND_PORT% is already in use.
    echo The frontend might not start properly.
    echo.
)

netstat -an | find ":%BACKEND_PORT%" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port %BACKEND_PORT% is already in use.
    echo The backend might not start properly.
    echo.
)

REM Start backend
echo [INFO] Starting backend server on port %BACKEND_PORT%...
cd /d "%~dp0..\backend"
if exist "package.json" (
    start "MediaPlayer Backend" cmd /c "echo Backend starting on port %BACKEND_PORT%... && set PORT=%BACKEND_PORT% && npm run start && pause"
    timeout /t 3 /nobreak >nul
) else (
    echo [WARNING] Backend package.json not found. Backend not started.
)

REM Start frontend
echo [INFO] Starting frontend server on port %FRONTEND_PORT%...
cd /d "%~dp0..\frontend"
if exist "package.json" (
    start "MediaPlayer Frontend" cmd /c "echo Frontend starting on port %FRONTEND_PORT%... && set PORT=%FRONTEND_PORT% && npm run start && pause"
    timeout /t 3 /nobreak >nul
) else (
    echo [WARNING] Frontend package.json not found. Frontend not started.
)

echo.
echo [INFO] Servers are starting up...
echo [INFO] Frontend will be available at: http://localhost:%FRONTEND_PORT%
echo [INFO] Backend will be available at: http://localhost:%BACKEND_PORT%
echo.
echo Please wait a moment for the servers to fully start.
echo Your default browser should open automatically.
echo.

REM Wait for user to close
echo ========================================
echo Application Control
echo ========================================
echo.
:wait
set /p input=Type 'EXIT' and press Enter to stop all MediaPlayer services: 
if /i "%input%"=="EXIT" goto :close
if /i "%input%"=="QUIT" goto :close
if /i "%input%"=="STOP" goto :close
echo Invalid command. Type 'EXIT' to stop the application.
goto :wait

:close
echo.
echo [INFO] Stopping MediaPlayer services...

REM Kill the started processes more reliably
tasklist /FI "WINDOWTITLE eq MediaPlayer Backend*" /FO CSV | find /I "cmd.exe" >nul
if %errorlevel% equ 0 (
    echo [INFO] Stopping backend server...
    for /f "skip=1 tokens=2 delims=," %%a in ('tasklist /FI "WINDOWTITLE eq MediaPlayer Backend*" /FO CSV') do (
        set PID=%%a
        set PID=!PID:"=!
        taskkill /PID !PID! /F >nul 2>nul
    )
)

tasklist /FI "WINDOWTITLE eq MediaPlayer Frontend*" /FO CSV | find /I "cmd.exe" >nul
if %errorlevel% equ 0 (
    echo [INFO] Stopping frontend server...
    for /f "skip=1 tokens=2 delims=," %%a in ('tasklist /FI "WINDOWTITLE eq MediaPlayer Frontend*" /FO CSV') do (
        set PID=%%a
        set PID=!PID:"=!
        taskkill /PID !PID! /F >nul 2>nul
    )
)

REM Kill any remaining node processes on our ports
for /f "tokens=5" %%a in ('netstat -ano ^| find ":%FRONTEND_PORT%"') do (
    taskkill /PID %%a /F >nul 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| find ":%BACKEND_PORT%"') do (
    taskkill /PID %%a /F >nul 2>nul
)

echo [INFO] MediaPlayer application stopped successfully.
echo.
echo Thank you for using MediaPlayer!
echo.
pause
exit /b 0
