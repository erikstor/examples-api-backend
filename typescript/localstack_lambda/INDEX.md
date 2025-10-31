# 📚 Índice de Documentación

Esta es una guía rápida de toda la documentación disponible en el proyecto.

## 🚀 Para Empezar

### ¿Eres nuevo? Empieza aquí:

1. **[RESUMEN.md](./RESUMEN.md)** ⭐
   - Resumen ejecutivo del proyecto
   - Qué hace y por qué
   - Tecnologías utilizadas
   - **Lee esto primero**

2. **[QUICKSTART.md](./QUICKSTART.md)** ⚡
   - Guía de 5 minutos para poner todo en marcha
   - Pasos rápidos
   - Comandos esenciales
   - **Úsalo para iniciar rápido**

3. **[README.md](./README.md)** 📖
   - Documentación completa del proyecto
   - Todos los detalles
   - API endpoints
   - Scripts disponibles
   - **Referencia completa**

## 🏗️ Para Entender la Arquitectura

4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** 🏛️
   - Explicación detallada de la arquitectura en capas
   - Patrones de diseño utilizados
   - Principios SOLID aplicados
   - Flujo de datos
   - **Lee esto para entender el código**

## 🔧 Para Resolver Problemas

5. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** 🔧
   - Soluciones a problemas comunes
   - Error de timeout al inicializar DB
   - Problemas con Docker y puertos
   - Comandos de diagnóstico
   - **Lee esto si tienes algún error**

## 🪟 Para Usuarios de Windows

6. **[WINDOWS-GUIDE.md](./WINDOWS-GUIDE.md)** 💻
   - Guía específica para Windows
   - Solución de problemas comunes en Windows
   - PowerShell vs Git Bash
   - Configuración de Docker Desktop
   - **Esencial si usas Windows**

## 🌐 Para Usar API Gateway

7. **[API-GATEWAY-GUIDE.md](./API-GATEWAY-GUIDE.md)** 🌐
   - Cómo configurar API Gateway con LocalStack
   - Endpoints HTTP reales para tu Lambda
   - Ejemplos con curl y Postman
   - Troubleshooting de API Gateway
   - **Lee esto para probar con endpoints HTTP**

## 📂 Estructura y Organización

8. **[ESTRUCTURA-PROYECTO.md](./ESTRUCTURA-PROYECTO.md)** 📂
   - Estructura completa del proyecto
   - Estadísticas de archivos
   - Convenciones de nombres
   - Dependencias entre capas
   - **Útil para entender la organización**

## 📂 Otros Recursos

### Archivos de Configuración

- **[package.json](./package.json)**: Dependencias y scripts NPM
- **[tsconfig.json](./tsconfig.json)**: Configuración de TypeScript
- **[webpack.config.js](./webpack.config.js)**: Configuración de Webpack
- **[docker-compose.yml](./docker-compose.yml)**: Configuración de LocalStack

### Scripts de Inicio

- **[start.sh](./start.sh)**: Script de inicio para Linux/Mac/Git Bash
- **[start.ps1](./start.ps1)**: Script de inicio para PowerShell (Windows)
- **[stop.sh](./stop.sh)**: Script para detener (Linux/Mac/Git Bash)
- **[stop.ps1](./stop.ps1)**: Script para detener (PowerShell)

### Herramientas de Desarrollo

- **[requests.http](./requests.http)**: Ejemplos de requests HTTP para testing
- **[.vscode/launch.json](./.vscode/launch.json)**: Configuración de debugging
- **[.vscode/settings.json](./.vscode/settings.json)**: Configuración de VS Code

## 🗺️ Flujo de Lectura Recomendado

### Para Principiantes

```
1. RESUMEN.md        → Entender qué es el proyecto
2. QUICKSTART.md     → Poner todo en marcha (5 min)
3. README.md         → Leer secciones relevantes
4. ARCHITECTURE.md   → Entender la arquitectura (cuando estés listo)
```

### Para Usuarios de Windows

```
1. RESUMEN.md        → Entender qué es el proyecto
2. WINDOWS-GUIDE.md  → Configurar entorno Windows
3. QUICKSTART.md     → Poner todo en marcha
4. README.md         → Referencia completa
```

### Para Desarrolladores Experimentados

