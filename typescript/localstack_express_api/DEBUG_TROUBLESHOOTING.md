# 🔧 Troubleshooting - Debugging

## ❌ Error: "Unknown file extension .ts"

### Problema
```
Uncaught TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
```

### Soluciones

#### Solución 1: Abrir VS Code en el directorio correcto ✅ RECOMENDADO

El problema más común es que VS Code/Cursor está abierto en el directorio padre en lugar del directorio `localstack/`.

**Cerrar y volver a abrir:**

1. **Cierra VS Code/Cursor completamente**

2. **Opción A - Desde terminal:**
   ```bash
   cd c:/Users/JARVIS/Desktop/examples-api-backend/typescript/localstack
   code .
   ```

3. **Opción B - Abrir carpeta:**
   - File → Open Folder
   - Navega a: `examples-api-backend\typescript\localstack`
   - Haz clic en "Select Folder"

4. **Opción C - Usar workspace:**
   - Abre el archivo `localstack.code-workspace`
   - O desde terminal: `code localstack.code-workspace`

5. **Verifica el directorio:**
   - Abre la terminal integrada (`Ctrl + ñ`)
   - Ejecuta: `pwd` (Linux/Mac) o `cd` (Windows)
   - Deberías ver: `.../typescript/localstack` (NO solo `typescript`)

#### Solución 2: Verificar que ts-node está instalado

```bash
# En el directorio localstack/
npm list ts-node
```

Si no está instalado:
```bash
npm install
```

#### Solución 3: Limpiar y reinstalar

```bash
cd localstack
rm -rf node_modules package-lock.json
npm install
```

#### Solución 4: Usar la configuración correcta

En el panel de Debug (Ctrl+Shift+D), asegúrate de seleccionar:
- ✅ `🚀 Debug API (Development)`
- ❌ NO "Launch Program" (configuración antigua)

## ❌ Error: Cannot find module

### Problema
```
Error: Cannot find module 'express'
Error: Cannot find module '@aws-sdk/client-dynamodb'
```

### Solución

```bash
cd localstack
npm install
```

## ❌ Breakpoints no se activan

### Problema
Pones un breakpoint pero el código no se detiene.

### Soluciones

1. **Verifica que estés usando la configuración correcta:**
   - Usa `🚀 Debug API (Development)` para desarrollo
   - NO uses `🏗️ Debug API (Compiled)` a menos que hayas compilado

2. **Asegúrate de hacer una petición HTTP:**
   - El código solo se ejecuta cuando haces una petición
   - Usa curl, Postman, o requests.http

3. **Verifica que el servidor esté corriendo:**
   - Deberías ver: "Server is running on port 3000"
   - Si no aparece, revisa la consola de debug

4. **Limpia breakpoints antiguos:**
   - Debug → Remove All Breakpoints
   - Pon uno nuevo y prueba

## ❌ Puerto 3000 ya está en uso

### Problema
```
Error: listen EADDRINUSE: address already in use :::3000
```

### Solución

**Opción 1 - Matar el proceso:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Windows CMD
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Opción 2 - Cambiar el puerto:**
Edita `.env`:
```
PORT=3001
```

## ❌ LocalStack no está disponible

### Problema
```
Error connecting to DynamoDB
Connection refused to localhost:4566
```

### Solución

1. **Verifica que LocalStack esté corriendo:**
   ```bash
   docker ps | grep localstack
   ```

2. **Si no está corriendo:**
   ```bash
   docker-compose up -d
   ```

3. **Verifica que DynamoDB esté disponible:**
   ```bash
   curl http://localhost:4566/_localstack/health
   ```

4. **Espera unos segundos:**
   LocalStack puede tardar 10-15 segundos en estar listo después de iniciar.

## ❌ Variables de entorno no se cargan

### Problema
Las variables de `.env` no están disponibles.

### Solución

1. **Verifica que `.env` existe:**
   ```bash
   ls -la .env
   ```

2. **Si no existe, cópialo:**
   ```bash
   cp env.example .env
   ```

