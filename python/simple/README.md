# Python CRUD API Example

Este es un ejemplo completo de una API CRUD construida con Python, FastAPI y PostgreSQL. Incluye autenticación JWT, validación de datos con Pydantic, documentación automática y tests completos.

## Características

- ✅ **FastAPI** con documentación automática
- ✅ **CRUD completo** para usuarios
- ✅ **Autenticación JWT** con registro y login
- ✅ **Validación de datos** con Pydantic
- ✅ **PostgreSQL** con SQLAlchemy ORM
- ✅ **Documentación automática** (Swagger/ReDoc)
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Paginación** en listados
- ✅ **Soft delete** para usuarios
- ✅ **Tests completos** con pytest
- ✅ **Type hints** completos
- ✅ **Async/await** support

## Estructura del Proyecto

```
app/
├── main.py              # Aplicación principal FastAPI
├── core/
│   ├── config.py        # Configuración con Pydantic Settings
│   └── security.py      # Funciones de seguridad JWT y bcrypt
├── database.py          # Configuración de base de datos y modelos
├── schemas.py           # Esquemas Pydantic para validación
├── dependencies.py      # Dependencias de autenticación
└── routes/
    ├── auth.py          # Rutas de autenticación
    └── users.py         # Rutas CRUD de usuarios

tests/
├── test_auth.py         # Tests de autenticación
└── test_users.py        # Tests de usuarios
```

## Instalación

1. **Crear entorno virtual:**
```bash
cd python/simple
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

4. **Instalar PostgreSQL** y crear base de datos:
```sql
CREATE DATABASE crud_example;
CREATE DATABASE crud_example_test; -- Para tests
```

5. **Ejecutar la aplicación:**
```bash
uvicorn app.main:app --reload
```

## Uso de la API

### Documentación Automática

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Autenticación

#### Registro de Usuario
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
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
curl -X POST "http://localhost:8000/api/auth/login" \
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
curl -X GET "http://localhost:8000/api/users/?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Obtener usuario por ID
```bash
curl -X GET "http://localhost:8000/api/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Crear nuevo usuario
```bash
curl -X POST "http://localhost:8000/api/users/" \
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
curl -X PUT "http://localhost:8000/api/users/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "María García Actualizada",
    "age": 31
  }'
```

#### Eliminar usuario (soft delete)
```bash
curl -X DELETE "http://localhost:8000/api/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Health Check
```bash
curl -X GET "http://localhost:8000/health"
```

## Colección de Postman

```json
{
  "info": {
    "name": "Python FastAPI CRUD",
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
              "raw": "{{baseUrl}}/api/users/?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", ""],
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
              "raw": "{{baseUrl}}/api/users/",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", ""]
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
      "value": "http://localhost:8000"
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

## Tests

### Ejecutar todos los tests
```bash
pytest
```

### Ejecutar tests específicos
```bash
pytest tests/test_auth.py
pytest tests/test_users.py
```

### Tests con cobertura
```bash
pytest --cov=app tests/
```

### Tests con verbose
```bash
pytest -v
```

## Despliegue

### Opción 1: Docker

1. **Crear Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Crear docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/crud_example
      - SECRET_KEY=your-secret-key
      - ENVIRONMENT=production
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
heroku create your-python-app
```

2. **Configurar variables de entorno:**
```bash
heroku config:set DATABASE_URL=your-postgres-url
heroku config:set SECRET_KEY=your-secret-key
heroku config:set ENVIRONMENT=production
```

3. **Crear Procfile:**
```
web: uvicorn app.main:app --host=0.0.0.0 --port=$PORT
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

2. **Instalar Python y PostgreSQL:**
```bash
# Python
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv

# PostgreSQL
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
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp env.example .env
# Editar .env
```

5. **Usar systemd para producción:**
```bash
sudo nano /etc/systemd/system/fastapi.service
```

**Contenido del archivo:**
```ini
[Unit]
Description=FastAPI CRUD Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/your-app
Environment="PATH=/home/ubuntu/your-app/venv/bin"
ExecStart=/home/ubuntu/your-app/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable fastapi
sudo systemctl start fastapi
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
runtime: python311
env: standard
instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

env_variables:
  DATABASE_URL: "your-postgres-url"
  SECRET_KEY: "your-secret-key"
  ENVIRONMENT: "production"

entrypoint: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Validaciones Implementadas

- **Nombre:** 2-50 caracteres, requerido
- **Email:** Formato válido, único, requerido
- **Contraseña:** Mínimo 6 caracteres, requerida
- **Edad:** 18-120 años, opcional
- **Autenticación:** JWT token requerido para rutas protegidas

## Características de FastAPI

- **Documentación automática** con Swagger/ReDoc
- **Validación automática** con Pydantic
- **Type hints** completos
- **Async/await** support
- **Performance** similar a Node.js
- **OpenAPI** estándar
- **Dependency injection** integrado

## Base de Datos

- **PostgreSQL** con SQLAlchemy ORM
- **Migrations** con Alembic (se puede agregar)
- **Pool de conexiones** automático
- **Soft delete** para usuarios
- **Timestamps** automáticos

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT tokens para autenticación
- Validación de datos con Pydantic
- Sanitización automática de inputs
- Rate limiting (se puede agregar)

## Ventajas de FastAPI

- **Rápido:** Performance similar a Node.js
- **Fácil de usar:** Sintaxis simple y clara
- **Documentación automática:** Swagger/ReDoc integrado
- **Type safety:** Validación automática con Pydantic
- **Moderno:** Async/await, type hints
- **Productivo:** Menos código, más funcionalidad

## Monitoreo y Logs

Para producción, considera agregar:
- Logging estructurado
- Sentry para error tracking
- Prometheus para métricas
- Health checks más detallados
- APM (Application Performance Monitoring) 