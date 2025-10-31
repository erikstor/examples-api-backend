# Lambda con TypeScript y LocalStack - Arquitectura en Capas

Este proyecto es un ejemplo completo de una función AWS Lambda desarrollada en TypeScript que utiliza DynamoDB para gestionar usuarios. Implementa arquitectura en capas (Layered Architecture) y utiliza LocalStack para desarrollo y testing local.

## 📋 Características

- **AWS Lambda** con TypeScript
- **DynamoDB** para persistencia de datos
- **LocalStack** para desarrollo local
- **Arquitectura en Capas** (Domain, Application, Infrastructure, Presentation)
- **Webpack** para empaquetado optimizado
- **Debugging** configurado para VS Code
- **Source Maps** para debugging
- Scripts automatizados para despliegue y testing

## 🏗️ Arquitectura en Capas

El proyecto sigue el patrón de arquitectura en capas:

```
src/
├── domain/                    # Capa de Dominio
│   ├── User.ts               # Entidades y objetos de valor
│   └── IUserRepository.ts    # Interfaces de repositorios
├── application/              # Capa de Aplicación
│   ├── GetUserUseCase.ts     # Casos de uso
│   ├── CreateUserUseCase.ts
│   └── GetOrCreateUserUseCase.ts
├── infrastructure/           # Capa de Infraestructura
│   ├── config/
│   │   └── dynamodb.ts       # Configuración de DynamoDB
│   └── repositories/
│       └── DynamoDBUserRepository.ts  # Implementación del repositorio
└── presentation/             # Capa de Presentación
    └── handler.ts            # Lambda handler
```

### Capas

1. **Domain (Dominio)**: Contiene las entidades de negocio y las interfaces de los repositorios. No depende de ninguna otra capa.

2. **Application (Aplicación)**: Contiene los casos de uso que orquestan la lógica de negocio. Depende solo de la capa de dominio.

3. **Infrastructure (Infraestructura)**: Contiene las implementaciones concretas (repositorios, bases de datos, servicios externos). Depende de domain y application.

4. **Presentation (Presentación)**: Contiene el punto de entrada (Lambda handler). Depende de todas las demás capas.

## 📦 Requisitos

- Node.js 18.x o superior
- Docker y Docker Compose
- AWS CLI (opcional, para invocar Lambda desde terminal)
- VS Code (recomendado para debugging)

## 🚀 Instalación

1. **Clonar o copiar el proyecto**

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=Users

# Lambda Configuration
LAMBDA_FUNCTION_NAME=user-handler
LAMBDA_ROLE_ARN=arn:aws:iam::000000000000:role/lambda-role
```

4. **Iniciar LocalStack**

```bash
docker-compose up -d
```

Verificar que LocalStack está corriendo:

```bash
docker ps
```

5. **Inicializar DynamoDB**

```bash
npm run init-db
```

Para recrear la tabla si ya existe:

```bash
npm run init-db -- --force
```

## 🔨 Compilación y Despliegue

### Compilar con Webpack

```bash
# Compilación de producción
npm run build

# Compilación de desarrollo
npm run build:dev

# Compilación en modo watch
npm run watch
```

### Desplegar en LocalStack

```bash
npm run deploy
```

Este comando:
1. Compila el proyecto con webpack
2. Crea un rol IAM en LocalStack
3. Empaqueta la Lambda en un archivo ZIP
4. Crea o actualiza la función Lambda en LocalStack

## 🌐 Configurar API Gateway (Opcional pero Recomendado)

Si quieres probar tu Lambda con endpoints HTTP reales (como una API REST normal), puedes configurar API Gateway:

### Configuración Rápida

```bash
# 1. Asegúrate de que la Lambda está desplegada
npm run deploy

# 2. Configurar API Gateway
npm run setup-api  # Linux/Mac/Git Bash
# O
npm run setup-api:windows  # Windows PowerShell
```

El script creará una API REST con estos endpoints:
- `GET /` - Información de la API
- `POST /user` - Crear o obtener usuario
- `GET /user/{id}` - Obtener usuario por ID

### Uso

Después de ejecutar el setup, obtendrás un `API_ID`. Úsalo para hacer requests:

```bash
# Obtener API ID
cat .env.api

# Probar endpoints
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/

# Crear usuario
curl -X POST http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","name":"Test User","age":30}'
```

**📖 Para más detalles, ver [API-GATEWAY-GUIDE.md](./API-GATEWAY-GUIDE.md)**

### Ventajas de usar API Gateway

- ✅ Endpoints HTTP estándar (usa curl, Postman, navegador)
- ✅ Pruebas más realistas (igual que en producción)
- ✅ Fácil integración con frontend
- ✅ No necesitas invocar Lambda directamente

## 🧪 Testing

### Ejecutar Lambda localmente (sin desplegar)

```bash
npm run local
```

Este comando ejecuta la Lambda directamente en Node.js, útil para desarrollo rápido.

### Invocar Lambda desplegada en LocalStack

Usando el script de bash:

```bash
npm run invoke
```

Usando el script de TypeScript:

```bash
npm test
```

### Invocar manualmente con AWS CLI

```bash
# Obtener información de la API
aws --endpoint-url=http://localhost:4566 lambda invoke \
  --function-name user-handler \
  --payload '{"httpMethod":"GET","path":"/","headers":{},"body":null}' \
  output.json

# Crear usuario
aws --endpoint-url=http://localhost:4566 lambda invoke \
  --function-name user-handler \
  --payload '{"httpMethod":"POST","path":"/user","headers":{"Content-Type":"application/json"},"body":"{\"email\":\"test@example.com\",\"name\":\"Test User\",\"age\":30}"}' \
  output.json

