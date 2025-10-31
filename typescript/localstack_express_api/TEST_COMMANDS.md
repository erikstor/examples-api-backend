# 🧪 Comandos de Prueba Rápida

## ✅ Verificación del Sistema

### 1. Verificar que LocalStack está corriendo
```bash
docker ps | grep localstack
```

**Resultado esperado**: Deberías ver el contenedor `localstack-dynamodb` con estado `Up` y `healthy`

### 2. Verificar la salud de LocalStack
```bash
curl http://localhost:4566/_localstack/health
```

**Resultado esperado**: JSON con `"dynamodb": "available"`

### 3. Verificar que la tabla existe
```bash
aws dynamodb list-tables \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

**Resultado esperado**: Lista con la tabla `Users`

## 🚀 Iniciar la Aplicación

### Modo 1: Desarrollo (recomendado para pruebas)
```bash
cd localstack
npm run dev
```

Deberías ver:
```
==================================================
🚀 Server is running on port 3000
📍 API URL: http://localhost:3000
🏥 Health check: http://localhost:3000/health
👥 Users endpoint: http://localhost:3000/api/users
==================================================
```

### Modo 2: Producción
```bash
cd localstack
npm run build
npm start
```

## 🧪 Probar la API (en otra terminal)

### Health Check
```bash
curl http://localhost:3000/health
```

### Crear usuarios
```bash
# Usuario 1
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice Johnson",
    "age": 28
  }'

# Usuario 2
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "name": "Bob Smith",
    "age": 35
  }'
```

### Listar todos los usuarios
```bash
curl http://localhost:3000/api/users
```

### Obtener usuario por ID (reemplaza USER_ID con un ID real)
```bash
curl http://localhost:3000/api/users/USER_ID
```

### Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Updated Johnson",
    "age": 29
  }'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID
```

## 📊 Verificar datos en DynamoDB directamente

### Ver todos los registros
```bash
aws dynamodb scan \
  --table-name Users \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

### Contar registros
```bash
aws dynamodb scan \
  --table-name Users \
  --select COUNT \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

## 🔄 Script Completo de Prueba

Guarda esto en un archivo `test.sh` y ejecútalo:

```bash
#!/bin/bash

echo "🧪 Iniciando pruebas completas..."
echo ""

# 1. Health check
echo "1️⃣  Health Check..."
curl -s http://localhost:3000/health | jq
echo ""

# 2. Crear usuario
echo "2️⃣  Creando usuario..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "age": 25
  }')
echo $RESPONSE | jq
USER_ID=$(echo $RESPONSE | jq -r '.data.id')
echo "   User ID: $USER_ID"
echo ""

# 3. Obtener usuario
echo "3️⃣  Obteniendo usuario..."
curl -s http://localhost:3000/api/users/$USER_ID | jq
echo ""

# 4. Listar usuarios
echo "4️⃣  Listando todos los usuarios..."
curl -s http://localhost:3000/api/users | jq
echo ""

# 5. Actualizar usuario
echo "5️⃣  Actualizando usuario..."
curl -s -X PUT http://localhost:3000/api/users/$USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User Updated",
    "age": 26
  }' | jq
echo ""

# 6. Eliminar usuario
echo "6️⃣  Eliminando usuario..."
curl -s -X DELETE http://localhost:3000/api/users/$USER_ID | jq
echo ""

# 7. Verificar eliminación
echo "7️⃣  Verificando eliminación..."
curl -s http://localhost:3000/api/users/$USER_ID | jq
echo ""

echo "✅ Pruebas completadas!"
```

## 🛑 Detener todo

```bash
# Detener la aplicación: Ctrl+C en la terminal donde corre

# Detener LocalStack
cd localstack
docker-compose down

# Eliminar también los datos
docker-compose down -v
```

## 💡 Tips

### 1. Usar jq para formatear JSON
```bash
# Instalar jq (si no lo tienes)
# Windows: choco install jq
# Mac: brew install jq
# Linux: sudo apt install jq

# Usar con curl
curl http://localhost:3000/api/users | jq
```

### 2. Guardar respuesta en variable
```bash
RESPONSE=$(curl -s -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"email":"test@example.com","name":"Test"}')
USER_ID=$(echo $RESPONSE | jq -r '.data.id')
echo "Created user with ID: $USER_ID"
```

### 3. Ver logs de la aplicación
```bash
# Los logs aparecen en la terminal donde ejecutaste npm run dev
```

### 4. Ver logs de LocalStack
```bash
cd localstack
docker-compose logs -f
```

