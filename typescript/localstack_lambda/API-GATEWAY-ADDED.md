# ✅ API Gateway Agregado al Proyecto

## ¿Qué agregué?

He añadido **soporte completo para API Gateway** a tu proyecto Lambda. Ahora puedes probar tu Lambda usando endpoints HTTP reales, igual que lo harías en producción.

## 📁 Archivos Nuevos Creados

### Scripts de Configuración

1. **`scripts/setup-api-gateway.sh`** (Linux/Mac/Git Bash)
   - Script para crear y configurar API Gateway en LocalStack
   - Crea recursos y métodos HTTP
   - Integra con tu Lambda
   - Configura permisos

2. **`scripts/setup-api-gateway.ps1`** (Windows PowerShell)
   - Versión de PowerShell del script anterior
   - Funcionalidad idéntica para usuarios de Windows

### Documentación

3. **`API-GATEWAY-GUIDE.md`**
   - Guía completa de cómo usar API Gateway
   - Explicación de endpoints
   - Ejemplos con curl y Postman
   - Troubleshooting
   - Comparación entre invocación directa vs API Gateway

4. **`requests-api-gateway.http`**
   - Archivo con requests de ejemplo para la extensión REST Client de VS Code
   - Listo para usar después de configurar API Gateway

## 🔄 Archivos Modificados

### `package.json`
Agregué nuevos scripts:
```json
"setup-api": "bash scripts/setup-api-gateway.sh",
"setup-api:windows": "pwsh scripts/setup-api-gateway.ps1",
"deploy:windows": "npm run build && pwsh scripts/deploy-lambda.ps1"
```

### `docker-compose.yml`
Agregué API Gateway a los servicios de LocalStack:
```yaml
SERVICES=lambda,dynamodb,iam,sts,logs,apigateway
```

### Documentación actualizada
- **README.md**: Nueva sección sobre API Gateway
- **QUICKSTART.md**: Opción C con API Gateway
- **INDEX.md**: Referencia a la guía de API Gateway
- **RESUMEN.md**: Información sobre API Gateway
- **`.gitignore`**: Agregado `.env.api` (guarda el API ID)

## 🚀 Cómo Usar API Gateway

### Paso 1: Desplegar Lambda

```bash
npm run build
npm run deploy
```

### Paso 2: Configurar API Gateway

**En Linux/Mac/Git Bash:**
```bash
npm run setup-api
```

**En Windows PowerShell:**
```powershell
npm run setup-api:windows
```

### Paso 3: Obtener API ID

El script mostrará el API ID al finalizar. También se guarda en `.env.api`:

```bash
cat .env.api
# API_GATEWAY_ID=abc123xyz
```

### Paso 4: Probar Endpoints

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

## 🎯 Endpoints Disponibles

Una vez configurado API Gateway, tienes 3 endpoints HTTP:

### 1. GET / - Info de la API
```bash
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/
```

### 2. POST /user - Crear o Obtener Usuario
```bash
curl -X POST http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","name":"Test User","age":30}'
```

### 3. GET /user/{id} - Obtener Usuario por ID
```bash
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user/123e4567...
```

## 💡 Ventajas de Usar API Gateway

### Sin API Gateway (antes)
```bash
# Tienes que invocar la Lambda directamente
aws lambda invoke \
  --function-name user-handler \
  --payload '{"httpMethod":"POST","path":"/user","body":"..."}' \
  output.json
```

### Con API Gateway (ahora)
```bash
# Usas endpoints HTTP normales
curl -X POST http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","name":"Test User"}'
```

**Beneficios**:
- ✅ URLs HTTP estándar
- ✅ Usa curl, Postman, navegador, o cualquier cliente HTTP
- ✅ Más realista (igual que en producción)
- ✅ Fácil integración con frontend
- ✅ No necesitas AWS CLI para probar
- ✅ Requests más simples

## 📖 Documentación

Lee estos archivos para más información:

1. **[API-GATEWAY-GUIDE.md](./API-GATEWAY-GUIDE.md)** - Guía completa y detallada
2. **[QUICKSTART.md](./QUICKSTART.md)** - Actualizado con información de API Gateway
3. **[README.md](./README.md)** - Nueva sección sobre API Gateway

## 🧪 Opciones de Testing

Ahora tienes **3 formas** de probar tu Lambda:

### Opción 1: Ejecución Local (Desarrollo rápido)
```bash
npm run local
```
- ✅ Más rápido
- ✅ Ideal para desarrollo
- ✅ Debugging con VS Code (F5)

