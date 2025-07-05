#!/bin/bash

# Cambiar al directorio del proyecto
cd "$(dirname "$0")/.."

# Crear directorio de datos si no existe
if [ ! -d "data" ]; then
    echo "📁 Creando directorio de datos..."
    mkdir -p data
fi

echo "🚀 Configurando DynamoDB Local para el proyecto hexagonal..."

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose. Por favor, inicia Docker y vuelve a intentar."
    exit 1
fi

# Detener contenedores existentes si los hay
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Levantar los servicios
echo "📦 Levantando DynamoDB Local..."
docker-compose up -d

# Esperar a que DynamoDB esté listo
echo "⏳ Esperando a que DynamoDB Local esté listo..."
sleep 10

# Verificar que DynamoDB esté respondiendo
echo "🔍 Verificando conexión con DynamoDB..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8000 > /dev/null 2>&1; then
        echo "✅ DynamoDB Local está respondiendo"
        break
    fi
    
    echo "Intento $attempt/$max_attempts - Esperando..."
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Error: DynamoDB Local no respondió después de $max_attempts intentos"
    exit 1
fi

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
else
    echo "📦 Verificando dependencias..."
    npm install
fi

# Ejecutar script de creación de tablas
echo "🏗️  Creando tabla Users..."
node scripts/create-tables.js

# Probar la conexión
echo "🧪 Probando conexión..."
node scripts/test-connection.js

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📊 Servicios disponibles:"
echo "   • DynamoDB Local: http://localhost:8000"
echo "   • DynamoDB Admin: http://localhost:8001"
echo ""
echo "🔧 Comandos útiles:"
echo "   • Ver logs: docker-compose logs -f"
echo "   • Detener servicios: docker-compose down"
echo "   • Reiniciar servicios: docker-compose restart"
echo ""
echo "💡 Para usar en tu aplicación, configura el endpoint:"
echo "   endpoint: 'http://localhost:8000'" 