```
1. RESUMEN.md        → Vista rápida
2. ARCHITECTURE.md   → Entender la arquitectura
3. Explorar src/     → Ver el código directamente
4. README.md         → Consultar según necesites
```

## 📝 Documentación por Tema

### Instalación y Setup

- [QUICKSTART.md](./QUICKSTART.md) - Pasos rápidos
- [WINDOWS-GUIDE.md](./WINDOWS-GUIDE.md) - Setup en Windows
- [README.md](./README.md) - Instalación completa

### Desarrollo

- [README.md](./README.md) - Scripts de desarrollo
- [requests.http](./requests.http) - Ejemplos de requests
- [.vscode/launch.json](./.vscode/launch.json) - Configuración de debugging

### Arquitectura y Diseño

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura completa
- [RESUMEN.md](./RESUMEN.md) - Patrones utilizados
- Código fuente en `src/` - Implementación

### Despliegue y Testing

- [README.md](./README.md) - Comandos de despliegue
- [scripts/](./scripts/) - Scripts de automatización
- [docker-compose.yml](./docker-compose.yml) - LocalStack

### Troubleshooting

- [WINDOWS-GUIDE.md](./WINDOWS-GUIDE.md) - Problemas en Windows
- [README.md](./README.md) - Troubleshooting general
- [QUICKSTART.md](./QUICKSTART.md) - Problemas comunes

## 🎯 Documentación por Rol

### Si eres Estudiante

1. **RESUMEN.md** - Entender el proyecto
2. **ARCHITECTURE.md** - Aprender arquitectura en capas
3. **README.md** - Referencia técnica
4. Explorar el código en `src/`

### Si eres Desarrollador

1. **RESUMEN.md** - Vista general rápida
2. **QUICKSTART.md** - Poner en marcha
3. **README.md** - API y comandos
4. **requests.http** - Probar endpoints

### Si eres Arquitecto

1. **RESUMEN.md** - Contexto del proyecto
2. **ARCHITECTURE.md** - Decisiones de diseño
3. Revisar estructura en `src/`
4. **README.md** - Detalles técnicos

### Si eres DevOps

1. **docker-compose.yml** - Configuración de contenedores
2. **README.md** - Scripts de despliegue
3. **scripts/** - Automatización
4. **webpack.config.js** - Build process

## 🔍 Búsqueda Rápida

### "¿Cómo inicio el proyecto?"
→ [QUICKSTART.md](./QUICKSTART.md)

### "¿Qué es este proyecto?"
→ [RESUMEN.md](./RESUMEN.md)

### "¿Cómo está organizado el código?"
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

### "¿Cómo debuggeo la Lambda?"
→ [README.md](./README.md) - Sección "Debugging"

### "Tengo problemas en Windows"
→ [WINDOWS-GUIDE.md](./WINDOWS-GUIDE.md)

### "¿Cómo despliego la Lambda?"
→ [README.md](./README.md) - Sección "Compilación y Despliegue"

### "¿Qué endpoints están disponibles?"
→ [README.md](./README.md) - Sección "API Endpoints"

### "¿Cómo pruebo la Lambda?"
→ [requests.http](./requests.http) o [README.md](./README.md) - Sección "Testing"

## 📞 ¿Necesitas Ayuda?

1. **Primero**: Busca en el INDEX.md (este archivo)
2. **Segundo**: Lee la documentación relevante
3. **Tercero**: Revisa los logs: `docker logs localstack-lambda`
4. **Cuarto**: Consulta [WINDOWS-GUIDE.md](./WINDOWS-GUIDE.md) si estás en Windows

## ✅ Checklist de Lectura

### Inicial (Obligatorio)
- [ ] RESUMEN.md
- [ ] QUICKSTART.md

### Esencial
- [ ] README.md (al menos las secciones principales)
- [ ] ARCHITECTURE.md (si quieres entender el código)

### Opcional (según tu caso)
- [ ] WINDOWS-GUIDE.md (si usas Windows)
- [ ] requests.http (para probar endpoints)
- [ ] Archivos de configuración (si necesitas ajustes)

---

**Tip**: Usa Ctrl+F (o Cmd+F) para buscar en los documentos. Todos están en formato Markdown y son fáciles de leer.

**Consejo**: Empieza siempre por [RESUMEN.md](./RESUMEN.md) y [QUICKSTART.md](./QUICKSTART.md). El resto lo puedes leer según necesites.

