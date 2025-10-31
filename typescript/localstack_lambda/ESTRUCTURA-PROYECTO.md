# 📂 Estructura Completa del Proyecto

```
localstack_lambda/
│
├── 📖 DOCUMENTACIÓN
│   ├── README.md                      # Documentación principal completa
│   ├── RESUMEN.md                     # Resumen ejecutivo del proyecto
│   ├── INDEX.md                       # Índice de toda la documentación
│   ├── QUICKSTART.md                  # Guía de inicio rápido (5 min)
│   ├── ARCHITECTURE.md                # Explicación de arquitectura en capas
│   ├── API-GATEWAY-GUIDE.md          # Guía completa de API Gateway ⭐ NUEVO
│   ├── API-GATEWAY-ADDED.md          # Resumen de lo agregado ⭐ NUEVO
│   ├── WINDOWS-GUIDE.md              # Guía específica para Windows
│   └── ESTRUCTURA-PROYECTO.md        # Este archivo
│
├── 💻 CÓDIGO FUENTE (Arquitectura en Capas)
│   └── src/
│       ├── domain/                    # Capa de Dominio
│       │   ├── User.ts               # Entidades y modelos
│       │   └── IUserRepository.ts    # Interfaces de repositorios
│       │
│       ├── application/              # Capa de Aplicación (Casos de Uso)
│       │   ├── GetUserUseCase.ts     # Obtener usuario por ID
│       │   ├── CreateUserUseCase.ts  # Crear usuario
│       │   └── GetOrCreateUserUseCase.ts  # Obtener o crear usuario
│       │
│       ├── infrastructure/           # Capa de Infraestructura
│       │   ├── config/
│       │   │   └── dynamodb.ts      # Configuración de DynamoDB
│       │   └── repositories/
│       │       └── DynamoDBUserRepository.ts  # Implementación del repositorio
│       │
│       ├── presentation/             # Capa de Presentación
│       │   └── handler.ts           # Lambda Handler principal
│       │
│       └── local.ts                 # Script para ejecutar Lambda localmente
│
├── 🛠️ SCRIPTS
│   └── scripts/
│       ├── init-dynamodb.ts          # Inicializar tabla DynamoDB
│       ├── deploy-lambda.sh          # Desplegar Lambda (Bash)
│       ├── invoke-lambda.sh          # Invocar Lambda (Bash)
│       ├── test-lambda.ts            # Probar Lambda (TypeScript)
│       ├── setup-api-gateway.sh      # Configurar API Gateway (Bash) ⭐ NUEVO
│       └── setup-api-gateway.ps1     # Configurar API Gateway (PowerShell) ⭐ NUEVO
│
├── ⚙️ CONFIGURACIÓN
│   ├── package.json                  # Dependencias y scripts NPM
│   ├── tsconfig.json                # Configuración de TypeScript
│   ├── webpack.config.js            # Configuración de Webpack
│   ├── docker-compose.yml           # LocalStack con API Gateway ⭐ ACTUALIZADO
│   ├── .gitignore                   # Archivos ignorados por Git
│   ├── .env                         # Variables de entorno (crear manualmente)
│   └── .env.api                     # API Gateway ID (generado automáticamente) ⭐ NUEVO
│
├── 🔧 VS CODE
│   └── .vscode/
│       ├── launch.json              # Configuración de debugging
│       ├── settings.json            # Configuración del editor
│       └── extensions.json          # Extensiones recomendadas
│
├── 🧪 TESTING Y EJEMPLOS
│   ├── requests.http                # Requests de invocación directa de Lambda
│   └── requests-api-gateway.http    # Requests HTTP con API Gateway ⭐ NUEVO
│
├── 🚀 SCRIPTS DE INICIO
│   ├── start.sh                     # Iniciar proyecto (Bash)
│   ├── start.ps1                    # Iniciar proyecto (PowerShell)
│   ├── stop.sh                      # Detener proyecto (Bash)
│   └── stop.ps1                     # Detener proyecto (PowerShell)
│
└── 📦 GENERADOS (no incluidos en Git)
    ├── dist/                        # Código compilado por Webpack
    │   ├── index.js                # Lambda empaquetada
    │   └── index.js.map            # Source map para debugging
    ├── node_modules/               # Dependencias instaladas
    └── localstack-data/            # Datos persistentes de LocalStack
```

## 📊 Estadísticas del Proyecto

