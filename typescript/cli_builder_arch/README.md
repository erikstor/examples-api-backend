# CLI Builder Architecture Generator

Una herramienta CLI en TypeScript para generar skeletons de proyectos con diferentes arquitecturas de software, enfocada en el desarrollo de lambdas de AWS.

## 🏗️ Arquitecturas Soportadas

- **🏛️ Layered Architecture (Arquitectura en Capas)**: Separación clara entre models, controller, services y utils
- **🧹 Clean Architecture**: Arquitectura limpia con separación de responsabilidades por capas concéntricas
- **🔷 Hexagonal Architecture**: Arquitectura hexagonal con puertos y adaptadores
- **☁️ AWS Hexagonal Architecture**: Implementación basada en las mejores prácticas de AWS
- **🔀 Hybrid Wally Architecture**: Arquitectura híbrida personalizada con estructura optimizada

## 🚀 Instalación

```bash
npm install -g cli-builder-arch
```

## 📖 Uso

```bash
cli-builder create
```

El CLI te guiará a través de:
1. Selección de la arquitectura deseada
2. Nombre del proyecto
3. Generación automática de la estructura

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

- ✅ Generación automática de estructura de carpetas
- ✅ Archivos de ejemplo con prefijo "example"
- ✅ Configuración TypeScript incluida
- ✅ Configuración Webpack para optimización de lambdas
- ✅ Package.json con dependencias de AWS Lambda
- ✅ Tests de ejemplo con Jest
- ✅ Documentación README generada
- ✅ Configuración de Git incluida
- ✅ Enfoque específico para desarrollo de lambdas de AWS
- ✅ 5 arquitecturas diferentes disponibles
- ✅ Estructuras optimizadas para cada arquitectura

## 📦 Package for Lambda

Cada proyecto generado incluye un comando para crear un paquete optimizado para AWS Lambda:

\`\`\`bash
npm run package
\`\`\`

Este comando genera un archivo ZIP optimizado para desplegar en AWS Lambda.

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
