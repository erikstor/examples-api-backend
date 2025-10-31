#!/bin/bash

# Script para crear los topics de Kafka necesarios

echo "🚀 Creando topics de Kafka..."

# Crear topic para logs del User Service
docker exec kafka kafka-topics --create \
  --topic user-logs \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

# Crear topic para logs del Create User Service
docker exec kafka kafka-topics --create \
  --topic create-user-logs \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

# Crear topic para el servicio de logging
docker exec kafka kafka-topics --create \
  --topic logging-service \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

echo "✅ Topics creados exitosamente!"

# Listar todos los topics
echo "📋 Topics disponibles:"
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092