### Archivos de Código
- **Domain Layer**: 2 archivos
- **Application Layer**: 3 archivos (3 casos de uso)
- **Infrastructure Layer**: 2 archivos
- **Presentation Layer**: 1 archivo
- **Utilidades**: 1 archivo (local.ts)
- **Total**: **9 archivos TypeScript de código**

### Scripts
- **Setup/Deploy**: 2 archivos (bash + PowerShell)
- **API Gateway**: 2 archivos (bash + PowerShell) ⭐ NUEVO
- **Testing**: 3 archivos
- **Inicio/Parada**: 4 archivos
- **Total**: **13 scripts de automatización**

### Documentación
- **Guías principales**: 8 archivos Markdown
- **Ejemplos**: 2 archivos .http
- **Total**: **10 archivos de documentación**

### Configuración
- **Build**: 3 archivos (package.json, tsconfig.json, webpack.config.js)
- **Docker**: 1 archivo (docker-compose.yml)
- **VS Code**: 3 archivos
- **Total**: **7 archivos de configuración**

## 🎯 Archivos Clave por Funcionalidad

### Para Entender el Proyecto
1. **RESUMEN.md** - Vista general
2. **ARCHITECTURE.md** - Entender la arquitectura
3. **src/presentation/handler.ts** - Punto de entrada

### Para Empezar Rápidamente
1. **QUICKSTART.md** - Guía de 5 minutos
2. **start.ps1** o **start.sh** - Scripts de inicio
3. **.env** - Variables de entorno

