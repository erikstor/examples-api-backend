# DDD Sample - Arquitectura Hexagonal con TypeScript

Este proyecto implementa un ejemplo de obtención de usuarios siguiendo los principios de **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal** (también conocida como Ports & Adapters) según se describe en el artículo de [Herberto Graca](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/).

## 🏗️ Arquitectura

El proyecto sigue la **Explicit Architecture** que combina:

- **DDD (Domain-Driven Design)**
- **Arquitectura Hexagonal (Ports & Adapters)**
- **Clean Architecture**
- **Principios SOLID**

### Estructura de Capas

```
src/
├── domain/                    # Capa de Dominio (Core)
│   ├── entities/             # Entidades de dominio
│   │   └── User.ts
│   ├── valueObjects/         # Objetos de valor
│   │   └── UserId.ts
│   ├── exceptions/           # Excepciones de dominio
│   │   └── UserExceptions.ts
│   └── ports/                # Puertos (Interfaces)
│       ├── UserRepository.ts
│       └── UserUseCases.ts
├── application/              # Capa de Aplicación
│   └── useCases/             # Casos de uso
│       └── UserUseCases.ts
└── infrastructure/           # Capa de Infraestructura
    ├── repositories/         # Adaptadores Secundarios
    │   ├── InMemoryUserRepository.ts
    │   └── DatabaseUserRepository.ts
    ├── controllers/          # Adaptadores Primarios
    │   └── UserController.ts
    ├── routes/               # Configuración de rutas
    │   └── UserRoutes.ts
    └── container/            # Inyección de dependencias
        └── DependencyContainer.ts
```

## 🎯 Características Implementadas

### Dominio (Domain Layer)
- **Entidad User**: Representa un usuario con sus reglas de negocio
- **Value Objects**: UserId y Email con validaciones
- **Excepciones de Dominio**: Manejo específico de errores del dominio
- **Puertos**: Interfaces que definen contratos para repositorios y casos de uso

### Aplicación (Application Layer)
- **Casos de Uso**: 
  - `GetUserUseCase`: Obtener usuario por ID
  - `CreateUserUseCase`: Crear nuevo usuario
  - `ListUsersUseCase`: Listar todos los usuarios

### Infraestructura (Infrastructure Layer)
- **Adaptadores Secundarios**: Implementaciones de repositorios
  - `InMemoryUserRepository`: Almacenamiento en memoria
  - `DatabaseUserRepository`: Simulación de base de datos
- **Adaptadores Primarios**: Controladores HTTP y rutas
- **Inyección de Dependencias**: Contenedor que conecta todas las capas

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
cd ddd-sample
npm install
```

### Compilación
```bash
npm run build
```

### Ejecución
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### Variables de Entorno
```bash
# Usar repositorio de base de datos (por defecto: false)
USE_DATABASE=true

# Puerto del servidor (por defecto: 3000)
PORT=3000
```

## 📡 API Endpoints

### Información General
- `GET /` - Información de la API y endpoints disponibles
- `GET /health` - Estado del servidor

### Usuarios
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario

### Ejemplos de Uso

#### Listar usuarios
```bash
curl http://localhost:3000/api/users
```

#### Obtener usuario por ID
```bash
curl http://localhost:3000/api/users/1
```

#### Crear nuevo usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "6",
    "email": "nuevo@example.com",
    "name": "Nuevo Usuario"
  }'
```

## 🧪 Testing

```bash
npm test
```

## 🏛️ Principios Arquitectónicos Aplicados

### 1. Inversión de Dependencias
- El dominio no depende de la infraestructura
- Los casos de uso dependen de abstracciones (puertos)
- La infraestructura implementa las abstracciones

### 2. Separación de Responsabilidades
- **Dominio**: Lógica de negocio pura
- **Aplicación**: Orquestación de casos de uso
- **Infraestructura**: Detalles técnicos y adaptadores

### 3. Ports & Adapters
- **Puertos**: Interfaces que definen contratos
- **Adaptadores Primarios**: Controladores HTTP (entrada)
- **Adaptadores Secundarios**: Repositorios (salida)

### 4. Domain-Driven Design
- Entidades con identidad única
- Value Objects inmutables
- Excepciones específicas del dominio
- Lenguaje ubicuo

## 🔄 Flujo de Datos

1. **Request HTTP** → **Controller** (Primary Adapter)
2. **Controller** → **Use Case** (Application Layer)
3. **Use Case** → **Repository Interface** (Port)
4. **Repository Implementation** → **Data Source** (Secondary Adapter)
5. **Response** ← **Controller** ← **Use Case** ← **Repository**

## 📚 Referencias

- [DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
