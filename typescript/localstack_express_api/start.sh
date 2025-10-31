#!/bin/bash

echo "=========================================="
echo "🚀 Starting LocalStack DynamoDB CRUD"
echo "=========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Verificar si el archivo .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from env.example...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
fi

# Iniciar LocalStack
echo -e "\n${YELLOW}📦 Starting LocalStack...${NC}"
docker-compose up -d

# Esperar a que LocalStack esté listo
echo -e "${YELLOW}⏳ Waiting for LocalStack to be ready...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker ps | grep -q localstack-dynamodb; then
        # Verificar que el servicio de salud responda
        if curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ LocalStack is running and healthy${NC}"
            break
        fi
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo -e "${RED}❌ LocalStack failed to start after ${MAX_RETRIES} attempts${NC}"
        echo -e "${YELLOW}Showing container logs:${NC}"
        docker-compose logs --tail=30
        exit 1
    fi
    
    echo -e "   Attempt $RETRY_COUNT/$MAX_RETRIES - waiting..."
    sleep 2
done

# Instalar dependencias si node_modules no existe
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Inicializar base de datos
echo -e "\n${YELLOW}🗄️  Initializing DynamoDB table...${NC}"
npm run init-db

# Verificar si la inicialización fue exitosa
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database initialized successfully${NC}"
else
    echo -e "${RED}❌ Database initialization failed${NC}"
    exit 1
fi

# Preguntar si se desea ejecutar el script de prueba
echo -e "\n${YELLOW}Do you want to run CRUD tests? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "\n${YELLOW}🧪 Running CRUD tests...${NC}"
    npm run test-crud
fi

# Iniciar la aplicación
echo -e "\n${GREEN}=========================================="
echo "🎉 Setup complete! Starting application..."
echo "==========================================${NC}\n"

npm run dev

