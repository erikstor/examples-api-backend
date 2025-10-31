#!/bin/bash

# Script para detener el proyecto

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🛑 Deteniendo LocalStack Lambda Project"
echo "=================================================="

# Detener Docker Compose
echo "Deteniendo contenedores..."
docker-compose down

echo ""
echo -e "${GREEN}✅ Proyecto detenido correctamente${NC}"
echo ""
echo "Para iniciar nuevamente, ejecuta:"
echo "  bash start.sh"
echo ""

