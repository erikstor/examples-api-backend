# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a poner en marcha el proyecto en menos de 5 minutos.

## Pasos Rápidos

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Iniciar LocalStack

```bash
docker-compose up -d
```

Espera unos segundos hasta que LocalStack esté completamente iniciado.

### 3. Crear Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DYNAMODB_TABLE_NAME=Users
LAMBDA_FUNCTION_NAME=user-handler
LAMBDA_ROLE_ARN=arn:aws:iam::000000000000:role/lambda-role
```

### 4. Inicializar la Base de Datos

```bash
npm run init-db
```

### 5. Opción A: Ejecutar Lambda Localmente (Recomendado para Desarrollo)

```bash
npm run local
```

Esto ejecutará la Lambda directamente sin necesidad de desplegarla. Ideal para desarrollo rápido y debugging.

### 6. Opción B: Desplegar y Probar Lambda en LocalStack

```bash
# Compilar y desplegar
npm run deploy

# Probar la Lambda desplegada
npm test
```

### 7. Opción C: Usar API Gateway (Endpoints HTTP Reales)

```bash
# Compilar y desplegar Lambda
npm run build
npm run deploy

# Configurar API Gateway
npm run setup-api

# Guardar el API_ID que se muestra
# Luego probar con curl:
curl http://localhost:4566/restapis/{API_ID}/dev/_user_request_/
```

Ver [API-GATEWAY-GUIDE.md](./API-GATEWAY-GUIDE.md) para más detalles.

## 🐛 Debugging con VS Code

1. Presiona `F5` o ve a la vista de Debug
2. Selecciona "Debug Lambda Local"
3. La Lambda se ejecutará y podrás colocar breakpoints

## 🧪 Probar Manualmente

### Crear Usuario

```bash
npm run local
```

O si ya desplegaste en LocalStack:

```bash
aws --endpoint-url=http://localhost:4566 lambda invoke \
  --function-name user-handler \
  --payload '{"httpMethod":"POST","path":"/user","headers":{"Content-Type":"application/json"},"body":"{\"email\":\"test@example.com\",\"name\":\"Test User\",\"age\":30}"}' \
  output.json
```

## 📊 Verificar Estado

### Verificar LocalStack

```bash
docker ps
docker logs localstack-lambda
```

### Verificar Tablas DynamoDB

```bash
aws --endpoint-url=http://localhost:4566 dynamodb list-tables
```

### Verificar Lambda

```bash
aws --endpoint-url=http://localhost:4566 lambda list-functions
```

## 🛑 Detener Todo

```bash
docker-compose down
```

## 🆘 Problemas Comunes

### LocalStack no responde

```bash
docker-compose restart
```

### La tabla no existe

```bash
npm run init-db -- --force
```

### Error al compilar

```bash
npm run clean
npm run build
```

## ✅ ¡Listo!

Ahora puedes:
- Desarrollar localmente con `npm run local`
- Debuggear con VS Code (F5)
- Desplegar en LocalStack con `npm run deploy`
- Probar con `npm test`

Para más detalles, consulta el [README.md](./README.md).