cat output.json | jq '.'
```

## 🐛 Debugging

### Debugging Local con VS Code

Este proyecto incluye configuraciones de debugging para VS Code:

1. **Debug Lambda Local**: Ejecuta y debuggea la Lambda localmente sin desplegarla
2. **Debug Lambda Handler**: Alternativa para debuggear el handler
3. **Debug Init DB**: Debuggea el script de inicialización de la base de datos
4. **Debug Test Lambda**: Debuggea los tests de la Lambda desplegada

#### Pasos para debugging:

1. Asegúrate de que LocalStack está corriendo (`docker-compose up -d`)
2. Abre el archivo que deseas debuggear
3. Coloca breakpoints en el código
4. Ve a la vista de Debug (Ctrl+Shift+D o Cmd+Shift+D)
5. Selecciona la configuración de debug deseada
6. Presiona F5 o haz clic en "Start Debugging"

#### Tips de Debugging:

- **Source Maps**: El proyecto genera source maps para poder debuggear TypeScript directamente
- **Variables de entorno**: Las configuraciones de debug incluyen las variables de entorno necesarias
- **Console integrada**: Los logs se muestran en la terminal integrada de VS Code
- **Breakpoints**: Puedes colocar breakpoints en cualquier archivo TypeScript

### Debugging con Logs

La Lambda genera logs detallados que puedes ver en:

1. **Console de LocalStack**:
```bash
docker logs -f localstack-lambda
```

2. **CloudWatch Logs** (en LocalStack):
```bash
aws --endpoint-url=http://localhost:4566 logs tail /aws/lambda/user-handler
```

## 📚 API Endpoints

La Lambda expone los siguientes endpoints:

### GET /

Retorna información sobre la API.

**Respuesta:**
```json
{
  "message": "User Lambda API",
  "endpoints": {
    "GET /user/{id}": "Obtener usuario por ID",
    "POST /user": "Crear o obtener usuario por email"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /user/{id}

Obtiene un usuario por su ID.

**Parámetros:**
- `id` (path): ID del usuario

**Respuesta exitosa (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "age": 30,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Respuesta si no existe (404):**
```json
{
  "error": "Not Found",
  "message": "User with ID {id} not found"
}
```

### POST /user

Crea un nuevo usuario o retorna el existente si el email ya está registrado.

**Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "age": 30
}
```

**Respuesta si se crea (201):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "created": true,
  "message": "User created successfully"
}
```

**Respuesta si ya existe (200):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "created": false,
  "message": "User already exists"
}
```

## 🛠️ Scripts Disponibles

- `npm run build`: Compilar para producción con webpack
- `npm run build:dev`: Compilar para desarrollo
- `npm run watch`: Compilar en modo watch
- `npm run init-db`: Inicializar tabla de DynamoDB
- `npm run deploy`: Compilar y desplegar en LocalStack
- `npm run invoke`: Invocar Lambda con tests predefinidos (bash)
- `npm test`: Probar Lambda desplegada (TypeScript)
- `npm run local`: Ejecutar Lambda localmente sin desplegar
- `npm run clean`: Limpiar archivos compilados

## 📁 Estructura del Proyecto

```
localstack_lambda/
├── .vscode/
│   ├── launch.json          # Configuración de debugging
│   └── settings.json        # Configuración de VS Code
├── scripts/
│   ├── init-dynamodb.ts     # Script para inicializar DynamoDB
│   ├── deploy-lambda.sh     # Script para desplegar Lambda
│   ├── invoke-lambda.sh     # Script para invocar Lambda
│   └── test-lambda.ts       # Script para probar Lambda
├── src/
│   ├── domain/              # Capa de dominio
│   ├── application/         # Capa de aplicación (casos de uso)
│   ├── infrastructure/      # Capa de infraestructura
│   ├── presentation/        # Capa de presentación (handlers)
│   └── local.ts            # Ejecutor local para desarrollo
├── .gitignore
├── docker-compose.yml       # Configuración de LocalStack
├── package.json
├── tsconfig.json           # Configuración de TypeScript
├── webpack.config.js       # Configuración de Webpack
└── README.md
```

## 🔍 Troubleshooting

### LocalStack no inicia

```bash
# Verificar logs
docker logs localstack-lambda

# Reiniciar LocalStack
docker-compose down
docker-compose up -d
```

### Error al desplegar Lambda

```bash
# Verificar que la compilación fue exitosa
ls -la dist/

# Reconstruir
npm run clean
npm run build
npm run deploy
```

### La Lambda no encuentra la tabla de DynamoDB

```bash
# Verificar que la tabla existe
aws --endpoint-url=http://localhost:4566 dynamodb list-tables

# Recrear la tabla
npm run init-db -- --force
```

### Debugging no funciona

1. Verificar que LocalStack está corriendo
2. Verificar que la tabla de DynamoDB existe
3. Revisar las variables de entorno en `.vscode/launch.json`
4. Verificar que los source maps están generados (`dist/*.js.map`)

## 🎯 Próximos Pasos

- Agregar más casos de uso (actualizar, eliminar usuarios)
- Implementar validaciones con bibliotecas como Joi o Zod
- Agregar tests unitarios con Jest
- Implementar CI/CD
- Agregar API Gateway con LocalStack
- Implementar autenticación y autorización

## 📝 Notas

- Este proyecto usa LocalStack para emular servicios de AWS localmente
- Los IDs de AWS (como el rol ARN) usan el formato de LocalStack: `000000000000`
- El source map está habilitado para facilitar el debugging
- Webpack está configurado para incluir todas las dependencias (incluyendo AWS SDK) para compatibilidad con LocalStack

## 📄 Licencia

MIT

