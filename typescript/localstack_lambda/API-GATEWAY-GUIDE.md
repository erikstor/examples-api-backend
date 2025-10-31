# 🌐 Guía de API Gateway con LocalStack

Esta guía explica cómo usar API Gateway con tu Lambda en LocalStack para hacer pruebas con endpoints HTTP reales.

## ¿Por qué necesitas API Gateway?

### Sin API Gateway (Invocación directa de Lambda)
```bash
# Tienes que invocar la Lambda directamente con AWS CLI
aws lambda invoke --function-name user-handler --payload '{...}' output.json
```

### Con API Gateway (Endpoints HTTP)
```bash
# Puedes usar URLs HTTP normales con curl, Postman, navegador, etc.
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user
```

**Ventajas de API Gateway**:
- ✅ URLs HTTP estándar (como una API REST normal)
- ✅ Pruebas más realistas (igual que en producción)
- ✅ Puedes usar curl, Postman, navegador
- ✅ Más fácil de integrar con frontend
- ✅ Manejo automático de requests/responses HTTP

## Configuración Rápida

### 1. Asegúrate de que LocalStack está corriendo

```bash
docker-compose up -d
```

### 2. Despliega tu Lambda primero

```bash
# Compilar y desplegar Lambda
npm run build
npm run deploy
```

### 3. Configura API Gateway

**En Linux/Mac/Git Bash:**
```bash
npm run setup-api
```

**En Windows PowerShell:**
```powershell
npm run setup-api:windows
```

Esto creará:
- ✅ Una API REST llamada "user-api"
- ✅ Tres endpoints HTTP:
  - `GET /` - Info de la API
  - `POST /user` - Crear o obtener usuario
  - `GET /user/{id}` - Obtener usuario por ID
- ✅ Integración con tu Lambda
- ✅ Permisos necesarios

### 4. Obtén tu API ID

El script mostrará el `API_ID` al finalizar. También se guarda en `.env.api`:

```bash
cat .env.api
# API_GATEWAY_ID=abc123xyz
```

### 5. Prueba tus endpoints

```bash
# Reemplaza {API_ID} con tu ID real
export API_ID=abc123xyz

# Obtener info de la API
curl http://localhost:4566/restapis/$API_ID/dev/_user_request_/

# Crear usuario
curl -X POST http://localhost:4566/restapis/$API_ID/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","name":"Test User","age":30}'

# Obtener usuario (reemplaza {user-id} con un ID real)
curl http://localhost:4566/restapis/$API_ID/dev/_user_request_/user/{user-id}
```

## Estructura de URLs en LocalStack

LocalStack usa un formato especial para las URLs:

```
http://localhost:4566/restapis/{API_ID}/{STAGE}/_user_request_/{PATH}
```

Donde:
- `{API_ID}`: El ID único de tu API (ej: `abc123xyz`)
- `{STAGE}`: El stage de deployment (ej: `dev`, `prod`)
- `{PATH}`: El path del recurso (ej: `user`, `user/123`)

**Ejemplo completo:**
```
http://localhost:4566/restapis/abc123xyz/dev/_user_request_/user
```

## Endpoints Disponibles

### 1. GET / - Información de la API

**Request:**
```bash
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/
```

**Response:**
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

### 2. POST /user - Crear o Obtener Usuario

**Request:**
```bash
curl -X POST http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "age": 30
  }'
```

**Response (usuario creado - 201):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "created": true,
  "message": "User created successfully"
}
```

**Response (usuario ya existe - 200):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "created": false,
  "message": "User already exists"
}
```

### 3. GET /user/{id} - Obtener Usuario por ID

**Request:**
```bash
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user/123e4567-e89b-12d3-a456-426614174000
```

