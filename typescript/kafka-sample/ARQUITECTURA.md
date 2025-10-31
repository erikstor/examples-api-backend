# Arquitectura de Microservicios con NestJS, Kafka, Elasticsearch y Kibana

## Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │ Create User     │    │ Logging Service │
│   (Puerto 3001) │    │ Service         │    │ (Puerto 3003)   │
│                 │    │ (Puerto 3002)   │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │        Apache Kafka       │
                    │                           │
                    │  Topics:                  │
                    │  - user-logs              │
                    │  - create-user-logs       │
                    │  - logging-service        │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Elasticsearch        │
                    │      (Puerto 9200)        │
                    │                           │
                    │  Índice:                  │
                    │  - microservices-logs     │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │        Kibana             │
                    │      (Puerto 5601)        │
                    │                           │
                    │  Dashboards:              │
                    │  - Monitoreo de servicios │
                    │  - Análisis de errores    │
                    │  - Visualizaciones        │
                    └───────────────────────────┘
```

## Flujo de Comunicación

### 1. User Service
- **Función**: Obtener usuarios por ID
- **Endpoint**: `GET /users/:id`
- **Comunicación Kafka**: Envía logs al topic `user-logs`

### 2. Create User Service
- **Función**: Crear nuevos usuarios
- **Endpoint**: `POST /users`
- **Comunicación Kafka**: Envía logs al topic `create-user-logs`

### 3. Logging Service
- **Función**: Centralizar y almacenar logs
- **Endpoints**: 
  - `GET /logs` - Ver todos los logs
  - `GET /logs/stats` - Estadísticas básicas
  - `GET /logs/elasticsearch-stats` - Estadísticas avanzadas
  - `GET /logs/search?q=query` - Búsqueda en Elasticsearch
- **Comunicación Kafka**: Consume mensajes de ambos topics
- **Almacenamiento**: Memoria + Elasticsearch

### 4. Elasticsearch
- **Función**: Motor de búsqueda y análisis
- **Índice**: `microservices-logs`
- **Campos**: id, service, action, timestamp, level, data, message

### 5. Kibana
- **Función**: Interfaz visual para análisis
- **Características**: Dashboards, búsquedas, visualizaciones
- **Configuración**: Índice pattern `microservices-logs*`

## Patrones de Microservicios Implementados

### 1. Message Pattern (Patrón de Mensajes)
- Los servicios se comunican de forma asíncrona a través de Kafka
- Cada servicio envía mensajes de log al servicio centralizado

### 2. Event-Driven Architecture
- Los eventos de log se propagan automáticamente
- El sistema es resiliente a fallos de servicios individuales

### 3. Centralized Logging
- Todos los logs se centralizan en un servicio dedicado
- Facilita el monitoreo y análisis del sistema

### 4. ELK Stack (Elasticsearch, Logstash, Kibana)
- **Elasticsearch**: Almacenamiento y búsqueda de logs
- **Kibana**: Visualización y análisis de datos
- **Logstash**: No implementado (los logs van directamente a Elasticsearch)

### 5. Dual Storage Strategy
- **Memoria**: Para acceso rápido y estadísticas básicas
- **Elasticsearch**: Para análisis avanzado y persistencia

## Tecnologías Utilizadas

- **NestJS**: Framework para microservicios en Node.js
- **Apache Kafka**: Sistema de mensajería distribuida
- **Elasticsearch**: Motor de búsqueda y análisis de logs
- **Kibana**: Interfaz visual para análisis de datos
- **TypeScript**: Lenguaje de programación tipado
- **Docker**: Containerización de servicios de infraestructura
- **Class Validator**: Validación de DTOs
- **UUID**: Generación de identificadores únicos

## Beneficios de esta Arquitectura

1. **Escalabilidad**: Cada servicio puede escalarse independientemente
2. **Resiliencia**: Fallos en un servicio no afectan a los demás
3. **Observabilidad**: Logs centralizados con análisis visual avanzado
4. **Desacoplamiento**: Servicios independientes con comunicación asíncrona
5. **Mantenibilidad**: Código organizado por dominio de negocio
6. **Análisis Avanzado**: Capacidades de búsqueda y visualización potentes
7. **Persistencia**: Los logs se almacenan de forma permanente para análisis histórico
8. **Flexibilidad**: Fácil agregar nuevos servicios y métricas
