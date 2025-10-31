#!/bin/bash

# Script para iniciar todos los servicios

echo "🚀 Iniciando microservicios con NestJS, Kafka, Elasticsearch y Kibana..."

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop."
    exit 1
fi

# Iniciar Kafka, Zookeeper, Elasticsearch y Kibana
echo "📦 Iniciando Kafka, Zookeeper, Elasticsearch y Kibana..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 15

# Crear topics
echo "📝 Creando topics de Kafka..."
chmod +x scripts/create-topics.sh
./scripts/create-topics.sh

echo "✅ Todos los servicios están listos!"
echo ""
echo "🎯 Para ejecutar los microservicios, abre 3 terminales separadas y ejecuta:"
echo ""
echo "Terminal 1 - User Service:"
echo "npm run start:user-service"
echo ""
echo "Terminal 2 - Create User Service:"
echo "npm run start:create-user-service"
echo ""
echo "Terminal 3 - Logging Service:"
echo "npm run start:logging-service"
echo ""
echo "📊 Endpoints disponibles:"
echo "- User Service: http://localhost:3001"
echo "- Create User Service: http://localhost:3002"
echo "- Logging Service: http://localhost:3003"
echo "- Kibana Dashboard: http://localhost:5601"
echo "- Elasticsearch: http://localhost:9200"
echo ""
echo "🔍 Para configurar Kibana:"
echo "1. Ve a http://localhost:5601"
echo "2. Crea un índice pattern: microservices-logs*"
echo "3. Explora los logs de tus microservicios"
