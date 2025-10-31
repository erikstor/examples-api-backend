# LocalStack DynamoDB CRUD Example

Este proyecto es un ejemplo completo de cómo crear una API REST con operaciones CRUD conectándose a DynamoDB de forma local usando LocalStack y Node.js/TypeScript.

## 🎯 Características

- ✅ API REST con Express y TypeScript
- ✅ CRUD completo para entidad de Usuarios
- ✅ Integración con DynamoDB usando AWS SDK v3
- ✅ LocalStack para desarrollo local
- ✅ Docker Compose para fácil configuración
- ✅ Scripts de inicialización y prueba
- ✅ Validaciones y manejo de errores
- ✅ 🐛 Debugging completo configurado para VS Code/Cursor

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- Docker y Docker Compose
- npm o yarn

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar LocalStack

```bash
docker-compose up -d
```

Esto iniciará LocalStack en el puerto 4566. Puedes verificar que está corriendo con:

```bash
docker ps
```

### 3. Inicializar la tabla de DynamoDB

```bash
npm run init-db
```

Si necesitas recrear la tabla (eliminarla y crearla de nuevo):

```bash
npm run init-db -- --force
```

### 4. Iniciar la aplicación

Modo desarrollo (con ts-node):
```bash
npm run dev
```

O compilar y ejecutar:
```bash
npm run build
npm start
```

La API estará disponible en `http://localhost:3000`

### 5. Probar las operaciones CRUD

Puedes ejecutar el script de pruebas automatizadas:

```bash
npm run test-crud
```

O probar manualmente con los endpoints HTTP (ver sección de Endpoints API más abajo).

## 📁 Estructura del Proyecto

```
localstack/
├── src/
│   ├── config/
│   │   └── dynamodb.ts         # Configuración del cliente DynamoDB
│   ├── models/
│   │   └── User.ts             # Modelo e interfaces de Usuario
│   ├── services/
│   │   └── UserService.ts      # Lógica de negocio CRUD
│   ├── controllers/
│   │   └── UserController.ts   # Controladores de rutas
│   ├── routes/
│   │   └── userRoutes.ts       # Definición de rutas
│   └── app.ts                  # Aplicación Express principal
├── scripts/
│   ├── init-dynamodb.ts        # Script de inicialización de tabla
│   └── test-crud.ts            # Script de pruebas CRUD
├── docker-compose.yml          # Configuración de LocalStack
├── .env                        # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 Endpoints API

### Health Check
```http
GET /health
```

### Crear Usuario
```http
POST /api/users
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "name": "John Doe",
  "age": 30
}
```

### Obtener Todos los Usuarios
```http
GET /api/users
```

### Obtener Usuario por ID
```http
GET /api/users/:id
```

### Actualizar Usuario
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "age": 31
}
```

### Eliminar Usuario
```http
DELETE /api/users/:id
```

## 📝 Ejemplos con cURL

### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "age": 25
  }'
```

### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/users
```

### Obtener usuario por ID
```bash
curl http://localhost:3000/api/users/USER_ID
```

### Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "age": 26
  }'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID
```

## 🔧 Configuración

Las variables de entorno se configuran en el archivo `.env`:

```env
# LocalStack Configuration
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# Application Configuration
PORT=3000
NODE_ENV=development

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=Users
```

## 🗄️ Esquema de DynamoDB

### Tabla: Users

- **Partition Key**: `id` (String)
- **Atributos**:
  - `id`: UUID único
  - `email`: Correo electrónico del usuario
  - `name`: Nombre completo
  - `age`: Edad (opcional)
  - `createdAt`: Timestamp de creación
  - `updatedAt`: Timestamp de última actualización

## 🧪 Testing

### Script de Pruebas Automatizadas

El script `test-crud.ts` ejecuta todas las operaciones CRUD:

```bash
npm run test-crud
```

Este script:
1. Crea 3 usuarios
2. Lee un usuario por ID
3. Lista todos los usuarios
4. Busca usuario por email
5. Actualiza un usuario
6. Elimina un usuario
7. Verifica las operaciones

## 🐛 Debugging con VS Code / Cursor

El proyecto incluye configuración completa de debugging para VS Code y Cursor.

### Inicio Rápido de Debugging

1. **Abre el archivo que quieras debuggear** (ej: `src/services/UserService.ts`)
2. **Pon un breakpoint** (click izquierdo del número de línea)
3. **Presiona F5** y selecciona `🚀 Debug API (Development)`
4. **Haz una petición HTTP** (desde otra terminal o con `requests.http`)
5. **El código se detendrá en tu breakpoint** ✨

### Configuraciones Disponibles

- `🚀 Debug API (Development)` - Debuggear la aplicación principal
- `🧪 Debug CRUD Tests` - Debuggear los tests
- `🔧 Debug Init DynamoDB` - Debuggear script de inicialización
- `🔌 Attach to Running Process` - Conectar a proceso en ejecución
- `🏗️  Debug API (Compiled)` - Debuggear código compilado

### Controles del Debugger

| Tecla | Acción |
|-------|--------|
| `F5` | Iniciar / Continuar |
| `F10` | Step Over (siguiente línea) |
| `F11` | Step Into (entrar en función) |
| `Shift+F11` | Step Out (salir de función) |
| `Shift+F5` | Stop |

**📖 Para más detalles:** Lee [DEBUG_GUIDE.md](DEBUG_GUIDE.md) o [DEBUGGING_QUICK_START.md](DEBUGGING_QUICK_START.md)

## 🐳 Comandos de Docker

### Iniciar LocalStack
```bash
docker-compose up -d
```

### Ver logs de LocalStack
```bash
docker-compose logs -f
```

### Detener LocalStack
```bash
docker-compose down
```

### Detener y eliminar datos persistentes
```bash
docker-compose down -v
rm -rf localstack-data/
```

## 🔍 Verificar LocalStack

Puedes usar AWS CLI para interactuar directamente con LocalStack:

```bash
# Listar tablas
aws dynamodb list-tables \
  --endpoint-url http://localhost:4566 \
  --region us-east-1

# Escanear tabla
aws dynamodb scan \
  --table-name Users \
  --endpoint-url http://localhost:4566 \
  --region us-east-1

# Obtener item
aws dynamodb get-item \
  --table-name Users \
  --key '{"id": {"S": "USER_ID"}}' \
  --endpoint-url http://localhost:4566 \
  --region us-east-1
```

## 🚨 Troubleshooting

### LocalStack no inicia
- Verifica que Docker esté corriendo
- Verifica que el puerto 4566 no esté en uso
- Revisa los logs: `docker-compose logs localstack`

### Error de conexión a DynamoDB
- Verifica que LocalStack esté corriendo: `docker ps`
- Verifica el endpoint en `.env`: debe ser `http://localhost:4566`
- Asegúrate de haber ejecutado `npm run init-db`

### Tabla no existe
- Ejecuta `npm run init-db` para crear la tabla
- O usa `npm run init-db -- --force` para recrearla

## 📚 Recursos

- [LocalStack Documentation](https://docs.localstack.cloud/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📄 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

