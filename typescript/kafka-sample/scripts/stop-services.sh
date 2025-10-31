#!/bin/bash

# Script para detener todos los servicios

echo "🛑 Deteniendo microservicios..."

# Detener contenedores de Docker
docker-compose down

echo "✅ Todos los servicios han sido detenidos."
