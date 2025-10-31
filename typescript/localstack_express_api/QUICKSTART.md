# 🚀 Quick Start Guide

Esta es una guía rápida de 5 minutos para poner en marcha el proyecto.

## ⚡ Método 1: Script Automático (Recomendado)

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### Windows (Git Bash):
```bash
bash start.sh
```

### Windows (PowerShell):
```powershell
# Iniciar LocalStack
docker-compose up -d

# Instalar dependencias
npm install

# Crear archivo .env
copy env.example .env

# Inicializar tabla DynamoDB
npm run init-db

# Iniciar aplicación
npm run dev
```

## 📋 Método 2: Paso a Paso Manual

### 1. Iniciar LocalStack
```bash
docker-compose up -d
```

### 2. Crear archivo de configuración
```bash
# Linux/Mac
cp env.example .env

# Windows
copy env.example .env
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Inicializar DynamoDB
```bash
npm run init-db
```

### 5. (Opcional) Probar CRUD
```bash
npm run test-crud
```

### 6. Iniciar aplicación
```bash
npm run dev
```

## 🎯 Probar la API

### Opción 1: cURL
```bash
# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","age":25}'

# Obtener todos los usuarios
curl http://localhost:3000/api/users
```

### Opción 2: REST Client (VS Code)
1. Instala la extensión "REST Client" en VS Code
2. Abre el archivo `requests.http`
3. Haz clic en "Send Request" sobre cualquier petición

### Opción 3: Postman/Insomnia
Importa la colección desde `requests.http` o crea las peticiones manualmente.

## 🔍 Verificar que todo funciona

1. **Health Check**: http://localhost:3000/health
2. **LocalStack Status**: 
   ```bash
   docker ps | grep localstack
   ```
3. **Tablas DynamoDB**: 
   ```bash
   aws dynamodb list-tables \
     --endpoint-url http://localhost:4566 \
     --region us-east-1
   ```

## 🛑 Detener todo

```bash
# Linux/Mac
./stop.sh

# O manualmente
docker-compose down
```

## 📚 Próximos pasos

- Lee el [README.md](README.md) completo para más detalles
- Explora el código en `src/`
- Modifica el modelo de Usuario en `src/models/User.ts`
- Añade nuevas entidades siguiendo el patrón existente

## 🆘 Problemas comunes

| Problema | Solución |
|----------|----------|
| Docker no inicia | Verifica que Docker Desktop esté corriendo |
| Puerto 4566 ocupado | Detén otros servicios en ese puerto |
| Tabla no existe | Ejecuta `npm run init-db` |
| Módulos no encontrados | Ejecuta `npm install` |

## 📞 ¿Necesitas ayuda?

Revisa el [README.md](README.md) completo o abre un issue en el repositorio.