3. **Verifica el contenido:**
   ```bash
   cat .env
   ```

   Debería tener:
   ```
   AWS_REGION=us-east-1
   AWS_ENDPOINT=http://localhost:4566
   AWS_ACCESS_KEY_ID=test
   AWS_SECRET_ACCESS_KEY=test
   PORT=3000
   NODE_ENV=development
   DYNAMODB_TABLE_NAME=Users
   ```

## ❌ Debug Console muestra errores extraños

### Problema
Errores como "Deprecated features" o warnings de Node.js.

### Solución

Esto es normal. Los warnings están deshabilitados en la configuración con `--no-warnings`.

Si quieres verlos, edita `.vscode/launch.json` y elimina:
```json
"--no-warnings"
```

## ✅ Verificación Completa

### Checklist antes de debuggear:

```bash
# 1. Estás en el directorio correcto
pwd
# Debería mostrar: .../typescript/localstack

# 2. LocalStack está corriendo
docker ps | grep localstack
# Debería mostrar: localstack-dynamodb ... Up ... (healthy)

# 3. Dependencias instaladas
ls node_modules
# Debería mostrar muchos directorios

# 4. Tabla DynamoDB creada
npm run init-db

# 5. Archivo .env existe
cat .env

# 6. ts-node instalado
npm list ts-node
# Debería mostrar: ts-node@10.9.2
```

## 📞 Flujo Correcto Completo

### Paso 1: Setup inicial (solo una vez)
```bash
cd c:/Users/JARVIS/Desktop/examples-api-backend/typescript/localstack

# Asegurarte de que todo está instalado
npm install

# Iniciar LocalStack
docker-compose up -d

# Esperar 10 segundos
sleep 10

# Crear tabla
npm run init-db
```

### Paso 2: Abrir VS Code correctamente
```bash
# Cerrar VS Code si está abierto

# Abrir en el directorio correcto
code .

# O abrir el workspace
code localstack.code-workspace
```

### Paso 3: Poner breakpoint y debuggear
1. Abre `src/services/UserService.ts`
2. Pon breakpoint en línea 16 (dentro de `createUser`)
3. Presiona `F5`
4. Selecciona `🚀 Debug API (Development)`
5. Espera a ver: "Server is running on port 3000"

### Paso 4: Disparar el breakpoint
En otra terminal:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","age":25}'
```

### Paso 5: Debuggear
- Debería detenerse en tu breakpoint
- Usa `F10` para ir línea por línea
- Inspecciona variables en el panel izquierdo

## 🆘 Último Recurso

Si nada funciona:

```bash
# 1. Detener todo
docker-compose down

# 2. Limpiar completamente
rm -rf node_modules package-lock.json dist

# 3. Reinstalar
npm install

# 4. Reiniciar LocalStack
docker-compose up -d
sleep 15

# 5. Inicializar DB
npm run init-db

# 6. Cerrar VS Code completamente

# 7. Abrir VS Code de nuevo
code .

# 8. Intentar debuggear nuevamente
```

## 💡 Tips Importantes

1. **Siempre abre VS Code en el directorio `localstack/`**, no en `typescript/`

2. **Usa el workspace file**: `localstack.code-workspace` para garantizar la configuración correcta

3. **Verifica el terminal integrado**: Debe mostrar el path correcto cuando lo abres

4. **El debugger necesita LocalStack corriendo**: No funcionará sin él

5. **Espera a ver "Server is running"**: No hagas peticiones antes de esto

---

## 📖 Documentación Relacionada

- [DEBUG_GUIDE.md](DEBUG_GUIDE.md) - Guía completa de debugging
- [DEBUGGING_QUICK_START.md](DEBUGGING_QUICK_START.md) - Inicio rápido
- [WINDOWS-GUIDE.md](WINDOWS-GUIDE.md) - Guía específica para Windows

Si sigues teniendo problemas, verifica que hayas seguido todos los pasos de [QUICKSTART.md](QUICKSTART.md) primero.

