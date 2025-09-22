# CLI Builder Architecture Generator

Una herramienta CLI en TypeScript para generar skeletons de proyectos con diferentes arquitecturas de software, enfocada en el desarrollo de lambdas de AWS.

## 🏗️ Arquitecturas Soportadas

- **🏛️ Layered Architecture (Arquitectura en Capas)**: Separación clara entre models, controller, services y utils
- **🧹 Clean Architecture**: Arquitectura limpia con separación de responsabilidades por capas concéntricas
- **🔷 Hexagonal Architecture**: Arquitectura hexagonal con puertos y adaptadores
- **☁️ AWS Hexagonal Architecture**: Implementación basada en las mejores prácticas de AWS
- **🔀 Hybrid Wally Architecture**: Arquitectura híbrida personalizada con estructura optimizada

## 🚀 Instalación

### Instalación Global
```bash
npm install -g cli-builder-arch
```

### Instalación Local
```bash
npm install cli-builder-arch
npx cli-builder create
```

## 📖 Uso

### Comando Básico
```bash
cli-builder create
```

### Flujo de Configuración
El CLI te guiará a través de un proceso interactivo:

1. **Selección de Arquitectura**: Elige entre las 5 arquitecturas disponibles
2. **Nombre del Proyecto**: Especifica el nombre de tu proyecto (solo letras, números, guiones y guiones bajos)
3. **Path Personalizado**: Opcionalmente especifica una ruta personalizada donde crear el proyecto
4. **Logger de Powertools**: Decide si incluir el logger de AWS Lambda Powertools
5. **Auditoría de Wally**: Decide si incluir las constantes de auditoría de Wally
6. **Generación**: El CLI genera automáticamente toda la estructura del proyecto

### Ejemplo de Uso Completo
```bash
$ cli-builder create

🏗️  Generador de Arquitecturas CLI

? ¿Qué arquitectura quieres usar? 🏛️  Layered Architecture (Arquitectura en Capas)
? ¿Cuál es el nombre de tu proyecto? mi-proyecto-lambda
? ¿Desea especificar un path personalizado para crear el proyecto? No
? ¿Desea agregar el logger de powertools? Yes
? ¿Desea agregar la auditoria de Wally? Yes

📁 Generando proyecto "mi-proyecto-lambda" con layered...

✅ ¡Proyecto generado exitosamente!

📂 Ubicación: ./mi-proyecto-lambda
🚀 Para empezar: cd mi-proyecto-lambda && npm install
```

## 🏛️ Layered Architecture

Genera una estructura con capas bien definidas:

```
src/
├── models/          # Modelos y DTOs
├── controller/      # Controladores
├── services/        # Servicios de negocio
├── utils/           # Utilidades, interfaces, excepciones
└── index.ts         # Punto de entrada Lambda
test/
```

## 🧹 Clean Architecture

Implementa los principios de Clean Architecture:

```
src/
├── domain/          # Modelos, errores, validadores, interfaces, puertos
├── infra/           # Servicios, repositorios, externos
├── app/             # Casos de uso, DTOs
├── utils/           # Utilidades
└── index.ts         # Punto de entrada Lambda
test/
```

## 🔷 Hexagonal Architecture

Arquitectura hexagonal con puertos y adaptadores:

```
src/
├── domain/          # Modelos, errores, validadores, interfaces, puertos
├── infra/           # Adaptadores, servicios, repositorios, externos
├── app/             # Casos de uso, DTOs
├── utils/           # Utilidades
└── index.ts         # Punto de entrada Lambda
test/
```

## ☁️ AWS Hexagonal Architecture

Basado en las mejores prácticas de AWS:

```
src/
├── adapters/      # Repositorios y servicios
├── domain/        # Comandos, handlers, excepciones, modelos, puertos
├── entrypoints/   # API y modelos de entrada
├── infra/         # Interfaces de infraestructura
├── types/         # Tipos TypeScript
├── utils/         # Utilidades
└── index.ts       # Punto de entrada Lambda
test/
```

## 🔀 Hybrid Wally Architecture

Arquitectura híbrida personalizada con estructura optimizada:

