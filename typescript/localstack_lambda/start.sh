#!/bin/bash

# Script completo para iniciar el proyecto

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🚀 Iniciando LocalStack Lambda Project"
echo "=================================================="

# 1. Verificar Docker
echo -e "\n${BLUE}1. Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker no está instalado o no está en el PATH${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker está disponible${NC}"

# 2. Verificar Docker Compose
echo -e "\n${BLUE}2. Verificando Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose no está instalado o no está en el PATH${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose está disponible${NC}"

# 3. Iniciar LocalStack
echo -e "\n${BLUE}3. Iniciando LocalStack...${NC}"
docker-compose up -d

# Esperar a que LocalStack esté listo
echo "Esperando a que LocalStack esté listo..."
echo "Esto puede tomar 15-20 segundos..."
sleep 15

# Verificar que LocalStack responde
echo "Verificando conexión a LocalStack..."
for i in {1..10}; do
    if curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ LocalStack está respondiendo${NC}"
        break
    fi
    echo "  Intento $i/10..."
    sleep 2
done

# Verificar que LocalStack está corriendo
if ! docker ps | grep -q localstack-lambda; then
    echo -e "${YELLOW}⚠️  LocalStack no está corriendo${NC}"
    docker-compose logs
    exit 1
fi
echo -e "${GREEN}✅ LocalStack está corriendo${NC}"

# 4. Verificar archivo .env
echo -e "\n${BLUE}4. Verificando archivo .env...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    echo "Creando archivo .env desde .env.example..."
    
    cat > .env << 'EOF'
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
EOF
    
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✅ Archivo .env existe${NC}"
fi

# 5. Instalar dependencias si es necesario
echo -e "\n${BLUE}5. Verificando dependencias...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependencias ya instaladas${NC}"
fi

# 6. Inicializar DynamoDB
echo -e "\n${BLUE}6. Inicializando DynamoDB...${NC}"
npm run init-db

# 7. Mostrar información
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Proyecto iniciado correctamente${NC}"
echo "=================================================="
echo ""
echo "📋 Estado del proyecto:"
echo "  - LocalStack: http://localhost:4566"
echo "  - DynamoDB: Tabla 'Users' creada"
echo ""
echo "🎯 Próximos pasos:"
echo "  1. Desarrollo local: npm run local"
echo "  2. Debugging: Presiona F5 en VS Code"
echo "  3. Desplegar Lambda: npm run deploy"
echo "  4. Probar Lambda: npm test"
echo ""
echo "📚 Ver guías:"
echo "  - README.md: Documentación completa"
echo "  - QUICKSTART.md: Guía de inicio rápido"
echo "  - ARCHITECTURE.md: Explicación de la arquitectura"
echo ""
echo "🛑 Para detener: docker-compose down"
echo "=================================================="

