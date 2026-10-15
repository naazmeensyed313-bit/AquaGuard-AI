# AquaGuard AI - PowerShell One-Click Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Starting AquaGuard AI (Backend + Frontend)           " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Launching Python FastAPI Backend (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "[2/3] Launching React Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "[3/3] Opening browser at http://localhost:3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "AquaGuard AI is running!" -ForegroundColor Cyan
Write-Host "Frontend : http://localhost:3000"
Write-Host "Backend  : http://localhost:8000"
Write-Host "API Docs : http://localhost:8000/docs"