**Response (usuario encontrado - 200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "age": 30,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (usuario no encontrado - 404):**
```json
{
  "error": "Not Found",
  "message": "User with ID {id} not found"
}
```

## Usando el Archivo requests-api-gateway.http

El proyecto incluye un archivo `requests-api-gateway.http` con ejemplos listos para usar.

### Configuración

1. Abre `requests-api-gateway.http`
2. Reemplaza `YOUR_API_ID_HERE` con tu API ID real:

```http
@apiId = abc123xyz
```

3. Usa la extensión **REST Client** en VS Code para ejecutar los requests

### Ejecutar Requests

1. Abre `requests-api-gateway.http` en VS Code
2. Haz clic en "Send Request" encima de cualquier request
3. Verás la respuesta en una ventana lateral

## Uso con Postman

### 1. Importar Collection

Puedes crear una collection en Postman con estos endpoints:

**Environment Variables:**
```
baseUrl = http://localhost:4566/restapis/{API_ID}/dev/_user_request_
```

**Requests:**

- **GET** `{{baseUrl}}/`
- **POST** `{{baseUrl}}/user`
  - Body (raw JSON):
    ```json
    {
      "email": "test@example.com",
      "name": "Test User",
      "age": 30
    }
    ```
- **GET** `{{baseUrl}}/user/{user-id}`

### 2. Probar

1. Crea un nuevo Environment en Postman
2. Agrega la variable `baseUrl` con tu API ID
3. Ejecuta los requests

## Comandos Útiles de AWS CLI

### Listar todas las APIs

```bash
aws --endpoint-url=http://localhost:4566 apigateway get-rest-apis
```

### Obtener información de una API específica

```bash
aws --endpoint-url=http://localhost:4566 \
  apigateway get-rest-api \
  --rest-api-id {API_ID}
```

### Listar recursos de una API

```bash
aws --endpoint-url=http://localhost:4566 \
  apigateway get-resources \
  --rest-api-id {API_ID}
```

### Listar métodos de un recurso

```bash
aws --endpoint-url=http://localhost:4566 \
  apigateway get-method \
  --rest-api-id {API_ID} \
  --resource-id {RESOURCE_ID} \
  --http-method GET
```

### Ver deployments

```bash
aws --endpoint-url=http://localhost:4566 \
  apigateway get-deployments \
  --rest-api-id {API_ID}
```

### Eliminar API

```bash
aws --endpoint-url=http://localhost:4566 \
  apigateway delete-rest-api \
  --rest-api-id {API_ID}
```

## Reconfigurar API Gateway

Si necesitas recrear la API:

```bash
# 1. Eliminar API existente (opcional)
aws --endpoint-url=http://localhost:4566 \
  apigateway delete-rest-api \
  --rest-api-id {API_ID}

# 2. Crear nueva API
npm run setup-api
```

## Diferencias entre Invocación Directa y API Gateway

### Invocación Directa de Lambda

```bash
# Payload debe incluir toda la estructura del evento
aws lambda invoke \
  --function-name user-handler \
  --payload '{"httpMethod":"POST","path":"/user","body":"{...}"}' \
  output.json
```

**Ventajas:**
- Más directo
- Útil para pruebas de la Lambda

**Desventajas:**
- No es realista (en producción usas API Gateway)
- Payload más complejo
- No puedes usar herramientas HTTP estándar

### Con API Gateway

```bash
# Request HTTP normal
curl -X POST http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","name":"Test User"}'
```

**Ventajas:**
- ✅ Realista (igual que en producción)
- ✅ Request HTTP estándar
- ✅ Puedes usar curl, Postman, navegador
- ✅ Fácil integración con frontend
- ✅ Manejo automático de CORS, autenticación, etc.

**Desventajas:**
- Requiere configuración inicial

## Debugging con API Gateway

### Ver logs de API Gateway

```bash
# Ver logs del contenedor de LocalStack
docker logs -f localstack-lambda

# Filtrar por API Gateway
docker logs localstack-lambda 2>&1 | grep -i apigateway
```

### Verificar integración Lambda-API Gateway

```bash
# Ver configuración de integración
aws --endpoint-url=http://localhost:4566 \
  apigateway get-integration \
  --rest-api-id {API_ID} \
  --resource-id {RESOURCE_ID} \
  --http-method POST
```

### Verificar permisos

```bash
# Ver política de la Lambda
aws --endpoint-url=http://localhost:4566 \
  lambda get-policy \
  --function-name user-handler
```

## Problemas Comunes

### 1. Error: "Internal Server Error"

**Causa**: La Lambda no está desplegada o tiene errores

**Solución**:
```bash
# Verificar que la Lambda existe
aws --endpoint-url=http://localhost:4566 lambda list-functions

# Redesplegar Lambda
npm run build
npm run deploy
```

### 2. Error: "Missing Authentication Token"

**Causa**: API ID incorrecto o ruta incorrecta

**Solución**:
- Verifica tu API ID: `cat .env.api`
- Usa el formato correcto: `/restapis/{API_ID}/dev/_user_request_/{path}`

### 3. Error: "403 Forbidden"

**Causa**: Permisos no configurados

**Solución**:
```bash
# Ejecutar nuevamente el setup
npm run setup-api
```

### 4. API Gateway no responde

**Causa**: LocalStack no tiene API Gateway habilitado

**Solución**:
```bash
# Verificar que API Gateway está en SERVICES
docker-compose down
docker-compose up -d
```

## Flujo de Trabajo Completo

### Setup Inicial (una vez)

```bash
# 1. Iniciar LocalStack
docker-compose up -d

# 2. Inicializar DynamoDB
npm run init-db

# 3. Compilar y desplegar Lambda
npm run build
npm run deploy

# 4. Configurar API Gateway
npm run setup-api

# 5. Guardar API ID
cat .env.api
```

### Desarrollo (día a día)

```bash
# 1. Hacer cambios en el código

# 2. Recompilar y redesplegar Lambda
npm run build
npm run deploy

# 3. Probar endpoints (el API Gateway no cambia)
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user
```

### Testing

```bash
# Opción 1: Con curl
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/

# Opción 2: Con archivo .http
# Abrir requests-api-gateway.http y ejecutar

# Opción 3: Con Postman
# Importar collection y ejecutar
```

## Próximos Pasos

Una vez que tengas API Gateway funcionando, puedes:

1. **Agregar más endpoints**: Modificar `setup-api-gateway.sh` para agregar más rutas
2. **Implementar CORS**: Agregar configuración de CORS a los métodos
3. **Agregar autenticación**: Configurar authorizers (Cognito, Lambda)
4. **Custom domains**: Configurar dominios personalizados
5. **Request/Response transformations**: Agregar mapeos de datos
6. **Rate limiting**: Implementar throttling
7. **API Keys**: Agregar keys para control de acceso

## Recursos

- [AWS API Gateway Docs](https://docs.aws.amazon.com/apigateway/)
- [LocalStack API Gateway](https://docs.localstack.cloud/user-guide/aws/apigateway/)
- [API Gateway REST API Reference](https://docs.aws.amazon.com/apigateway/latest/api/API_Operations.html)

## Conclusión

Con API Gateway configurado, ahora puedes:

✅ Probar tu Lambda con endpoints HTTP reales  
✅ Usar herramientas estándar (curl, Postman, navegador)  
✅ Hacer pruebas más realistas  
✅ Integrar fácilmente con frontend  
✅ Simular un entorno de producción completo  

**¡Tu Lambda ahora tiene una API REST completa!** 🎉

