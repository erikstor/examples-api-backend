# API CRUD en GoLang con Gin y GORM

Este es un ejemplo completo de una API REST en GoLang que implementa operaciones CRUD para usuarios con autenticación JWT, validación, middleware de seguridad y tests unitarios.

## 🚀 Características

- **Framework**: Gin para el servidor web
- **ORM**: GORM para la base de datos
- **Base de datos**: PostgreSQL (configurable)
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: go-playground/validator
- **Seguridad**: Hash de contraseñas con bcrypt
- **Tests**: Unitarios con testify
- **Middleware**: CORS, autenticación, logging
- **Documentación**: Swagger/OpenAPI

## 📋 Prerrequisitos

- Go 1.19 o superior
- PostgreSQL (o SQLite para desarrollo)
- Git

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd golang/simple
```

2. **Instalar dependencias**
```bash
go mod download
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=crud_example
DB_SSL_MODE=disable

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# Server
PORT=8080
ENVIRONMENT=development
GIN_MODE=debug
```

4. **Crear base de datos**
```sql
CREATE DATABASE crud_example;
```

5. **Ejecutar migraciones**
```bash
go run main.go
```

## 🏃‍♂️ Ejecutar el proyecto

### Desarrollo
```bash
go run main.go
```

### Producción
```bash
go build -o api
./api
```

### Tests
```bash
# Ejecutar todos los tests
go test ./...

# Ejecutar tests con coverage
go test -cover ./...

# Ejecutar tests específicos
go test ./handlers -v
```

## 📚 Endpoints de la API

### Autenticación

#### Registrar usuario
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Iniciar sesión
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Usuarios (requiere autenticación)

#### Obtener todos los usuarios
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### Obtener usuario por ID
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Crear usuario
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "janedoe",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

#### Actualizar usuario
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "johnupdated",
    "email": "john.updated@example.com"
  }'
```

#### Eliminar usuario
```bash
curl -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Check
```bash
curl -X GET http://localhost:8080/health
```

**Respuesta:**
```json
{
  "status": "OK",
  "environment": "development"
}
```

## 🧪 Tests

### Ejecutar tests unitarios
```bash
# Tests de autenticación
go test ./handlers -run TestRegister -v
go test ./handlers -run TestLogin -v

# Tests de usuarios
go test ./handlers -run TestGetUsers -v
go test ./handlers -run TestCreateUser -v
go test ./handlers -run TestUpdateUser -v
go test ./handlers -run TestDeleteUser -v

# Tests de middleware
go test ./middleware -v

# Tests de utilidades
go test ./utils -v
```

### Ejecutar tests con coverage
```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## 🐳 Docker

### Construir imagen
```bash
docker build -t crud-api-golang .
```

### Ejecutar contenedor
```bash
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  -e DB_NAME=crud_example \
  -e JWT_SECRET=your-secret-key \
  crud-api-golang
```

### Docker Compose
```bash
docker-compose up -d
```

## 🚀 Despliegue

### Heroku

1. **Instalar Heroku CLI**
```bash
# macOS
brew install heroku

# Windows
# Descargar desde https://devcenter.heroku.com/articles/heroku-cli
```

2. **Configurar aplicación**
```bash
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret-key
heroku config:set ENVIRONMENT=production
```

3. **Agregar base de datos**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. **Desplegar**
```bash
git push heroku main
```

### AWS EC2

1. **Crear instancia EC2**
```bash
# Conectar a la instancia
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Instalar Go y PostgreSQL**
```bash
# Instalar Go
wget https://golang.org/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib
```

3. **Configurar base de datos**
```bash
sudo -u postgres psql
CREATE DATABASE crud_example;
CREATE USER api_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE crud_example TO api_user;
\q
```

4. **Desplegar aplicación**
```bash
# Clonar repositorio
git clone <repository-url>
cd golang/simple

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de producción

# Compilar y ejecutar
go build -o api
./api
```

5. **Configurar systemd service**
```bash
sudo nano /etc/systemd/system/crud-api.service
```

```ini
[Unit]
Description=CRUD API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/golang/simple
ExecStart=/home/ubuntu/golang/simple/api
Restart=always
Environment=ENVIRONMENT=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable crud-api
sudo systemctl start crud-api
```

### Google Cloud Platform

1. **Instalar Google Cloud SDK**
```bash
# macOS
brew install google-cloud-sdk

# Windows
# Descargar desde https://cloud.google.com/sdk/docs/install
```

2. **Configurar proyecto**
```bash
gcloud config set project your-project-id
gcloud auth login
```

3. **Desplegar en Cloud Run**
```bash
# Construir y desplegar
gcloud run deploy crud-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production
```

4. **Configurar Cloud SQL**
```bash
# Crear instancia de Cloud SQL
gcloud sql instances create crud-db \
  --database-version=POSTGRES_13 \
  --tier=db-f1-micro \
  --region=us-central1

# Crear base de datos
gcloud sql databases create crud_example --instance=crud-db

# Crear usuario
gcloud sql users create api_user \
  --instance=crud-db \
  --password=password
```

## 📁 Estructura del proyecto

```
golang/simple/
├── main.go                 # Punto de entrada de la aplicación
├── go.mod                  # Dependencias de Go
├── go.sum                  # Checksums de dependencias
├── .env.example           # Variables de entorno de ejemplo
├── Dockerfile             # Configuración de Docker
├── docker-compose.yml     # Configuración de Docker Compose
├── config/
│   └── database.go        # Configuración de base de datos
├── handlers/
│   ├── auth.go           # Handlers de autenticación
│   ├── users.go          # Handlers de usuarios
│   ├── auth_test.go      # Tests de autenticación
│   └── users_test.go     # Tests de usuarios
├── middleware/
│   ├── auth.go           # Middleware de autenticación
│   └── cors.go           # Middleware de CORS
├── models/
│   └── user.go           # Modelo de usuario
├── utils/
│   ├── jwt.go            # Utilidades de JWT
│   └── password.go       # Utilidades de hash de contraseñas
└── README.md             # Documentación
```

## 🔧 Configuración

### Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `DB_USER` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | - |
| `DB_NAME` | Nombre de la base de datos | `crud_example` |
| `DB_SSL_MODE` | Modo SSL de la base de datos | `disable` |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `JWT_EXPIRATION` | Expiración del token JWT | `24h` |
| `PORT` | Puerto del servidor | `8080` |
| `ENVIRONMENT` | Entorno de ejecución | `development` |
| `GIN_MODE` | Modo de Gin | `debug` |

### Base de datos

La aplicación soporta PostgreSQL y SQLite (para desarrollo). Para cambiar la base de datos, modifica la configuración en `config/database.go`.

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros con expiración
- **Hash de contraseñas**: Bcrypt para encriptar contraseñas
- **Validación**: Validación de entrada con go-playground/validator
- **CORS**: Configuración de CORS para seguridad
- **Middleware de seguridad**: Headers de seguridad automáticos

## 📊 Monitoreo

### Logs
```bash
# Ver logs en tiempo real
tail -f logs/app.log

# Ver logs de systemd
sudo journalctl -u crud-api -f
```

### Métricas
La aplicación incluye endpoints de health check para monitoreo:
- `GET /health` - Estado general de la aplicación

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔗 Enlaces útiles

- [Gin Framework](https://gin-gonic.com/)
- [GORM](https://gorm.io/)
- [JWT](https://jwt.io/)
- [Go Testing](https://golang.org/pkg/testing/)
- [Docker](https://www.docker.com/)
- [Heroku](https://heroku.com/)
- [AWS](https://aws.amazon.com/)
- [Google Cloud](https://cloud.google.com/) 