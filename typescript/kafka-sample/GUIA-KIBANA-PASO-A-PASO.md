# Guía Paso a Paso: Configurar Reportes en Kibana

## 🚀 Paso 1: Iniciar los Servicios

### 1.1 Levantar la infraestructura
```bash
# Desde la carpeta kafka-sample
docker-compose up -d
```

### 1.2 Verificar que todo esté funcionando
```bash
# Verificar Elasticsearch
curl http://localhost:9200

# Verificar Kibana (esperar 1-2 minutos)
curl http://localhost:5601
```

**✅ Resultado esperado**: Deberías ver respuestas JSON de ambos servicios.

---

## 📊 Paso 2: Acceder a Kibana

### 2.1 Abrir Kibana
1. Abre tu navegador
2. Ve a: `http://localhost:5601`
3. **Espera** hasta que Kibana esté completamente cargado (puede tomar 1-2 minutos)

### 2.2 Primera configuración
- Kibana te mostrará una pantalla de bienvenida
- Haz clic en **"Explore on my own"** o **"Explorar por mi cuenta"**

---

## 🔍 Paso 3: Crear tu Primer Index Pattern

### 3.1 Acceder a Index Patterns
1. En el menú lateral izquierdo, busca **"Stack Management"** (Gestión de Stack)
2. Haz clic en **"Index Patterns"** (Patrones de Índice)

### 3.2 Crear el patrón
1. Haz clic en **"Create index pattern"** (Crear patrón de índice)
2. En el campo **"Index pattern name"** escribe: `microservices-logs*`
3. Haz clic en **"Next step"** (Siguiente paso)

### 3.3 Configurar el campo de tiempo
1. En la lista de campos disponibles, busca `timestamp`
2. Selecciona `timestamp` como **"Time field"** (Campo de tiempo)
3. Haz clic en **"Create index pattern"** (Crear patrón de índice)

**✅ Resultado esperado**: Verás una lista de campos disponibles para tu índice.

---

## 📈 Paso 4: Crear tu Primer Reporte - Dashboard de Logs

### 4.1 Acceder a Discover
1. En el menú lateral, haz clic en **"Discover"** (Descubrir)
2. En la parte superior, selecciona el índice `microservices-logs*`

### 4.2 Ver los datos
- Si tienes datos, los verás en la tabla inferior
- Si no hay datos, necesitamos generar algunos (ver paso siguiente)

---

## 🎯 Paso 5: Generar Datos de Ejemplo

### 5.1 Iniciar los microservicios
```bash
# Terminal 1 - Servicio de usuarios
npm run start:user-service

# Terminal 2 - Servicio de logging
npm run start:logging-service

# Terminal 3 - Servicio de creación de usuarios
npm run start:create-user-service
```

### 5.2 Generar actividad
```bash
# Hacer algunas peticiones para generar logs
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Pérez", "email": "juan@ejemplo.com"}'

curl -X GET http://localhost:3001/users
```

---

## 📊 Paso 6: Crear Visualizaciones

### 6.1 Crear gráfico de logs por hora
1. Ve a **"Visualize Library"** (Biblioteca de Visualizaciones)
2. Haz clic en **"Create visualization"** (Crear visualización)
3. Selecciona **"Line"** (Línea)
4. Selecciona el índice `microservices-logs*`

#### Configurar el gráfico:
- **Métricas**: Count (Recuento)
- **Buckets**: 
  - Add > X-axis
  - Aggregation: Date Histogram
  - Field: timestamp
  - Interval: 1h

### 6.2 Crear gráfico de logs por servicio
1. Crea una nueva visualización
2. Selecciona **"Vertical Bar Chart"** (Gráfico de barras vertical)
3. Selecciona el índice `microservices-logs*`

#### Configurar el gráfico:
- **Métricas**: Count (Recuento)
- **Buckets**:
  - Add > Y-axis
  - Aggregation: Terms
  - Field: service.keyword
  - Size: 10

---

## 🎨 Paso 7: Crear Dashboard

### 7.1 Crear el dashboard
1. Ve a **"Dashboard"** (Tablero)
2. Haz clic en **"Create dashboard"** (Crear tablero)
3. Haz clic en **"Add panel"** (Agregar panel)

### 7.2 Agregar visualizaciones
1. Selecciona las visualizaciones que creaste en el paso 6
2. Arrastra y organiza los paneles como prefieras
3. Haz clic en **"Save"** (Guardar)
4. Dale un nombre al dashboard: "Mi Primer Dashboard"

---

## 🔍 Paso 8: Usar Filtros y Búsquedas

### 8.1 Búsquedas básicas
En la barra de búsqueda de Discover, puedes usar:

```
# Ver todos los logs
*

# Solo errores
level: "ERROR"

# Logs de un servicio específico
service: "USER_SERVICE"

# Logs de las últimas 24 horas
timestamp: [now-24h TO now]

# Combinar filtros
service: "USER_SERVICE" AND level: "ERROR"
```

### 8.2 Aplicar filtros
1. Haz clic en cualquier valor en la tabla de resultados
2. Selecciona **"Add filter"** (Agregar filtro)
3. El filtro aparecerá en la parte superior

---

## 📋 Paso 9: Crear Alertas (Opcional)

### 9.1 Configurar alerta de errores
1. Ve a **"Stack Management"** > **"Rules and Connectors"**
2. Haz clic en **"Create rule"** (Crear regla)
3. Selecciona **"Log threshold"** (Umbral de logs)

#### Configurar la regla:
- **Name**: "Alerta de Errores"
- **Index**: microservices-logs*
- **Query**: `level: "ERROR"`
- **Threshold**: Greater than 5
- **Time window**: 5 minutes

---

## 🎯 Paso 10: Reportes Avanzados

### 10.1 Exportar datos
1. En Discover, configura tu vista
2. Haz clic en **"Share"** (Compartir)
3. Selecciona **"CSV Reports"** para exportar

### 10.2 Programar reportes
1. Ve a **"Stack Management"** > **"Reporting"**
2. Haz clic en **"Create job"** (Crear trabajo)
3. Selecciona tu dashboard
4. Configura la frecuencia (diaria, semanal, etc.)

---

## 🚨 Solución de Problemas Comunes

### Problema: No veo datos en Kibana
**Solución**:
1. Verifica que Elasticsearch esté funcionando: `curl http://localhost:9200`
2. Verifica que los microservicios estén enviando logs
3. Espera unos minutos para que los datos se indexen

### Problema: Kibana no carga
**Solución**:
1. Espera 2-3 minutos después de iniciar docker-compose
2. Verifica que no haya errores en los logs: `docker-compose logs kibana`

### Problema: No encuentro el campo timestamp
**Solución**:
1. Verifica que los microservicios estén enviando logs con el campo `timestamp`
2. Usa `@timestamp` en lugar de `timestamp` si es necesario

---

## 📚 Próximos Pasos

1. **Explora más visualizaciones**: Pie charts, heat maps, etc.
2. **Crea dashboards específicos**: Por servicio, por nivel de error, etc.
3. **Configura alertas**: Para errores críticos, servicios caídos, etc.
4. **Aprende KQL**: Kibana Query Language para búsquedas avanzadas
5. **Configura usuarios**: Si necesitas control de acceso

---

## 🎉 ¡Felicidades!

Has configurado tu primer reporte en Kibana. Ahora puedes:
- Ver logs en tiempo real
- Crear visualizaciones personalizadas
- Configurar alertas automáticas
- Exportar reportes

**Recuerda**: Kibana es muy potente, empieza simple y ve agregando complejidad gradualmente.
