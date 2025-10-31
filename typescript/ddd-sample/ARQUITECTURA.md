# Arquitectura DDD y Filosofía

## 🎯 Filosofía del Domain-Driven Design (DDD)

El **Domain-Driven Design** es una metodología de desarrollo de software que pone el **dominio del negocio** en el centro del diseño. Su filosofía se basa en:

### Principios Fundamentales

1. **El dominio es lo más importante**: La lógica de negocio debe ser independiente de detalles técnicos
2. **Lenguaje ubicuo**: Todos los miembros del equipo usan el mismo vocabulario del dominio
3. **Modelo rico**: Las entidades contienen comportamiento, no solo datos
4. **Separación de responsabilidades**: Cada capa tiene un propósito específico

### Beneficios del DDD

- **Mantenibilidad**: Código más fácil de entender y modificar
- **Testabilidad**: Lógica de negocio aislada y testeable
- **Escalabilidad**: Arquitectura que crece con el negocio
- **Flexibilidad**: Cambios en infraestructura no afectan el dominio

---

## 🏗️ Capas de la Arquitectura

### 1. **Domain Layer** (Capa de Dominio) - El Corazón

**Ubicación**: `src/domain/`

**Propósito**: Contiene la lógica de negocio pura, sin dependencias externas.

#### Componentes:

- **Entities** (`entities/`): Objetos con identidad única
  - `User.ts`: Representa un usuario con sus reglas de negocio
  - Contiene métodos de dominio como `changeName()`
  - Factory methods para creación controlada

- **Value Objects** (`valueObjects/`): Objetos inmutables sin identidad
  - `UserId.ts`: Encapsula la lógica del ID de usuario
  - `Email.ts`: Valida y normaliza emails
  - Son comparados por valor, no por referencia

- **Exceptions** (`exceptions/`): Errores específicos del dominio
  - `UserNotFoundError`: Usuario no encontrado
  - `InvalidUserDataError`: Datos inválidos
  - `UserAlreadyExistsError`: Usuario duplicado

- **Ports** (`ports/`): Interfaces que definen contratos
  - `UserRepository.ts`: Contrato para persistencia
  - `UserUseCases.ts`: Contrato para casos de uso

**Características**:
- ✅ Sin dependencias externas
- ✅ Lógica de negocio pura
- ✅ Testeable independientemente
- ✅ Inmutable cuando es posible

---

### 2. **Application Layer** (Capa de Aplicación) - La Orquestación

**Ubicación**: `src/application/`

**Propósito**: Coordina casos de uso y orquesta la lógica de negocio.

#### Componentes:

- **Use Cases** (`useCases/`): Casos de uso específicos
  - `GetUserUseCaseImpl`: Obtener usuario por ID
  - `CreateUserUseCaseImpl`: Crear nuevo usuario
  - `ListUsersUseCaseImpl`: Listar todos los usuarios

**Características**:
- ✅ Orquesta operaciones del dominio
- ✅ Maneja transacciones
- ✅ Valida datos de entrada
- ✅ Implementa reglas de aplicación

**Flujo típico**:
1. Recibe datos de entrada
2. Valida los datos
3. Llama a repositorios para obtener datos
4. Ejecuta lógica de negocio
5. Persiste cambios
6. Retorna resultado

---

### 3. **Infrastructure Layer** (Capa de Infraestructura) - Los Adaptadores

**Ubicación**: `src/infrastructure/`

**Propósito**: Implementa detalles técnicos y conecta con el mundo exterior.

#### Componentes:

- **Repositories** (`repositories/`): Adaptadores Secundarios
  - `InMemoryUserRepository.ts`: Almacenamiento en memoria
  - `DatabaseUserRepository.ts`: Simulación de base de datos
  - Implementan el contrato `UserRepository`

- **Controllers** (`controllers/`): Adaptadores Primarios
  - `UserController.ts`: Maneja peticiones HTTP
  - Convierte datos HTTP a objetos de dominio
  - Maneja errores y respuestas

