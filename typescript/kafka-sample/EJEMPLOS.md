# Ejemplos de uso de los microservicios con Kibana

## 1. Obtener usuario por ID

```bash
# Obtener usuario con ID 1
curl -X GET http://localhost:3001/users/1

# Respuesta esperada:
{
  "id": "1",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "age": 30,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## 2. Crear nuevo usuario

```bash
# Crear un nuevo usuario
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Martínez",
    "email": "ana@example.com",
    "age": 28
  }'

# Respuesta esperada:
{
  "id": "uuid-generado",
  "name": "Ana Martínez",
  "email": "ana@example.com",
  "age": 28,
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

## 3. Ver logs almacenados

```bash
# Ver todos los logs
curl -X GET http://localhost:3003/logs

# Ver estadísticas básicas
curl -X GET http://localhost:3003/logs/stats

# Ver estadísticas avanzadas de Elasticsearch
curl -X GET http://localhost:3003/logs/elasticsearch-stats

# Buscar logs específicos
curl -X GET "http://localhost:3003/logs/search?q=USER_SERVICE"

# Ver logs por servicio
curl -X GET http://localhost:3003/logs/service/USER_SERVICE

# Ver logs por nivel
curl -X GET http://localhost:3003/logs/level/ERROR
```

## 4. Análisis con Kibana

### Configuración inicial:
1. Ve a http://localhost:5601
2. Crea un índice pattern: `microservices-logs*`
3. Selecciona `timestamp` como campo de tiempo

### Consultas útiles en Kibana:

#### Buscar todos los logs de un servicio:
```
service: "USER_SERVICE"
```

#### Buscar errores:
```
level: "ERROR"
```

#### Buscar logs de las últimas 24 horas:
```
timestamp: [now-24h TO now]
```

#### Buscar por acción específica:
```
action: "GET_USER_BY_ID"
```

## 5. Flujo completo de ejemplo

1. **Crear un usuario:**
```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Pedro García", "email": "pedro@example.com", "age": 32}'
```

2. **Obtener el usuario creado:**
```bash
# Usar el ID devuelto en el paso anterior
curl -X GET http://localhost:3001/users/[ID_DEL_USUARIO]
```

3. **Verificar los logs en memoria:**
```bash
curl -X GET http://localhost:3003/logs
```

4. **Analizar en Kibana:**
- Ve a http://localhost:5601
- En "Discover", verás todos los logs indexados
- Puedes crear visualizaciones y dashboards

## 6. Monitoreo de Kafka

```bash
# Ver mensajes en tiempo real del topic user-logs
docker exec kafka kafka-console-consumer \
  --topic user-logs \
  --bootstrap-server localhost:9092 \
  --from-beginning

# Ver mensajes en tiempo real del topic create-user-logs
docker exec kafka kafka-console-consumer \
  --topic create-user-logs \
  --bootstrap-server localhost:9092 \
  --from-beginning
```

## 7. Dashboards recomendados en Kibana

### Dashboard de Monitoreo de Servicios:
- Gráfico de líneas: Logs por hora
- Gráfico de barras: Logs por servicio
- Gráfico circular: Distribución por nivel de log
- Tabla: Últimos logs con detalles

### Dashboard de Errores:
- Filtro: `level: "ERROR"`
- Gráfico de líneas: Errores por hora
- Tabla: Errores más frecuentes
- Mapa de calor: Errores por servicio y acción
