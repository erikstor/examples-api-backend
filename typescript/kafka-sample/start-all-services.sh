#!/bin/bash

echo "Iniciando todos los servicios de microservicios Kafka..."
echo ""

echo "[1/3] Iniciando User Service en puerto 3001..."
gnome-terminal --title="User Service" -- bash -c "cd '$(pwd)' && npm run start:user-service; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run start:user-service"' 2>/dev/null || \
start "User Service" cmd /k "cd /d %~dp0 && npm run start:user-service" 2>/dev/null || \
echo "Por favor ejecuta manualmente: npm run start:user-service"

sleep 3

echo ""
echo "[2/3] Iniciando Create User Service en puerto 3002..."
gnome-terminal --title="Create User Service" -- bash -c "cd '$(pwd)' && npm run start:create-user-service; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run start:create-user-service"' 2>/dev/null || \
start "Create User Service" cmd /k "cd /d %~dp0 && npm run start:create-user-service" 2>/dev/null || \
echo "Por favor ejecuta manualmente: npm run start:create-user-service"

sleep 3

echo ""
echo "[3/3] Iniciando Logging Service en puerto 3003..."
gnome-terminal --title="Logging Service" -- bash -c "cd '$(pwd)' && npm run start:logging-service; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run start:logging-service"' 2>/dev/null || \
start "Logging Service" cmd /k "cd /d %~dp0 && npm run start:logging-service" 2>/dev/null || \
echo "Por favor ejecuta manualmente: npm run start:logging-service"

echo ""
echo "✅ Todos los servicios han sido iniciados:"
echo "   - User Service: http://localhost:3001"
echo "   - Create User Service: http://localhost:3002"  
echo "   - Logging Service: http://localhost:3003"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios o cierra las ventanas individualmente"