```
src/
├── adapters/      # Clases para interactuar con servicios externos
├── interfaces/    # Definiciones de interfaces (repositorios, adaptadores, etc.)
├── useCase/       # "Casos de uso" o lógica principal
├── repository/    # Repositorios (acceso a DB)
├── models/        # Modelos, esquemas de validación, DTOs
├── utils/         # Constantes, funciones helpers, manejo de errores, etc.
└── index.ts       # Punto de entrada Lambda
test/
```

## 🛠️ Desarrollo

```bash
# Clonar el repositorio
git clone <repository-url>
cd cli-builder-arch

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Ejecutar
npm start
```

## 📝 Características

### 🎯 Funcionalidades Principales
- ✅ **Generación automática** de estructura de carpetas según la arquitectura seleccionada
- ✅ **Archivos de ejemplo** con prefijo "example" para cada tipo de archivo
- ✅ **Configuración TypeScript** optimizada para AWS Lambda
- ✅ **Configuración Webpack** para optimización y empaquetado de lambdas
- ✅ **Package.json** con dependencias específicas de AWS Lambda
- ✅ **Tests de ejemplo** con Jest configurado
- ✅ **Documentación README** generada automáticamente
- ✅ **Configuración de Git** incluida (.gitignore)
- ✅ **Path personalizado** opcional para crear proyectos en ubicaciones específicas

### 🏗️ Arquitecturas Disponibles
- ✅ **5 arquitecturas diferentes** disponibles
- ✅ **Estructuras optimizadas** para cada arquitectura
- ✅ **Enfoque específico** para desarrollo de lambdas de AWS
- ✅ **Mejores prácticas** implementadas en cada estructura

### 🔧 Herramientas Incluidas
- ✅ **Logger de Powertools** (opcional) para logging estructurado
- ✅ **Auditoría de Wally** (opcional) para constantes de auditoría
- ✅ **Scripts de build** optimizados para producción
- ✅ **Script de empaquetado** para AWS Lambda

## 📦 Package for Lambda

Cada proyecto generado incluye un comando para crear un paquete optimizado para AWS Lambda:

\`\`\`bash
npm run package
\`\`\`

Este comando genera un archivo ZIP optimizado para desplegar en AWS Lambda.

## ❓ Preguntas Frecuentes

### ¿Puedo especificar una ruta personalizada para crear mi proyecto?
Sí, durante el proceso de configuración se te preguntará si deseas especificar un path personalizado. Si seleccionas "Sí", podrás ingresar la ruta completa donde quieres que se cree el proyecto.

### ¿Qué dependencias se incluyen por defecto?
Cada proyecto incluye las dependencias básicas de AWS Lambda (`aws-sdk`, `aws-lambda`). Opcionalmente puedes incluir:
- `@aws-lambda-powertools/logger` y `@aws-lambda-powertools/tracer` para logging
- `@wallytech/sdk-audit` para auditoría

### ¿Cómo puedo personalizar la estructura generada?
La estructura base se genera automáticamente, pero puedes modificar los archivos después de la generación. Los archivos de ejemplo te servirán como guía para implementar tu lógica de negocio.

### ¿El CLI funciona en Windows, Mac y Linux?
Sí, el CLI está desarrollado en Node.js y funciona en todas las plataformas soportadas por Node.js.

## 🔧 Troubleshooting

### Error: "El nombre del proyecto no puede estar vacío"
Asegúrate de ingresar un nombre válido que contenga solo letras, números, guiones y guiones bajos.

### Error: "Arquitectura no soportada"
Verifica que estés seleccionando una de las 5 arquitecturas disponibles en el menú.

### Error al crear el proyecto en una ruta personalizada
Asegúrate de que la ruta especificada existe y tienes permisos de escritura en esa ubicación.

### Error de permisos en npm install
Si tienes problemas con permisos, intenta usar `sudo` en sistemas Unix o ejecuta tu terminal como administrador en Windows.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Inspirado en las mejores prácticas de arquitectura de software
- Basado en las recomendaciones de AWS Prescriptive Guidance
- Implementa patrones de Clean Architecture y Hexagonal Architecture
