@echo off
title AquaGuard AI - Full Stack Launcher
echo ========================================================
echo   Starting AquaGuard AI (Backend + Frontend)
echo ========================================================
echo.

echo [1/3] Starting Python FastAPI Backend on http://localhost:8000 ...
start "AquaGuard Backend (FastAPI)" cmd /k "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting React Frontend on http://localhost:3000 ...
cd frontend
start "AquaGuard Frontend (Vite)" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak >nul
echo [3/3] Opening AquaGuard AI in your browser...
start http://localhost:3000

echo.
echo ========================================================
echo   AquaGuard AI is running!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo ========================================================
pause

