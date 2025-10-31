# Script para reiniciar microservicios en Windows

Write-Host "🔄 Reiniciando microservicios..." -ForegroundColor Yellow

# Detener servicios si están ejecutándose
Write-Host "⏹️ Deteniendo servicios..." -ForegroundColor Red
Get-Process | Where-Object {$_.ProcessName -like "*node*" -and $_.CommandLine -like "*user-service*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process | Where-Object {$_.ProcessName -like "*node*" -and $_.CommandLine -like "*create-user-service*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process | Where-Object {$_.ProcessName -like "*node*" -and $_.CommandLine -like "*logging-service*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Esperar un poco
Start-Sleep -Seconds 2

# Compilar el proyecto
Write-Host "🔨 Compilando proyecto..." -ForegroundColor Blue
npm run build

# Iniciar servicios en background
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Green

# User Service
Write-Host "  - Iniciando User Service (puerto 3001)..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "start:user-service" -WindowStyle Hidden
Start-Sleep -Seconds 2

# Create User Service  
Write-Host "  - Iniciando Create User Service (puerto 3002)..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "start:create-user-service" -WindowStyle Hidden
Start-Sleep -Seconds 2

# Logging Service
Write-Host "  - Iniciando Logging Service (puerto 3003)..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "start:logging-service" -WindowStyle Hidden
Start-Sleep -Seconds 2

Write-Host "✅ Servicios iniciados" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Servicios disponibles:" -ForegroundColor Yellow
Write-Host "  - User Service: http://localhost:3001" -ForegroundColor White
Write-Host "  - Create User Service: http://localhost:3002" -ForegroundColor White
Write-Host "  - Logging Service: http://localhost:3003" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Para verificar que funcionan:" -ForegroundColor Yellow
Write-Host "  Invoke-WebRequest -Uri http://localhost:3003/logs/stats -Method GET" -ForegroundColor White
