# Script de PowerShell para detener el proyecto en Windows

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🛑 Deteniendo LocalStack Lambda Project" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Detener Docker Compose
Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose down

Write-Host ""
Write-Host "✅ Proyecto detenido correctamente" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar nuevamente, ejecuta:" -ForegroundColor Cyan
Write-Host "  .\start.ps1" -ForegroundColor White
Write-Host "  o"
Write-Host "  bash start.sh" -ForegroundColor White
Write-Host ""