- **Routes** (`routes/`): Configuración de rutas
  - `UserRoutes.ts`: Define endpoints HTTP
  - Middleware de seguridad
  - Manejo de errores HTTP

- **Container** (`container/`): Inyección de dependencias
  - `DependencyContainer.ts`: Conecta todas las capas
  - Configura dependencias
  - Facilita testing

**Características**:
- ✅ Implementa interfaces del dominio
- ✅ Maneja detalles técnicos
- ✅ Fácilmente intercambiable
- ✅ Aislado del dominio

---

## 🔄 Flujo de Datos

```
HTTP Request
    ↓
[Routes] → [Controller] → [Use Case] → [Repository Interface]
    ↓           ↓            ↓              ↓
HTTP Response ← JSON ← Domain Logic ← Data Source
```

### Ejemplo: Obtener Usuario

1. **HTTP Request** → `GET /api/users/1`
2. **Routes** → Enruta a `UserController.getUserById()`
3. **Controller** → Extrae ID y llama a `GetUserUseCase.execute()`
4. **Use Case** → Valida ID y llama a `UserRepository.findById()`
5. **Repository** → Busca en fuente de datos (memoria/DB)
6. **Domain** → Retorna entidad `User`
7. **Use Case** → Retorna usuario
8. **Controller** → Convierte a JSON
9. **HTTP Response** → `200 OK` con datos del usuario

---

## 🎨 Patrones Arquitectónicos

### 1. **Ports & Adapters (Arquitectura Hexagonal)**

- **Ports**: Interfaces que definen contratos
- **Adapters**: Implementaciones concretas
- **Beneficio**: Desacoplamiento total

### 2. **Dependency Inversion**

- Dependencias apuntan hacia el dominio
- Infraestructura implementa interfaces del dominio
- **Beneficio**: Flexibilidad y testabilidad

### 3. **Factory Pattern**

- `User.create()`: Crea usuarios con validación
- `User.fromPersistence()`: Reconstruye desde datos
- **Beneficio**: Control de creación

### 4. **Repository Pattern**

- Abstrae acceso a datos
- Intercambiable (memoria ↔ base de datos)
- **Beneficio**: Independencia de persistencia

---

## 🧪 Testing Strategy

### Domain Layer
- **Unit Tests**: Lógica de negocio pura
- **Sin mocks**: Testea comportamiento real
- **Rápido**: Sin dependencias externas

### Application Layer
- **Integration Tests**: Casos de uso completos
- **Mocks**: Repositorios para aislar
- **Cobertura**: Todos los casos de uso

### Infrastructure Layer
- **Contract Tests**: Verificar implementación de interfaces
- **E2E Tests**: Flujo completo HTTP
- **Performance Tests**: Latencia y throughput

---

## 🚀 Ventajas de esta Arquitectura

### Para el Negocio
- **Cambios rápidos**: Modificar lógica sin afectar infraestructura
- **Reglas claras**: Lógica de negocio centralizada
- **Calidad**: Menos bugs por separación de responsabilidades

### Para el Desarrollo
- **Mantenibilidad**: Código organizado y predecible
- **Testabilidad**: Cada capa testeable independientemente
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Colaboración**: Equipos pueden trabajar en diferentes capas

### Para el Futuro
- **Flexibilidad**: Cambiar tecnologías sin afectar dominio
- **Evolución**: Arquitectura que crece con el negocio
- **Legacy**: Fácil migración de sistemas existentes

---

## 📚 Recursos Adicionales

- [Domain-Driven Design Reference](https://domainlanguage.com/ddd/reference/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Implementing Domain-Driven Design](https://vaughnvernon.com/implementing-domain-driven-design/)

---

*Esta arquitectura sigue los principios de DDD para crear software mantenible, testeable y que evolucione con el negocio.*
