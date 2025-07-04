# Node.js CRUD API Example

Este es un ejemplo completo de una API CRUD construida con Node.js, Express y MongoDB. Incluye autenticación JWT, validación de datos, middleware de seguridad y tests completos.

## Características

- ✅ **CRUD completo** para usuarios
- ✅ **Autenticación JWT** con registro y login
- ✅ **Validación de datos** con express-validator
- ✅ **Middleware de seguridad** (helmet, cors)
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Paginación** en listados
- ✅ **Soft delete** para usuarios
- ✅ **Tests unitarios** y **end-to-end**
- ✅ **Documentación completa** con ejemplos

## Estructura del Proyecto

```
src/
├── app.js              # Aplicación principal
├── models/
│   └── User.js         # Modelo de usuario con Mongoose
├── middleware/
│   ├── auth.js         # Middleware de autenticación
│   └── validation.js   # Middleware de validación
└── routes/
    ├── auth.js         # Rutas de autenticación
    └── users.js        # Rutas CRUD de usuarios

tests/
├── unit/
│   └── user.test.js    # Tests unitarios del modelo
├── e2e/
│   ├── auth.test.js    # Tests E2E de autenticación
│   └── users.test.js   # Tests E2E de usuarios
└── setup.js            # Configuración de tests
```

## Instalación

1. **Clonar y instalar dependencias:**
```bash
cd nodejs/simple
npm install
```

2. **Configurar variables de entorno:**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

3. **Instalar MongoDB** (o usar MongoDB Atlas)

4. **Ejecutar la aplicación:**
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
curl -X GET http://localhost:3000/api/users/USER_ID \
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
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "María García Actualizada",
    "age": 31
  }'
```

#### Eliminar usuario (soft delete)
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID \
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
    "name": "Node.js CRUD API",
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
      "value": "user-id-here"
    }
  ]
}
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

### Opción 1: Heroku

1. **Crear aplicación en Heroku:**
```bash
heroku create your-app-name
```

2. **Configurar variables de entorno:**
```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

3. **Desplegar:**
```bash
git push heroku main
```

### Opción 2: Docker

1. **Crear Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Construir y ejecutar:**
```bash
docker build -t nodejs-crud-api .
docker run -p 3000:3000 -e MONGODB_URI=your-mongodb-uri nodejs-crud-api
```

### Opción 3: AWS EC2

1. **Conectar a tu instancia EC2:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Instalar Node.js y MongoDB:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb
```

3. **Clonar y configurar la aplicación:**
```bash
git clone your-repo-url
cd your-app
npm install
cp env.example .env
# Editar .env
```

4. **Usar PM2 para producción:**
```bash
npm install -g pm2
pm2 start src/app.js --name "crud-api"
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
  MONGODB_URI: "your-mongodb-uri"
  JWT_SECRET: "your-secret-key"
  NODE_ENV: "production"
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
- **Validation:** Validación de datos de entrada
- **Error Handling:** Manejo centralizado de errores

## Base de Datos

- **MongoDB** con Mongoose ODM
- **Índices** en campos únicos
- **Timestamps** automáticos
- **Soft delete** para usuarios
- **Hash de contraseñas** automático

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT tokens para autenticación
- Headers de seguridad con Helmet
- Validación de datos de entrada
- Sanitización de emails
- Rate limiting (se puede agregar)

## Monitoreo y Logs

Para producción, considera agregar:
- Winston para logging
- Sentry para error tracking
- Prometheus para métricas
- Health checks más detallados 