# Configuración de Kibana para Microservicios

## Pasos para configurar Kibana

### 1. Acceso inicial
- URL: http://localhost:5601
- Esperar a que Kibana esté completamente iniciado (puede tomar 1-2 minutos)

### 2. Crear Index Pattern
1. Ve a **Stack Management** > **Index Patterns**
2. Haz clic en **Create index pattern**
3. En "Index pattern name" escribe: `microservices-logs*`
4. Haz clic en **Next step**
5. Selecciona `timestamp` como **Time field**
6. Haz clic en **Create index pattern**

### 3. Explorar datos
1. Ve a **Discover**
2. Selecciona el índice pattern `microservices-logs*`
3. Verás todos los logs indexados
4. Usa los filtros para explorar por servicio, nivel, etc.

## Dashboards recomendados

### Dashboard de Monitoreo General
**Objetivo**: Visión general del sistema

**Visualizaciones**:
1. **Logs por hora** (Gráfico de líneas)
   - Métrica: Count
   - Bucket: X-axis > Date Histogram > timestamp > 1h

2. **Logs por servicio** (Gráfico de barras)
   - Métrica: Count
   - Bucket: Y-axis > Terms > service.keyword

3. **Distribución por nivel** (Gráfico circular)
   - Métrica: Count
   - Bucket: Split slices > Terms > level.keyword

4. **Últimos logs** (Tabla)
   - Campos: timestamp, service, action, level, message

### Dashboard de Errores
**Objetivo**: Monitoreo específico de errores

**Filtro base**: `level: "ERROR"`

**Visualizaciones**:
1. **Errores por hora** (Gráfico de líneas)
2. **Errores por servicio** (Gráfico de barras)
3. **Errores más frecuentes** (Tabla con action.keyword)
4. **Timeline de errores** (Gráfico de área)

### Dashboard de Performance
**Objetivo**: Análisis de rendimiento

**Visualizaciones**:
1. **Requests por servicio** (Gráfico de barras)
2. **Tiempo de respuesta promedio** (si se implementa)
3. **Throughput por hora** (Gráfico de líneas)
4. **Top acciones** (Tabla)

## Consultas útiles en Kibana

### Búsquedas básicas
```
# Todos los logs de un servicio
service: "USER_SERVICE"

# Solo errores
level: "ERROR"

# Logs de las últimas 24 horas
timestamp: [now-24h TO now]

# Búsqueda por texto
message: "usuario"

# Combinación de filtros
service: "USER_SERVICE" AND level: "ERROR"
```

### Búsquedas avanzadas
```
# Logs de múltiples servicios
service: ("USER_SERVICE" OR "CREATE_USER_SERVICE")

# Logs con datos específicos
data.userId: "123"

# Logs por rango de tiempo específico
timestamp: [2024-01-01 TO 2024-01-31]

# Excluir logs de debug
NOT level: "DEBUG"
```

## Alertas recomendadas

### 1. Alerta de errores críticos
- **Condición**: Más de 5 errores en 5 minutos
- **Acción**: Notificación por email/Slack

### 2. Alerta de servicio caído
- **Condición**: No hay logs de un servicio en 10 minutos
- **Acción**: Notificación inmediata

### 3. Alerta de volumen alto
- **Condición**: Más de 1000 logs por hora
- **Acción**: Notificación para escalamiento

## Configuración de campos personalizados

### Campos calculados útiles
1. **response_time**: Tiempo de respuesta (si se implementa)
2. **user_agent**: Información del cliente
3. **request_size**: Tamaño de la petición
4. **error_category**: Categoría del error

### Scripted fields
```javascript
// Duración en segundos
if (doc['data.duration'].size() > 0) {
  return doc['data.duration'].value / 1000;
} else {
  return 0;
}
```

## Mejores prácticas

1. **Retención de datos**: Configurar políticas de retención según necesidades
2. **Índices**: Usar índices por fecha para mejor rendimiento
3. **Mapeo**: Definir mapeos específicos para campos importantes
4. **Dashboards**: Crear dashboards específicos por equipo/servicio
5. **Alertas**: Configurar alertas proactivas para problemas críticos
6. **Backup**: Implementar estrategias de backup para Elasticsearch
