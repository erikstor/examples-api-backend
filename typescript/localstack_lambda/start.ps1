# Script de PowerShell para iniciar el proyecto en Windows

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🚀 Iniciando LocalStack Lambda Project" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Verificar Docker
Write-Host "`n1. Verificando Docker..." -ForegroundColor Blue
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker está disponible: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker no está instalado o no está en el PATH" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar Docker Compose
Write-Host "`n2. Verificando Docker Compose..." -ForegroundColor Blue
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose está disponible: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker Compose no está instalado o no está en el PATH" -ForegroundColor Yellow
    exit 1
}

# 3. Iniciar LocalStack
Write-Host "`n3. Iniciando LocalStack..." -ForegroundColor Blue
docker-compose up -d

# Esperar a que LocalStack esté listo
Write-Host "Esperando a que LocalStack esté listo..." -ForegroundColor Yellow
Write-Host "Esto puede tomar 15-20 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar que LocalStack responde
Write-Host "Verificando conexión a LocalStack..." -ForegroundColor Yellow
$maxAttempts = 10
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4566/_localstack/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ LocalStack está respondiendo" -ForegroundColor Green
            $ready = $true
        }
    } catch {
        Write-Host "  Intento $attempt/$maxAttempts..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $ready) {
    Write-Host "⚠️  LocalStack tardó más de lo esperado en iniciar" -ForegroundColor Yellow
    Write-Host "   Puedes intentar manualmente: npm run init-db" -ForegroundColor Yellow
}

# Verificar que LocalStack está corriendo
$containers = docker ps --format "{{.Names}}"
if ($containers -notcontains "localstack-lambda") {
    Write-Host "⚠️  LocalStack no está corriendo" -ForegroundColor Yellow
    docker-compose logs
    exit 1
}
Write-Host "✅ LocalStack está corriendo" -ForegroundColor Green

# 4. Verificar archivo .env
Write-Host "`n4. Verificando archivo .env..." -ForegroundColor Blue
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host "Creando archivo .env..." -ForegroundColor Yellow
    
    $envContent = @"
# AWS Configuration
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=Users

# Lambda Configuration
LAMBDA_FUNCTION_NAME=user-handler
LAMBDA_ROLE_ARN=arn:aws:iam::000000000000:role/lambda-role
"@
    
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "✅ Archivo .env existe" -ForegroundColor Green
}

# 5. Instalar dependencias si es necesario
Write-Host "`n5. Verificando dependencias..." -ForegroundColor Blue
if (-not (Test-Path node_modules)) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

# 6. Inicializar DynamoDB
Write-Host "`n6. Inicializando DynamoDB..." -ForegroundColor Blue
npm run init-db

# 7. Mostrar información
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Proyecto iniciado correctamente" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Estado del proyecto:" -ForegroundColor Cyan
Write-Host "  - LocalStack: http://localhost:4566"
Write-Host "  - DynamoDB: Tabla 'Users' creada"
Write-Host ""
Write-Host "🎯 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Desarrollo local: npm run local"
Write-Host "  2. Debugging: Presiona F5 en VS Code"
Write-Host "  3. Desplegar Lambda: npm run deploy"
Write-Host "  4. Probar Lambda: npm test"
Write-Host ""
Write-Host "📚 Ver guías:" -ForegroundColor Cyan
Write-Host "  - README.md: Documentación completa"
Write-Host "  - QUICKSTART.md: Guía de inicio rápido"
Write-Host "  - ARCHITECTURE.md: Explicación de la arquitectura"
Write-Host ""
Write-Host "🛑 Para detener: docker-compose down" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

