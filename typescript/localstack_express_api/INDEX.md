# 📖 Índice de Documentación

Bienvenido al proyecto **LocalStack DynamoDB CRUD**. Esta es una guía completa de toda la documentación disponible.

## 🚀 ¿Por dónde empiezo?

### Si nunca has usado el proyecto
👉 Empieza con **[QUICKSTART.md](QUICKSTART.md)** - Guía de 5 minutos

### Si estás en Windows
👉 Lee **[WINDOWS-GUIDE.md](WINDOWS-GUIDE.md)** - Guía específica para Windows

### Si quieres entender qué hace el proyecto
👉 Revisa **[RESUMEN.md](RESUMEN.md)** - Estado actual y características

### Si quieres documentación completa
👉 Consulta **[README.md](README.md)** - Documentación detallada

## 📚 Documentación Disponible

| Archivo | Descripción | Para quién |
|---------|-------------|------------|
| **[README.md](README.md)** | Documentación completa del proyecto con todos los detalles | Todos |
| **[QUICKSTART.md](QUICKSTART.md)** | Guía rápida de 5 minutos para empezar | Principiantes |
| **[RESUMEN.md](RESUMEN.md)** | Estado actual, estructura y próximos pasos | Resumen general |
| **[WINDOWS-GUIDE.md](WINDOWS-GUIDE.md)** | Guía específica para usuarios de Windows | Usuarios Windows |
| **[DEBUG_GUIDE.md](DEBUG_GUIDE.md)** | 🐛 Cómo usar el debugger de VS Code/Cursor | Desarrolladores |
| **[DEBUG_TROUBLESHOOTING.md](DEBUG_TROUBLESHOOTING.md)** | 🔧 Solución de problemas de debugging | Si tienes errores |
| **[TEST_COMMANDS.md](TEST_COMMANDS.md)** | Comandos para probar la API con cURL | Testing |
| **[AWS_CLI_COMMANDS.md](AWS_CLI_COMMANDS.md)** | Referencia de comandos AWS CLI | Usuarios avanzados |

## 🛠️ Archivos de Configuración

| Archivo | Descripción |
|---------|-------------|
| `docker-compose.yml` | Configuración de LocalStack |
| `package.json` | Dependencias y scripts npm |
| `tsconfig.json` | Configuración de TypeScript |
| `.env` / `env.example` | Variables de entorno |
| `.vscode/launch.json` | 🐛 Configuraciones de debugging |
| `.vscode/tasks.json` | Tareas automatizadas de VS Code |
| `.vscode/settings.json` | Configuración del editor |

## 🧪 Herramientas de Testing

| Archivo | Herramienta | Descripción |
|---------|-------------|-------------|
| `requests.http` | REST Client (VS Code) | Tests interactivos en VS Code |
| `postman_collection.json` | Postman | Colección importable a Postman |
| `scripts/test-crud.ts` | Script Node | Tests automatizados |

## 📂 Estructura del Código

```
src/
├── app.ts                    # 🚀 Servidor Express principal
├── config/
│   └── dynamodb.ts           # ⚙️  Cliente DynamoDB configurado
├── models/
│   └── User.ts               # 📋 Definición del modelo User
├── services/
│   └── UserService.ts        # 💼 Lógica de negocio CRUD
├── controllers/
│   └── UserController.ts     # 🎮 Controladores HTTP
└── routes/
    └── userRoutes.ts         # 🛣️  Definición de rutas API
```

## 🎯 Guías por Caso de Uso

### 1. Quiero empezar rápido (5 minutos)
```
📖 Lee: QUICKSTART.md
```

### 2. Estoy en Windows y tengo dudas
```
📖 Lee: WINDOWS-GUIDE.md
```

### 3. Quiero probar la API con diferentes herramientas
```
📖 Lee: TEST_COMMANDS.md
🔧 Usa: requests.http (VS Code)
📦 Importa: postman_collection.json (Postman)
```

### 4. Quiero usar AWS CLI directamente
```
📖 Lee: AWS_CLI_COMMANDS.md
```

### 5. Quiero entender todo el proyecto
```
📖 Lee: README.md (documentación completa)
```

### 6. Quiero modificar el código
```
📖 Lee: README.md - Sección "Estructura del Proyecto"
📂 Explora: src/
🐛 Debug: Lee DEBUG_GUIDE.md y usa F5
```

### 7. Quiero ver qué se ha hecho hasta ahora
```
📖 Lee: RESUMEN.md
```

## 🚦 Flujo Recomendado

### Para Principiantes

1. **Lee** → [QUICKSTART.md](QUICKSTART.md)
2. **Ejecuta** → `docker-compose up -d`
3. **Inicializa** → `npm run init-db`
4. **Prueba** → `npm run test-crud`
5. **Inicia** → `npm run dev`
6. **Explora** → Usa `requests.http` en VS Code

