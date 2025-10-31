# Microservicios con NestJS, Kafka, Elasticsearch y Kibana

Este proyecto contiene tres microservicios desarrollados con NestJS que se comunican a través de Kafka y almacenan logs en Elasticsearch para análisis con Kibana:

## Servicios

### 1. User Service (Puerto 3001)
- **Endpoint**: `GET /users/:id`
- **Función**: Obtener un usuario por ID
- **Comunicación**: Envía logs al servicio de logging via Kafka

### 2. Create User Service (Puerto 3002)
- **Endpoint**: `POST /users`
- **Función**: Crear un nuevo usuario
- **Comunicación**: Envía logs al servicio de logging via Kafka

### 3. Logging Service (Puerto 3003)
- **Función**: Recibe y almacena logs de los otros servicios
- **Comunicación**: Consume mensajes de Kafka de los otros servicios
- **Almacenamiento**: Logs en memoria + Elasticsearch para análisis avanzado

### 4. Kibana Dashboard (Puerto 5601)
- **Función**: Interfaz visual para analizar logs
- **Características**: Dashboards, búsquedas avanzadas, visualizaciones

## Estructura del Proyecto

```
src/
├── shared/                 # Código compartido entre servicios
│   ├── dto/               # Data Transfer Objects
│   ├── interfaces/        # Interfaces compartidas
│   ├── kafka/            # Configuración de Kafka
│   └── services/          # Servicios compartidos (Elasticsearch)
├── user-service/         # Servicio para obtener usuarios
├── create-user-service/   # Servicio para crear usuarios
└── logging-service/      # Servicio de logging
```

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar servicios de infraestructura (Kafka, Elasticsearch, Kibana):
```bash
docker-compose up -d
```

3. Esperar a que los servicios estén listos (15 segundos aprox.)

4. Ejecutar los microservicios:
```bash
# Terminal 1 - User Service
npm run start:user-service

# Terminal 2 - Create User Service
npm run start:create-user-service

# Terminal 3 - Logging Service
npm run start:logging-service
```

## Endpoints

### User Service (http://localhost:3001)
- `GET /users/:id` - Obtener usuario por ID

### Create User Service (http://localhost:3002)
- `POST /users` - Crear nuevo usuario
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "age": 30
  }
  ```

### Logging Service (http://localhost:3003)
- `GET /logs` - Ver todos los logs almacenados
- `GET /logs/stats` - Estadísticas básicas de logs
- `GET /logs/elasticsearch-stats` - Estadísticas avanzadas de Elasticsearch
- `GET /logs/search?q=query` - Buscar logs en Elasticsearch
- `GET /logs/service/:serviceName` - Logs por servicio
- `GET /logs/level/:level` - Logs por nivel

### Kibana Dashboard (http://localhost:5601)
- Interfaz web para análisis visual de logs
- Dashboards personalizables
- Búsquedas avanzadas con Query DSL

## Configuración de Kibana

1. Accede a http://localhost:5601
2. Ve a "Stack Management" > "Index Patterns"
3. Crea un nuevo índice pattern: `microservices-logs*`
4. Selecciona `timestamp` como campo de tiempo
5. Explora los logs en "Discover"

## Tecnologías Utilizadas

- **NestJS**: Framework para microservicios
- **Kafka**: Sistema de mensajería para comunicación entre servicios
- **Elasticsearch**: Motor de búsqueda y análisis de logs
- **Kibana**: Interfaz visual para análisis de datos
- **TypeScript**: Lenguaje de programación
- **Docker**: Para ejecutar servicios de infraestructura