### Opción 2: Invocación Directa (Testing de Lambda)
```bash
npm run deploy
npm test
```
- ✅ Prueba la Lambda desplegada
- ✅ Útil para verificar el deployment

### Opción 3: API Gateway (Testing realista) ⭐ NUEVO
```bash
npm run setup-api
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user
```
- ✅ Endpoints HTTP reales
- ✅ Más realista (igual que producción)
- ✅ Fácil de usar con curl, Postman, etc.
- ✅ **Recomendado para testing completo**

## 🛠️ Herramientas Compatibles

Con API Gateway puedes usar:

### curl
```bash
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/user
```

### VS Code REST Client
Abre `requests-api-gateway.http` y ejecuta requests con un clic

### Postman
Crea una collection con los endpoints y prueba

### Navegador Web
Para endpoints GET, simplemente abre la URL en el navegador

### Cualquier cliente HTTP
fetch, axios, HttpClient, etc.

## 🔍 Comandos Útiles

### Ver todas las APIs
```bash
aws --endpoint-url=http://localhost:4566 apigateway get-rest-apis
```

### Ver recursos de una API
```bash
aws --endpoint-url=http://localhost:4566 \
  apigateway get-resources \
  --rest-api-id {API_ID}
```

### Eliminar API
```bash
aws --endpoint-url=http://localhost:4566 \
  apigateway delete-rest-api \
  --rest-api-id {API_ID}
```

### Recrear API
```bash
# Eliminar y recrear
aws --endpoint-url=http://localhost:4566 \
  apigateway delete-rest-api \
  --rest-api-id {API_ID}

npm run setup-api
```

## 🎓 Ejemplo Completo de Uso

### 1. Setup inicial (una vez)
```bash
# Iniciar todo
./start.ps1  # o bash start.sh

# Desplegar Lambda
npm run build
npm run deploy

# Configurar API Gateway
npm run setup-api
```

### 2. Guardar API ID
```bash
# Ver API ID
cat .env.api
# API_GATEWAY_ID=xyz123

# Exportar para uso fácil
export API_ID=xyz123
```

### 3. Crear usuarios
```bash
# Crear primer usuario
curl -X POST http://localhost:4566/restapis/$API_ID/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","name":"John Doe","age":30}'

# Guardar el ID del usuario de la respuesta
# Respuesta: {"user":{"id":"abc123...",...},"created":true,...}
```

### 4. Obtener usuarios
```bash
# Obtener usuario por ID
curl http://localhost:4566/restapis/$API_ID/dev/_user_request_/user/abc123...

# Intentar crear el mismo usuario (debería retornar el existente)
curl -X POST http://localhost:4566/restapis/$API_ID/dev/_user_request_/user \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","name":"John Doe","age":30}'
# Respuesta: {"user":{...},"created":false,"message":"User already exists"}
```

## 🎉 ¡Ya está todo listo!

Tu proyecto ahora incluye:
- ✅ Lambda con TypeScript
- ✅ DynamoDB para persistencia
- ✅ LocalStack para desarrollo local
- ✅ **API Gateway con endpoints HTTP reales**
- ✅ Arquitectura en capas
- ✅ Debugging con VS Code
- ✅ Documentación completa

## 📚 Próximos Pasos

Ahora que tienes API Gateway, puedes:

1. **Integrar con un frontend**
   - Crear una app web que consuma tu API
   - Usar fetch o axios para hacer requests

2. **Agregar más endpoints**
   - PUT /user/{id} - Actualizar usuario
   - DELETE /user/{id} - Eliminar usuario
   - GET /users - Listar todos los usuarios

3. **Implementar CORS**
   - Configurar CORS en API Gateway
   - Permitir requests desde tu frontend

4. **Agregar autenticación**
   - Configurar Cognito o Lambda Authorizers
   - Proteger tus endpoints

5. **Desplegar en AWS real**
   - Cambiar endpoint a AWS real
   - Usar AWS CLI para deployment en producción

## ❓ ¿Necesitas Ayuda?

- Lee **[API-GATEWAY-GUIDE.md](./API-GATEWAY-GUIDE.md)** para detalles completos
- Revisa los ejemplos en **`requests-api-gateway.http`**
- Consulta la sección de troubleshooting en la guía
- Verifica logs: `docker logs localstack-lambda`

---

**¡Disfruta tu Lambda con API Gateway!** 🚀

