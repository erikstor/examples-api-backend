#!/bin/bash

echo "🔄 Reiniciando microservicios..."

# Detener servicios si están ejecutándose
echo "⏹️ Deteniendo servicios..."
pkill -f "user-service" 2>/dev/null || true
pkill -f "create-user-service" 2>/dev/null || true
pkill -f "logging-service" 2>/dev/null || true

# Esperar un poco
sleep 2

# Compilar el proyecto
echo "🔨 Compilando proyecto..."
npm run build

# Iniciar servicios en background
echo "🚀 Iniciando servicios..."

# User Service
echo "  - Iniciando User Service (puerto 3001)..."
npm run start:user-service &
sleep 2

# Create User Service  
echo "  - Iniciando Create User Service (puerto 3002)..."
npm run start:create-user-service &
sleep 2

# Logging Service
echo "  - Iniciando Logging Service (puerto 3003)..."
npm run start:logging-service &
sleep 2

echo "✅ Servicios iniciados"
echo ""
echo "📋 Servicios disponibles:"
echo "  - User Service: http://localhost:3001"
echo "  - Create User Service: http://localhost:3002" 
echo "  - Logging Service: http://localhost:3003"
echo ""
echo "🔍 Para verificar que funcionan:"
echo "  curl http://localhost:3003/logs/stats"
