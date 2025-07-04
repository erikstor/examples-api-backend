# TypeScript CRUD API Example

Este es un ejemplo completo de una API CRUD construida con TypeScript, Express y PostgreSQL. Incluye tipado fuerte, autenticación JWT, validación de datos con Joi, y tests completos.

## Características

- ✅ **TypeScript** con tipado fuerte
- ✅ **CRUD completo** para usuarios
- ✅ **Autenticación JWT** con registro y login
- ✅ **Validación de datos** con Joi
- ✅ **PostgreSQL** con pool de conexiones
- ✅ **Middleware de seguridad** (helmet, cors)
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Paginación** en listados
- ✅ **Soft delete** para usuarios
- ✅ **Tests unitarios** y **end-to-end**
- ✅ **ESLint** para linting
- ✅ **Documentación completa** con ejemplos

## Estructura del Proyecto

```
src/
├── app.ts                 # Aplicación principal
├── types/
│   └── index.ts          # Definiciones de tipos TypeScript
├── config/
│   └── database.ts       # Configuración de PostgreSQL
├── services/
│   └── userService.ts    # Lógica de negocio
├── middleware/
│   ├── auth.ts          # Middleware de autenticación
│   └── validation.ts    # Middleware de validación
└── routes/
    ├── auth.ts          # Rutas de autenticación
    └── users.ts         # Rutas CRUD de usuarios

tests/
├── unit/
│   └── userService.test.ts  # Tests unitarios
├── e2e/
│   ├── auth.test.ts         # Tests E2E de autenticación
│   └── users.test.ts        # Tests E2E de usuarios
└── setup.ts                 # Configuración de tests
```

## Instalación

1. **Clonar y instalar dependencias:**
```bash
cd typescript/simple
npm install
```

2. **Configurar variables de entorno:**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

3. **Instalar PostgreSQL** y crear base de datos:
```sql
CREATE DATABASE crud_example;
CREATE DATABASE crud_example_test; -- Para tests
```

4. **Compilar TypeScript:**
```bash
npm run build
```

5. **Ejecutar la aplicación:**
```bash
npm run dev
```

## Uso de la API

### Autenticación

#### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "age": 25
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### CRUD de Usuarios

**Nota:** Todas las rutas requieren el header `Authorization: Bearer <token>`

#### Obtener todos los usuarios (con paginación)
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Obtener usuario por ID
```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Crear nuevo usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "María García",
    "email": "maria@example.com",
    "password": "password123",
    "age": 30
  }'
```

#### Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "María García Actualizada",
    "age": 31
  }'
```

#### Eliminar usuario (soft delete)
```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Health Check
```bash
curl -X GET http://localhost:3000/health
```

## Colección de Postman

```json
{
  "info": {
    "name": "TypeScript CRUD API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"age\": 25\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get User by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/{{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "{{userId}}"]
            }
          }
        },
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"New User\",\n  \"email\": \"newuser@example.com\",\n  \"password\": \"password123\",\n  \"age\": 30\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users"]
            }
          }
        },
        {
          "name": "Update User",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Updated Name\",\n  \"age\": 35\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/{{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "{{userId}}"]
            }
          }
        },
        {
          "name": "Delete User",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/{{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "{{userId}}"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": "your-jwt-token-here"
    },
    {
      "key": "userId",
      "value": "1"
    }
  ]
}
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo con hot reload
npm run build        # Compilar TypeScript a JavaScript
npm start            # Ejecutar versión compilada

# Tests
npm test             # Ejecutar tests unitarios
npm run test:e2e     # Ejecutar tests end-to-end
npm test -- --coverage  # Tests con cobertura

# Linting
npm run lint         # Verificar código con ESLint
npm run lint:fix     # Corregir errores de linting automáticamente
```

## Tests

### Tests Unitarios
```bash
npm test
```

### Tests End-to-End
```bash
npm run test:e2e
```

### Cobertura de Tests
```bash
npm test -- --coverage
```

## Despliegue

### Opción 1: Docker

1. **Crear Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias de compilación
RUN apk add --no-cache python3 make g++

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
```

2. **Crear docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=crud_example
      - DB_USER=postgres
      - DB_PASSWORD=password
      - JWT_SECRET=your-secret-key
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=crud_example
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

3. **Ejecutar:**
```bash
docker-compose up -d
```

### Opción 2: Heroku

1. **Crear aplicación en Heroku:**
```bash
heroku create your-typescript-app
```

2. **Configurar variables de entorno:**
```bash
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=your-postgres-host
heroku config:set DB_PORT=5432
heroku config:set DB_NAME=your-db-name
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set JWT_SECRET=your-secret-key
```

3. **Configurar buildpack:**
```bash
heroku buildpacks:set heroku/nodejs
```

4. **Desplegar:**
```bash
git push heroku main
```

### Opción 3: AWS EC2

1. **Conectar a tu instancia EC2:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Instalar Node.js y PostgreSQL:**
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
```

3. **Configurar PostgreSQL:**
```bash
sudo -u postgres psql
CREATE DATABASE crud_example;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE crud_example TO myuser;
\q
```

4. **Clonar y configurar la aplicación:**
```bash
git clone your-repo-url
cd your-app
npm install
npm run build
cp env.example .env
# Editar .env
```

5. **Usar PM2 para producción:**
```bash
npm install -g pm2
pm2 start dist/app.js --name "typescript-crud-api"
pm2 startup
pm2 save
```

### Opción 4: Google Cloud Platform

1. **Instalar Google Cloud SDK**

2. **Configurar proyecto:**
```bash
gcloud config set project your-project-id
```

3. **Desplegar en App Engine:**
```bash
gcloud app deploy app.yaml
```

**app.yaml:**
```yaml
runtime: nodejs18
env: standard
instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

env_variables:
  NODE_ENV: "production"
  DB_HOST: "your-postgres-host"
  DB_PORT: "5432"
  DB_NAME: "your-db-name"
  DB_USER: "your-db-user"
  DB_PASSWORD: "your-db-password"
  JWT_SECRET: "your-secret-key"

build_env_variables:
  GOOGLE_NODE_RUN_SCRIPTS: "build"
```

## Validaciones Implementadas

- **Nombre:** 2-50 caracteres, requerido
- **Email:** Formato válido, único, requerido
- **Contraseña:** Mínimo 6 caracteres, requerida
- **Edad:** 18-120 años, opcional
- **Autenticación:** JWT token requerido para rutas protegidas

## Middleware Implementado

- **Helmet:** Seguridad de headers HTTP
- **CORS:** Cross-origin resource sharing
- **Auth:** Verificación de JWT tokens
- **Validation:** Validación de datos con Joi
- **Error Handling:** Manejo centralizado de errores

## Base de Datos

- **PostgreSQL** con pool de conexiones
- **Índices** en campos únicos y de búsqueda
- **Constraints** de validación a nivel de BD
- **Soft delete** para usuarios
- **Timestamps** automáticos

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT tokens para autenticación
- Headers de seguridad con Helmet
- Validación de datos con Joi
- Sanitización de inputs
- Rate limiting (se puede agregar)

## Ventajas de TypeScript

- **Tipado fuerte** que previene errores en tiempo de compilación
- **IntelliSense** mejorado en IDEs
- **Refactoring** más seguro
- **Documentación** automática a través de tipos
- **Mejor mantenibilidad** del código
- **Detección temprana** de errores

## Monitoreo y Logs

Para producción, considera agregar:
- Winston para logging estructurado
- Sentry para error tracking
- Prometheus para métricas
- Health checks más detallados
- APM (Application Performance Monitoring) 