#!/bin/bash

echo "🔄 Reseteando DynamoDB Local..."

# Cambiar al directorio del proyecto
cd "$(dirname "$0")/.."

# Detener contenedores
echo "🛑 Deteniendo contenedores..."
docker-compose down

# Eliminar directorio de datos
echo "🗑️  Eliminando datos existentes..."
rm -rf data

# Crear directorio de datos limpio
echo "📁 Creando directorio de datos limpio..."
mkdir -p data

# Levantar servicios
echo "📦 Levantando DynamoDB Local..."
docker-compose up -d

# Esperar a que esté listo
echo "⏳ Esperando a que DynamoDB Local esté listo..."
sleep 15

# Crear tabla
echo "🏗️  Creando tabla Users..."
node scripts/create-tables.js

echo "✅ Reset completado exitosamente!" 
