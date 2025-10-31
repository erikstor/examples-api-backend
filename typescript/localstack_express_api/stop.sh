#!/bin/bash

echo "=========================================="
echo "🛑 Stopping LocalStack DynamoDB CRUD"
echo "=========================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detener LocalStack
echo -e "${YELLOW}🛑 Stopping LocalStack...${NC}"
docker-compose down

# Verificar si se quiere eliminar los datos persistentes
echo -e "\n${YELLOW}Do you want to remove persistent data? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}🗑️  Removing persistent data...${NC}"
    rm -rf localstack-data/
    echo -e "${GREEN}✅ Persistent data removed${NC}"
fi

echo -e "\n${GREEN}=========================================="
echo "✅ LocalStack stopped successfully"
echo "==========================================${NC}"

