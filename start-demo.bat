@echo off
cd /d "%~dp0"
node --version >nul 2>&1
if errorlevel 1 (
  echo Please install Node.js 24 or newer.
  pause
  exit /b 1
)
node scripts/run-demo.mjs
pause
