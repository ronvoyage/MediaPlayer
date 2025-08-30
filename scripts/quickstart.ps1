# MediaPlayer Quick Start Script
# Author: Ron Lederer
# This script checks prerequisites and starts the MediaPlayer application on Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MediaPlayer Quick Start Script" -ForegroundColor Cyan
Write-Host "Author: Ron Lederer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set ports
$FRONTEND_PORT = 3200
$BACKEND_PORT = 3201

Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check for npm
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install npm (usually comes with Node.js)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path (Split-Path -Parent $scriptDir) "backend"
$frontendPath = Join-Path (Split-Path -Parent $scriptDir) "frontend"

# Check if directories exist
if (-not (Test-Path $backendPath)) {
    Write-Host "[ERROR] Backend directory not found: $backendPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "[ERROR] Frontend directory not found: $frontendPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Build backend
Write-Host "Building backend..." -ForegroundColor Yellow
Set-Location $backendPath

if (Test-Path "package.json") {
    Write-Host "[INFO] Building backend..." -ForegroundColor Cyan
    try {
        npm run build
        Write-Host "[OK] Backend built successfully." -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Backend build failed." -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "[ERROR] Backend package.json not found." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting MediaPlayer Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:$FRONTEND_PORT" -ForegroundColor Green
Write-Host "Backend URL: http://localhost:$BACKEND_PORT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in new PowerShell window
Write-Host "[INFO] Starting backend server on port $BACKEND_PORT..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "Set-Location '$backendPath'; `$env:PORT='$BACKEND_PORT'; `$env:NODE_ENV='development'; Write-Host 'Backend starting on port $BACKEND_PORT...' -ForegroundColor Green; npm run start"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window
Write-Host "[INFO] Starting frontend server on port $FRONTEND_PORT..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", "Set-Location '$frontendPath'; `$env:PORT='$FRONTEND_PORT'; Write-Host 'Frontend starting on port $FRONTEND_PORT...' -ForegroundColor Green; npm run start"

Write-Host ""
Write-Host "[INFO] Both servers are starting up..." -ForegroundColor Cyan
Write-Host "[INFO] Frontend will be available at: http://localhost:$FRONTEND_PORT" -ForegroundColor Green
Write-Host "[INFO] Backend will be available at: http://localhost:$BACKEND_PORT" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Two new PowerShell windows have opened for the servers." -ForegroundColor Cyan
Write-Host "[INFO] The servers will continue running in those windows." -ForegroundColor Cyan
Write-Host "[INFO] You can close this window once the servers are running." -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] To stop the servers, close the individual PowerShell windows." -ForegroundColor Cyan
Write-Host ""

# Wait for user to close
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application Control" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close this window (servers will continue running)"

exit 0