### Para Usuarios de Windows

1. **Lee** → [WINDOWS-GUIDE.md](WINDOWS-GUIDE.md)
2. **Sigue** → Las instrucciones específicas para Windows
3. **Prueba** → Con PowerShell o Git Bash

### Para Desarrolladores

1. **Lee** → [README.md](README.md)
2. **Entiende** → La arquitectura en `src/`
3. **Modifica** → El código según necesites
4. **Prueba** → Con `npm run test-crud`

### Para DevOps/Infraestructura

1. **Lee** → [AWS_CLI_COMMANDS.md](AWS_CLI_COMMANDS.md)
2. **Revisa** → `docker-compose.yml`
3. **Configura** → Variables en `.env`
4. **Despliega** → Adapta para producción

## 📊 Diagramas y Conceptos

### Flujo de una Petición HTTP

```
Cliente → Express → UserController → UserService → DynamoDB (LocalStack)
   ↑                                                          ↓
   └────────────────────── Response ←───────────────────────┘
```

### Arquitectura del Proyecto

```
┌─────────────────────────────────────────┐
│         Cliente (cURL/Postman)          │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│    Express API (localhost:3000)         │
│  ┌────────────────────────────────┐     │
│  │ Controllers (HTTP Layer)       │     │
│  └──────────┬─────────────────────┘     │
│             ↓                            │
│  ┌────────────────────────────────┐     │
│  │ Services (Business Logic)      │     │
│  └──────────┬─────────────────────┘     │
│             ↓                            │
│  ┌────────────────────────────────┐     │
│  │ AWS SDK (DynamoDB Client)      │     │
│  └──────────┬─────────────────────┘     │
└─────────────┼───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  LocalStack (localhost:4566)            │
│  ┌────────────────────────────────┐     │
│  │ DynamoDB Service               │     │
│  │  └─ Users Table                │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

## 🎓 Recursos de Aprendizaje

### Documentación Oficial
- [LocalStack Docs](https://docs.localstack.cloud/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Conceptos Clave
- **LocalStack**: Emulador de servicios AWS para desarrollo local
- **DynamoDB**: Base de datos NoSQL de AWS
- **CRUD**: Create, Read, Update, Delete
- **REST API**: Interfaz de programación basada en HTTP
- **TypeScript**: JavaScript con tipos estáticos

## 🆘 ¿Necesitas Ayuda?

### Problemas comunes
👉 Consulta la sección "Troubleshooting" en:
- [README.md](README.md) - Sección completa
- [WINDOWS-GUIDE.md](WINDOWS-GUIDE.md) - Específica para Windows
- [RESUMEN.md](RESUMEN.md) - Tabla rápida

### No encuentras algo
Usa la búsqueda de tu editor (Ctrl+F) en:
- README.md para búsqueda general
- Este archivo (INDEX.md) para navegar

## ✅ Checklist de Verificación

Antes de empezar, verifica que tienes:
- [ ] Docker Desktop instalado y corriendo
- [ ] Node.js 16+ instalado
- [ ] Git Bash o PowerShell
- [ ] Editor de código (VS Code recomendado)
- [ ] Puerto 4566 disponible (LocalStack)
- [ ] Puerto 3000 disponible (API)

## 🎯 Objetivos del Proyecto

Este proyecto demuestra:
- ✅ Configuración de LocalStack
- ✅ Integración con DynamoDB
- ✅ API REST con TypeScript
- ✅ Operaciones CRUD completas
- ✅ Buenas prácticas de desarrollo
- ✅ Documentación exhaustiva

## 🚀 Comandos Rápidos

```bash
# Setup inicial
docker-compose up -d
npm install
npm run init-db

# Desarrollo
npm run dev

# Testing
npm run test-crud
curl http://localhost:3000/health

# Detener
docker-compose down
```

## 📞 Contacto y Contribuciones

Este es un proyecto de ejemplo educativo. Siéntete libre de:
- 🔧 Modificarlo para tus necesidades
- 📝 Aprender de él
- 🚀 Usarlo como base para tus proyectos
- 💡 Mejorarlo y compartir tus cambios

---

**¿Listo para empezar?** 👉 Abre **[QUICKSTART.md](QUICKSTART.md)** o **[WINDOWS-GUIDE.md](WINDOWS-GUIDE.md)** si estás en Windows.

**¿Quieres detalles?** 👉 Lee **[README.md](README.md)** para documentación completa.

**¿Necesitas probar rápido?** 👉 Ejecuta `npm run test-crud` después del setup.

¡Disfruta programando! 🎉

