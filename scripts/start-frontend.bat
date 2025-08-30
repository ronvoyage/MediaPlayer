@echo off
start "MediaPlayer Frontend" powershell -ExecutionPolicy Bypass -NoExit -Command "cd '%~dp0..\frontend'; $env:PORT='3200'; Write-Host 'Frontend starting on port 3200...'; npm run start"