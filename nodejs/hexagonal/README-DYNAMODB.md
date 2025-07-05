# Configuración de DynamoDB Local para Proyecto Hexagonal

Este documento explica cómo configurar y usar DynamoDB Local con el proyecto hexagonal.

## 🚀 Inicio Rápido

### 1. Configuración Automática (Recomendado)

#### En Linux/macOS:
```bash
# Dar permisos de ejecución al script
chmod +x scripts/setup-dynamodb.sh

# Ejecutar configuración automática
./scripts/setup-dynamodb.sh
```

#### En Windows:
```powershell
# Ejecutar configuración automática
.\scripts\setup-dynamodb.ps1
```

### 2. Configuración Manual

```bash
# 1. Levantar DynamoDB Local
docker-compose up -d

# 2. Esperar a que esté listo (aproximadamente 10 segundos)
sleep 10

# 3. Crear tabla Users
node scripts/create-tables.js
```

### 3. Reset Completo (Si hay problemas)

#### En Linux/macOS:
```bash
./scripts/reset-dynamodb.sh
```

#### En Windows:
```powershell
.\scripts\reset-dynamodb.ps1
```

## 📊 Servicios Disponibles

- **DynamoDB Local**: http://localhost:8000
- **DynamoDB Admin**: http://localhost:8001 (Interfaz web para administrar)

## 🏗️ Estructura de la Tabla Users

La tabla `Users` se crea con la siguiente configuración:

### Clave Primaria
- **id** (String) - Clave de partición (HASH)

### Índice Secundario Global (GSI)
- **email-index** - Para búsquedas por email

### Atributos
- `id` (String) - Identificador único del usuario
- `name` (String) - Nombre del usuario
- `email` (String) - Email del usuario (único)
- `createdAt` (String) - Fecha de creación (ISO)
- `updatedAt` (String) - Fecha de última actualización (ISO)

## 🔧 Configuración en la Aplicación

### Variables de Entorno

Copia el archivo `env.example` a `.env`:

```bash
cp env.example .env
```

### Uso en el Código

```typescript
import { DynamoUserRepository } from './src/adapters/repository/DynamoUserRepository';

// El repositorio se configura automáticamente
const userRepository = new DynamoUserRepository();

// O especificar una tabla personalizada
const userRepository = new DynamoUserRepository('MiTablaUsers');
```

## 🧪 Datos de Ejemplo

El script de configuración inserta automáticamente dos usuarios de ejemplo:

1. **Juan Pérez** - juan.perez@example.com
2. **María García** - maria.garcia@example.com

## 🔍 Comandos Útiles

```bash
# Ver logs de los contenedores
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado de los contenedores
docker-compose ps

# Eliminar volúmenes (cuidado: elimina todos los datos)
docker-compose down -v
```

## 🐛 Solución de Problemas

### DynamoDB no responde
```bash
# Verificar que el contenedor esté ejecutándose
docker-compose ps

# Ver logs del contenedor
docker-compose logs dynamodb-local

# Reiniciar el servicio
docker-compose restart dynamodb-local
```

### Error de conexión en la aplicación
1. Verificar que DynamoDB esté ejecutándose en el puerto 8000
2. Verificar las variables de entorno en `.env`
3. Asegurar que `DYNAMODB_LOCAL=true` esté configurado

### Error de SQLite en Windows
Si ves errores como "unable to open database file":
```powershell
# Reset completo de DynamoDB
.\scripts\reset-dynamodb.ps1
```

### Puerto 8000 ocupado
```bash
# Cambiar el puerto en docker-compose.yml
ports:
  - "8002:8000"  # Cambiar 8000 por 8002
```

Y actualizar el endpoint en `src/infra/Dynamodb.ts`:
```typescript
config.endpoint = 'http://localhost:8002';
```

## 🔄 Migración a Producción

Para usar DynamoDB en AWS:

1. **Actualizar variables de entorno**:
   ```bash
   DYNAMODB_LOCAL=false
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=tu-access-key
   AWS_SECRET_ACCESS_KEY=tu-secret-key
   ```

2. **Crear tabla en AWS DynamoDB** con la misma estructura:
   - Clave primaria: `id` (String)
   - GSI: `email-index` en `email`

3. **Configurar permisos IAM** para acceder a la tabla

## 📚 Recursos Adicionales

- [DynamoDB Local Docker Image](https://hub.docker.com/r/amazon/dynamodb-local)
- [DynamoDB Admin](https://github.com/aaronshaf/dynamodb-admin)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [DynamoDB Client v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/)
- [DynamoDB Document Client v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html) 
