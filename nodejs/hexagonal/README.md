# Ejemplo de Registro de Usuarios - Arquitectura Hexagonal

Este ejemplo implementa un endpoint para registrar usuarios siguiendo los principios de la arquitectura hexagonal (también conocida como arquitectura de puertos y adaptadores).

## Estructura del Proyecto

```
src/
├── adapters/                    # Adaptadores secundarios (implementaciones)
│   └── repository/
│       └── DynamoUserRepository.ts
├── domain/                      # Lógica de negocio (núcleo)
│   ├── command_handlers/
│   │   └── RegisterUserCommandHandler.ts
│   ├── commands/
│   │   └── RegisterUserCommand.ts
│   ├── events/
│   │   └── UserRegisteredEvent.ts
│   ├── exceptions/
│   │   ├── constants/
│   │   │   ├── UserErrors.ts
│   │   │   └── SuccessMessages.ts
│   │   └── UserException.ts
│   ├── model/
│   │   └── User.ts
│   └── ports/
│       └── IUserRepository.ts
├── entrypoints/                 # Adaptadores primarios (puntos de entrada)
│   └── api/
│       ├── model/
│       │   └── RegisterUserRequest.ts
│       └── RegisterUserController.ts
├── infra/                       # Infraestructura
│   └── Logger.ts
└── index.ts                     # Punto de entrada principal

test/
├── adapters/                    # Pruebas de adaptadores
│   └── tests/
│       └── DynamoUserRepository.test.ts
├── domain/                      # Pruebas del dominio
│   └── tests/
│       └── User.test.ts
└── entrypoints/                 # Pruebas de puntos de entrada
    └── api/
        └── tests/
            └── RegisterUserController.test.ts
```

## Características Implementadas

### 1. Validación de Datos
- Validación de nombre (requerido, 2-50 caracteres)
- Validación de email (formato válido, requerido)
- Uso de `class-validator` para validaciones automáticas

### 2. Verificación de Unicidad
- Validación de que el email no exista previamente en la base de datos
- Manejo de errores específicos para emails duplicados

### 3. Arquitectura Hexagonal
- **Dominio**: Contiene la lógica de negocio pura
- **Puertos**: Interfaces que definen contratos
- **Adaptadores**: Implementaciones concretas de los puertos
- **Puntos de entrada**: Controladores que manejan las peticiones HTTP

### 4. Manejo de Errores
- Excepciones personalizadas para diferentes tipos de errores
- Respuestas HTTP apropiadas con códigos de estado correctos
- Logging estructurado

## Uso del Endpoint

### Request
```json
POST /users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

### Response Exitosa (201 Created)
```json
{
  "message": "Usuario registrado exitosamente",
  "data": {
    "userId": "user_1704067200000_abc123def",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Response de Error (409 Conflict - Email duplicado)
```json
{
  "error": "El correo electrónico ya está registrado",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Configuración

### Configuración de DynamoDB Local

Para desarrollo local, el proyecto incluye configuración completa para DynamoDB Local:

#### Configuración Automática (Recomendado)

**En Linux/macOS:**
```bash
# Dar permisos de ejecución al script
chmod +x scripts/setup-dynamodb.sh

# Ejecutar configuración automática
./scripts/setup-dynamodb.sh
```

**En Windows:**
```powershell
# Ejecutar configuración automática
.\scripts\setup-dynamodb.ps1
```

#### Configuración Manual
```bash
# 1. Levantar DynamoDB Local
docker-compose up -d

# 2. Crear tabla Users
node scripts/create-tables.js

# 3. Probar conexión
node scripts/test-connection.js
```

#### Servicios Disponibles
- **DynamoDB Local**: http://localhost:8000
- **DynamoDB Admin**: http://localhost:8001 (Interfaz web)

### Variables de Entorno
Copia el archivo `env.example` a `.env`:
```bash
cp env.example .env
```

Variables disponibles:
- `DYNAMODB_LOCAL`: true/false (para desarrollo local)
- `DYNAMODB_TABLE_NAME`: Nombre de la tabla (por defecto: Users)
- `AWS_REGION`: Región de AWS (por defecto: us-east-1)
- `AWS_ACCESS_KEY_ID`: Access Key (para local: 'local')
- `AWS_SECRET_ACCESS_KEY`: Secret Key (para local: 'local')

### Tabla DynamoDB
La tabla se crea automáticamente con la siguiente estructura:
- **Partition Key**: `id` (String)
- **Global Secondary Index**: `email-index` con `email` como partition key
- **Atributos**: name, email, createdAt, updatedAt

## Pruebas

### Ejecutar Pruebas Unitarias
```bash
npm test
```

### Ejecutar Pruebas Específicas
```bash
npm test -- --testPathPattern=test/domain/tests/User.test.ts
npm test -- --testPathPattern=test/entrypoints/api/tests/RegisterUserController.test.ts
npm test -- --testPathPattern=test/adapters/tests/DynamoUserRepository.test.ts
```

## Ejemplos de Uso

### Probar el Repositorio con DynamoDB Local
```bash
# Ejecutar ejemplo completo de CRUD
node scripts/example-usage.js
```

Este script demuestra:
- Crear usuarios
- Buscar por ID y email
- Actualizar usuarios
- Operaciones CRUD completas

### Verificar Estado de la Base de Datos
```bash
# Probar conexión y ver datos
node scripts/test-connection.js
```

## Beneficios de esta Arquitectura

1. **Separación de Responsabilidades**: La lógica de negocio está aislada de la infraestructura
2. **Testabilidad**: Fácil de probar con mocks y stubs
3. **Mantenibilidad**: Cambios en la infraestructura no afectan el dominio
4. **Escalabilidad**: Fácil agregar nuevos adaptadores o puntos de entrada
5. **Independencia de Frameworks**: El dominio no depende de frameworks específicos

## 🚀 Tecnologías Utilizadas

- **AWS SDK v3**: Versión más moderna y modular del SDK de AWS
  - `@aws-sdk/client-dynamodb`: Cliente principal de DynamoDB
  - `@aws-sdk/lib-dynamodb`: Document client para operaciones simplificadas
- **DynamoDB Local**: Base de datos local para desarrollo
- **TypeScript**: Tipado estático para mayor seguridad
- **Arquitectura Hexagonal**: Patrón de diseño para aplicaciones mantenibles

## Próximos Pasos

1. Implementar un event bus para manejar eventos de dominio
2. Agregar más validaciones de negocio
3. Implementar autenticación y autorización
4. Agregar más endpoints (GET, PUT, DELETE)
5. Implementar paginación para listados
6. Agregar documentación con OpenAPI/Swagger 
