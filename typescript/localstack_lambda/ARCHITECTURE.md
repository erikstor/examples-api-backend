# 🏗️ Arquitectura del Proyecto

Este documento describe la arquitectura en capas implementada en este proyecto Lambda.

## Patrón de Arquitectura en Capas

La arquitectura en capas (Layered Architecture) es un patrón de diseño que organiza el código en capas con responsabilidades específicas. Cada capa solo puede depender de las capas inferiores, nunca de las superiores.

```
┌─────────────────────────────────────┐
│      Presentation Layer             │  ← Lambda Handler
│      (handler.ts)                   │
├─────────────────────────────────────┤
│      Application Layer              │  ← Use Cases (Business Logic)
│      (Use Cases)                    │
├─────────────────────────────────────┤
│      Infrastructure Layer           │  ← Implementations (DynamoDB)
│      (Repositories, Config)         │
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Entities & Interfaces
│      (Entities, Interfaces)         │
└─────────────────────────────────────┘
```

## Capas del Proyecto

### 1. Domain Layer (Dominio)

**Ubicación**: `src/domain/`

**Responsabilidad**: Define las entidades de negocio y las interfaces de los repositorios.

**Características**:
- No depende de ninguna otra capa
- Contiene la lógica de negocio pura
- Define las reglas de negocio
- No tiene dependencias externas

**Archivos**:
- `User.ts`: Entidad de usuario y sus interfaces
- `IUserRepository.ts`: Interface del repositorio de usuarios

**Ejemplo**:
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