### Para Desarrollo
1. **src/** - Todo el código fuente
2. **src/local.ts** - Ejecutar localmente
3. **.vscode/launch.json** - Debugging

### Para Testing con API Gateway ⭐
1. **API-GATEWAY-GUIDE.md** - Guía completa
2. **scripts/setup-api-gateway.sh** - Setup automático
3. **requests-api-gateway.http** - Ejemplos de requests

### Para Deployment
1. **scripts/deploy-lambda.sh** - Desplegar Lambda
2. **webpack.config.js** - Configuración de build
3. **docker-compose.yml** - LocalStack

## 🔄 Flujo de Archivos

### 1. Desarrollo
```
src/ → TypeScript → Webpack → dist/index.js
```

### 2. Deployment
```
dist/index.js → ZIP → LocalStack Lambda
```

### 3. API Gateway
```
Lambda → API Gateway → HTTP Endpoints
```

### 4. Testing Local
```
src/local.ts → Node.js → Ejecución directa
```

## 📝 Tipos de Archivos

| Extensión | Propósito | Cantidad |
|-----------|-----------|----------|
| `.ts` | Código TypeScript | 9 |
| `.md` | Documentación | 10 |
| `.json` | Configuración | 4 |
| `.js` | Configuración (webpack) | 1 |
| `.yml` | Docker Compose | 1 |
| `.sh` | Scripts Bash | 4 |
| `.ps1` | Scripts PowerShell | 3 |
| `.http` | Ejemplos de requests | 2 |

## 🎨 Convenciones de Nombres

### Archivos TypeScript
- **PascalCase**: Clases y casos de uso (`CreateUserUseCase.ts`)
- **camelCase**: Funciones y utilidades (`handler.ts`, `local.ts`)
- **kebab-case**: Configuración (`init-dynamodb.ts`)

### Archivos Markdown
- **UPPERCASE**: Documentación principal (`README.md`, `QUICKSTART.md`)
- **KEBAB-CASE**: Guías específicas (`API-GATEWAY-GUIDE.md`)

### Scripts
- **kebab-case.sh**: Scripts Bash (`setup-api-gateway.sh`)
- **kebab-case.ps1**: Scripts PowerShell (`setup-api-gateway.ps1`)
- **kebab-case.ts**: Scripts TypeScript (`init-dynamodb.ts`)

## 🌟 Nuevas Adiciones (API Gateway)

Los siguientes archivos fueron agregados para soporte de API Gateway:

1. ✨ **API-GATEWAY-GUIDE.md** - Guía completa
2. ✨ **API-GATEWAY-ADDED.md** - Resumen de cambios
3. ✨ **scripts/setup-api-gateway.sh** - Setup (Bash)
4. ✨ **scripts/setup-api-gateway.ps1** - Setup (PowerShell)
5. ✨ **requests-api-gateway.http** - Ejemplos de requests
6. 🔄 **docker-compose.yml** - Actualizado con apigateway
7. 🔄 **package.json** - Nuevos scripts añadidos
8. 🔄 **Documentación** - README, QUICKSTART, INDEX actualizados

## 📦 Dependencias

### Producción (dependencies)
```json
{
  "@aws-sdk/client-dynamodb": "SDK de DynamoDB",
  "@aws-sdk/lib-dynamodb": "Document client de DynamoDB",
  "uuid": "Generación de IDs únicos"
}
```

### Desarrollo (devDependencies)
```json
{
  "@types/aws-lambda": "Tipos para Lambda",
  "@types/node": "Tipos para Node.js",
  "@types/uuid": "Tipos para uuid",
  "dotenv": "Variables de entorno",
  "ts-loader": "Loader de TypeScript para Webpack",
  "ts-node": "Ejecutar TypeScript directamente",
  "typescript": "Compilador de TypeScript",
  "webpack": "Bundler",
  "webpack-cli": "CLI de Webpack"
}
```

## 🎓 Arquitectura del Código

```
┌─────────────────────────────────────┐
│  handler.ts (Presentation)          │ ← Lambda Handler
│  - Recibe eventos                   │
│  - Retorna respuestas HTTP          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Use Cases (Application)            │ ← Lógica de Negocio
│  - GetUserUseCase                   │
│  - CreateUserUseCase                │
│  - GetOrCreateUserUseCase           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  DynamoDBUserRepository             │ ← Implementación
│  (Infrastructure)                   │
│  - findById(), save(), etc.         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  IUserRepository (Domain)           │ ← Interfaces
│  User, UserEntity (Domain)          │
└─────────────────────────────────────┘
```

## 🔗 Dependencias entre Capas

```
Presentation
    ↓ depende de
Application
    ↓ depende de
Domain
    ↑ implementado por
Infrastructure
```

## 🚀 Scripts NPM Disponibles

```json
"build"           → Compilar con Webpack (producción)
"build:dev"       → Compilar en modo desarrollo
"watch"           → Compilar en modo watch
"init-db"         → Inicializar DynamoDB
"deploy"          → Desplegar Lambda (Bash)
"deploy:windows"  → Desplegar Lambda (PowerShell) ⭐ NUEVO
"setup-api"       → Configurar API Gateway (Bash) ⭐ NUEVO
"setup-api:windows" → Configurar API Gateway (PowerShell) ⭐ NUEVO
"invoke"          → Invocar Lambda (Bash)
"test"            → Probar Lambda (TypeScript)
"clean"           → Limpiar archivos compilados
"local"           → Ejecutar localmente
```

## 📌 Archivos que Debes Crear Manualmente

1. **`.env`** - Copiar desde `.env.example` (si existe) o crear con:
   ```env
   AWS_REGION=us-east-1
   AWS_ENDPOINT=http://localhost:4566
   AWS_ACCESS_KEY_ID=test
   AWS_SECRET_ACCESS_KEY=test
   DYNAMODB_TABLE_NAME=Users
   LAMBDA_FUNCTION_NAME=user-handler
   LAMBDA_ROLE_ARN=arn:aws:iam::000000000000:role/lambda-role
   ```

2. **`node_modules/`** - Ejecutar `npm install`

3. **`dist/`** - Ejecutar `npm run build`

## 📊 Complejidad del Proyecto

| Aspecto | Nivel |
|---------|-------|
| **Arquitectura** | ⭐⭐⭐⭐ Avanzada (Layered) |
| **TypeScript** | ⭐⭐⭐ Intermedio |
| **DevOps** | ⭐⭐⭐ Intermedio (Docker, LocalStack) |
| **Testing** | ⭐⭐ Básico (ejemplos incluidos) |
| **Documentación** | ⭐⭐⭐⭐⭐ Excelente |

## 🎯 Conclusión

Este proyecto incluye:
- ✅ **9 archivos** de código TypeScript bien organizado
- ✅ **13 scripts** de automatización
- ✅ **10 documentos** de guía y referencia
- ✅ **7 archivos** de configuración
- ✅ **Arquitectura profesional** en capas
- ✅ **API Gateway** completamente configurado ⭐
- ✅ **Debugging** completo con VS Code
- ✅ **Soporte** para Windows, Linux y Mac

**Total**: ~40 archivos de un proyecto Lambda profesional y listo para usar 🚀