export class UserEntity implements User {
  // Lógica de dominio pura
  static create(input: CreateUserInput, id: string): UserEntity {
    // Validaciones y creación de la entidad
  }
}
```

**Principios**:
- Sin dependencias de frameworks
- Lógica de negocio independiente
- Fácil de probar unitariamente

### 2. Application Layer (Aplicación)

**Ubicación**: `src/application/`

**Responsabilidad**: Contiene los casos de uso que orquestan la lógica de negocio.

**Características**:
- Depende solo de la capa de dominio
- Implementa los casos de uso del sistema
- Orquesta el flujo de datos entre capas
- No conoce detalles de implementación

**Archivos**:
- `GetUserUseCase.ts`: Caso de uso para obtener un usuario
- `CreateUserUseCase.ts`: Caso de uso para crear un usuario
- `GetOrCreateUserUseCase.ts`: Caso de uso compuesto

**Ejemplo**:
```typescript
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    // Validaciones de negocio
    if (!input.email || !input.email.includes('@')) {
      throw new Error('Valid email is required');
    }

    // Lógica de negocio
    const emailExists = await this.userRepository.exists(input.email);
    if (emailExists) {
      throw new Error('User already exists');
    }

    // Crear y guardar
    const userEntity = UserEntity.create(input, uuidv4());
    return await this.userRepository.save(userEntity.toJSON());
  }
}
```

**Principios**:
- Un caso de uso = una operación de negocio
- Independiente de la capa de presentación
- Fácil de probar con mocks

### 3. Infrastructure Layer (Infraestructura)

**Ubicación**: `src/infrastructure/`

**Responsabilidad**: Implementaciones concretas de repositorios, configuraciones y servicios externos.

**Características**:
- Depende de domain y application
- Implementa las interfaces del dominio
- Contiene detalles de implementación
- Maneja la comunicación con servicios externos

**Archivos**:
- `config/dynamodb.ts`: Configuración de DynamoDB
- `repositories/DynamoDBUserRepository.ts`: Implementación del repositorio

**Ejemplo**:
```typescript
export class DynamoDBUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });
    const response = await dynamoDbDocClient.send(command);
    return (response.Item as User) || null;
  }

  async save(user: User): Promise<User> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
    });
    await dynamoDbDocClient.send(command);
    return user;
  }
}
```

**Principios**:
- Implementa interfaces del dominio
- Oculta detalles de implementación
- Fácil de cambiar (por ejemplo, cambiar DynamoDB por MongoDB)

### 4. Presentation Layer (Presentación)

**Ubicación**: `src/presentation/`

**Responsabilidad**: Punto de entrada de la aplicación. Maneja las solicitudes y respuestas.

**Características**:
- Depende de todas las demás capas
- Maneja el formato de entrada/salida
- Traduce entre el protocolo externo y la aplicación
- Maneja errores y respuestas HTTP

**Archivos**:
- `handler.ts`: Lambda handler principal

**Ejemplo**:
```typescript
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    // Inicializar dependencias
    const userRepository = new DynamoDBUserRepository();
    const getOrCreateUserUseCase = new GetOrCreateUserUseCase(userRepository);

    // Procesar solicitud
    if (httpMethod === 'POST' && path === '/user') {
      const input = JSON.parse(event.body);
      const result = await getOrCreateUserUseCase.executeByEmail(input);
      
      // Retornar respuesta HTTP
      return {
        statusCode: result.created ? 201 : 200,
        body: JSON.stringify(result),
      };
    }
  } catch (error) {
    // Manejo de errores
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

**Principios**:
- Traducción entre formatos externos e internos
- Manejo de errores HTTP
- Inyección de dependencias

## Flujo de Datos

```
1. API Gateway Event → Handler (Presentation)
2. Handler → Use Case (Application)
3. Use Case → Repository Interface (Domain)
4. Repository Implementation (Infrastructure) → DynamoDB
5. DynamoDB → Repository → Use Case
6. Use Case → Handler → API Gateway Response
```

## Ventajas de esta Arquitectura

### 1. Separación de Responsabilidades
Cada capa tiene una responsabilidad específica y bien definida.

### 2. Testabilidad
- Domain: Tests unitarios puros
- Application: Tests con mocks de repositorios
- Infrastructure: Tests de integración
- Presentation: Tests end-to-end

### 3. Mantenibilidad
El código es fácil de entender y modificar porque cada capa tiene un propósito claro.

### 4. Escalabilidad
Puedes agregar nuevas funcionalidades sin afectar el código existente.

### 5. Flexibilidad
Puedes cambiar implementaciones sin afectar la lógica de negocio. Por ejemplo:
- Cambiar DynamoDB por otra base de datos
- Cambiar Lambda por Express.js
- Agregar validaciones sin tocar el dominio

## Ejemplo de Flujo Completo

### Crear Usuario

```
1. Cliente envía: POST /user { email, name, age }
   ↓
2. handler.ts recibe el evento de API Gateway
   ↓
3. handler.ts parsea el body y llama a CreateUserUseCase
   ↓
4. CreateUserUseCase valida los datos
   ↓
5. CreateUserUseCase verifica si el email existe (vía IUserRepository)
   ↓
6. DynamoDBUserRepository ejecuta la consulta a DynamoDB
   ↓
7. CreateUserUseCase crea la entidad User
   ↓
8. DynamoDBUserRepository guarda en DynamoDB
   ↓
9. handler.ts formatea la respuesta HTTP
   ↓
10. Cliente recibe: 201 { user, created: true }
```

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
Cada clase tiene una única responsabilidad.

### Open/Closed Principle (OCP)
Abierto para extensión, cerrado para modificación. Puedes agregar nuevos casos de uso sin modificar los existentes.

### Liskov Substitution Principle (LSP)
Puedes sustituir implementaciones de repositorios sin afectar el código.

### Interface Segregation Principle (ISP)
Interfaces pequeñas y específicas (IUserRepository).

### Dependency Inversion Principle (DIP)
Las capas superiores dependen de abstracciones (interfaces), no de implementaciones concretas.

## Testing Strategy

### Domain Layer
```typescript
describe('UserEntity', () => {
  it('should create a valid user', () => {
    const user = UserEntity.create({
      email: 'test@example.com',
      name: 'Test User',
    }, 'test-id');
    
    expect(user.id).toBe('test-id');
    expect(user.email).toBe('test@example.com');
  });
});
```

### Application Layer
```typescript
describe('CreateUserUseCase', () => {
  it('should create a user', async () => {
    const mockRepo = {
      exists: jest.fn().mockResolvedValue(false),
      save: jest.fn().mockResolvedValue(mockUser),
    };
    
    const useCase = new CreateUserUseCase(mockRepo);
    const result = await useCase.execute(input);
    
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

### Infrastructure Layer
```typescript
describe('DynamoDBUserRepository', () => {
  it('should save a user to DynamoDB', async () => {
    const repo = new DynamoDBUserRepository();
    const user = await repo.save(mockUser);
    
    expect(user.id).toBeDefined();
  });
});
```

## Conclusión

Esta arquitectura en capas proporciona:
- **Claridad**: Cada capa tiene un propósito claro
- **Flexibilidad**: Fácil de cambiar implementaciones
- **Testabilidad**: Cada capa se puede probar independientemente
- **Mantenibilidad**: Código organizado y fácil de entender
- **Escalabilidad**: Fácil de agregar nuevas funcionalidades

Es una arquitectura robusta y profesional que facilita el desarrollo y mantenimiento a largo plazo.

