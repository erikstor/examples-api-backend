# 🪟 Guía para Windows

Esta es una guía específica para ejecutar el proyecto en Windows.

## ✅ Lo que ya está funcionando

- ✅ LocalStack corriendo en Docker
- ✅ Tabla DynamoDB creada
- ✅ Dependencias instaladas
- ✅ Pruebas CRUD exitosas

## 🚀 Iniciar la Aplicación

### Opción 1: Git Bash (Recomendado)

```bash
cd localstack
npm run dev
```

### Opción 2: PowerShell

```powershell
cd localstack
npm run dev
```

### Opción 3: CMD

```cmd
cd localstack
npm run dev
```

## 🧪 Probar la API

### Usando Git Bash

Abre **otra terminal Git Bash** y ejecuta:

```bash
# Health Check
curl http://localhost:3000/health

# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","age":25}'

# Listar usuarios
curl http://localhost:3000/api/users
```

### Usando PowerShell

```powershell
# Health Check
Invoke-WebRequest -Uri http://localhost:3000/health | Select-Object -ExpandProperty Content

# Crear usuario
$body = @{
    email = "test@example.com"
    name = "Test User"
    age = 25
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/users `
    -Method POST `
    -ContentType "application/json" `
    -Body $body | Select-Object -ExpandProperty Content

# Listar usuarios
Invoke-WebRequest -Uri http://localhost:3000/api/users | Select-Object -ExpandProperty Content
```

### Usando el Navegador

Abre tu navegador en:
- Health Check: http://localhost:3000/health
- Listar usuarios: http://localhost:3000/api/users

### Usando Postman

1. Importa el archivo `postman_collection.json`
2. Ejecuta las peticiones desde Postman

### Usando REST Client (VS Code)

1. Instala la extensión "REST Client" en VS Code
2. Abre el archivo `requests.http`
3. Haz clic en "Send Request" sobre cada petición

## 📝 Scripts PowerShell Útiles

### test-api.ps1

Crea este archivo para probar la API:

```powershell
# test-api.ps1
Write-Host "🧪 Probando API..." -ForegroundColor Green

# 1. Health Check
Write-Host "`n1️⃣ Health Check..." -ForegroundColor Yellow
$health = Invoke-WebRequest -Uri http://localhost:3000/health
Write-Host $health.Content

# 2. Crear usuario
Write-Host "`n2️⃣ Creando usuario..." -ForegroundColor Yellow
$body = @{
    email = "test@example.com"
    name = "Test User"
    age = 25
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/api/users `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$userData = $response.Content | ConvertFrom-Json
$userId = $userData.data.id
Write-Host "Usuario creado con ID: $userId"

# 3. Obtener usuario
Write-Host "`n3️⃣ Obteniendo usuario..." -ForegroundColor Yellow
$user = Invoke-WebRequest -Uri "http://localhost:3000/api/users/$userId"
Write-Host $user.Content

# 4. Listar usuarios
Write-Host "`n4️⃣ Listando usuarios..." -ForegroundColor Yellow
$users = Invoke-WebRequest -Uri http://localhost:3000/api/users
Write-Host $users.Content

# 5. Actualizar usuario
Write-Host "`n5️⃣ Actualizando usuario..." -ForegroundColor Yellow
$updateBody = @{
    name = "Test User Updated"
    age = 26
} | ConvertTo-Json

$updated = Invoke-WebRequest -Uri "http://localhost:3000/api/users/$userId" `
    -Method PUT `
    -ContentType "application/json" `
    -Body $updateBody
Write-Host $updated.Content

# 6. Eliminar usuario
Write-Host "`n6️⃣ Eliminando usuario..." -ForegroundColor Yellow
$deleted = Invoke-WebRequest -Uri "http://localhost:3000/api/users/$userId" -Method DELETE
Write-Host $deleted.Content

Write-Host "`n✅ Pruebas completadas!" -ForegroundColor Green
```

Ejecutar:
```powershell
.\test-api.ps1
```

## 🔧 Comandos Docker para Windows

### Ver estado de LocalStack
```powershell
docker ps | Select-String localstack
```

### Ver logs
```powershell
cd localstack
docker-compose logs -f
```

### Reiniciar LocalStack
```powershell
docker-compose restart
```

### Detener LocalStack
```powershell
docker-compose down
```

### Detener y eliminar datos
```powershell
docker-compose down -v
Remove-Item -Recurse -Force localstack-data -ErrorAction SilentlyContinue
```

## 🛠️ Comandos npm

```bash
# En el directorio localstack/

# Inicializar/Recrear tabla
npm run init-db
npm run init-db -- --force

# Probar CRUD
npm run test-crud

# Iniciar aplicación
npm run dev                    # Desarrollo
npm run build                  # Compilar
npm start                      # Producción

# Limpiar
npm run clean
```

## 🔍 Verificar que todo funciona

### 1. LocalStack está corriendo
```powershell
docker ps | Select-String localstack
```
Deberías ver: `localstack-dynamodb` con estado `Up` y `(healthy)`

### 2. DynamoDB está disponible
```bash
curl http://localhost:4566/_localstack/health
```
Deberías ver: `"dynamodb": "available"`

### 3. La tabla existe
```bash
# Si tienes AWS CLI instalado
aws dynamodb list-tables --endpoint-url http://localhost:4566 --region us-east-1
```

## 📦 Instalación de Herramientas Opcionales

### AWS CLI (para comandos avanzados)

Descarga e instala desde:
https://awscli.amazonaws.com/AWSCLIV2.msi

Verifica:
```powershell
aws --version
```

### jq (para formatear JSON)

**Usando Chocolatey:**
```powershell
choco install jq
```

**O descarga desde:**
https://stedolan.github.io/jq/download/

### Usar con curl:
```bash
curl http://localhost:3000/api/users | jq
```

## 🎯 Flujo de Trabajo Completo en Windows

### Terminal 1 (Git Bash o PowerShell)
```bash
cd c:/Users/JARVIS/Desktop/examples-api-backend/typescript/localstack

# Asegurarse de que LocalStack está corriendo
docker ps | grep localstack

# Iniciar la aplicación
npm run dev
```

Deberías ver:
```
==================================================
🚀 Server is running on port 3000
📍 API URL: http://localhost:3000
🏥 Health check: http://localhost:3000/health
👥 Users endpoint: http://localhost:3000/api/users
==================================================
```

### Terminal 2 (Git Bash o PowerShell)
```bash
# Health Check
curl http://localhost:3000/health

# Crear un usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice","age":28}'

# Ver todos los usuarios
curl http://localhost:3000/api/users
```

## 🌐 Usar el Navegador

1. Abre Chrome/Edge/Firefox
2. Instala una extensión REST Client como:
   - **Postman**
   - **Thunder Client** (extensión de VS Code)
   - **REST Client** (extensión de VS Code)

3. O simplemente usa el navegador para GET:
   - http://localhost:3000/health
   - http://localhost:3000/api/users

## 🆘 Problemas Comunes en Windows

### Puerto 3000 ya está en uso
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número que viste)
taskkill /PID <PID> /F

# O cambiar el puerto en .env
# PORT=3001
```

### Docker no inicia
1. Abre Docker Desktop
2. Espera a que diga "Docker Desktop is running"
3. Intenta de nuevo

### Error de permisos
Ejecuta PowerShell o tu terminal como **Administrador**

### Problema con volumes en Docker
Ya está solucionado en la configuración actual, pero si tienes problemas:
```powershell
docker-compose down -v
docker-compose up -d
```

## 📚 Archivos de Referencia

- **README.md** - Documentación completa
- **QUICKSTART.md** - Guía rápida
- **RESUMEN.md** - Estado del proyecto
- **TEST_COMMANDS.md** - Comandos de prueba (Linux/Mac)
- **AWS_CLI_COMMANDS.md** - Referencia AWS CLI
- **requests.http** - Tests para VS Code REST Client
- **postman_collection.json** - Colección Postman

## ✨ Tips para Windows

### Usar Git Bash en VS Code
1. Abre VS Code
2. Presiona `Ctrl + ñ` o `Ctrl + `` para abrir terminal
3. Click en el dropdown de shells (arriba a la derecha)
4. Selecciona "Git Bash"

### Atajos de teclado
- **Ctrl + C** - Detener la aplicación
- **Ctrl + ñ** - Abrir/cerrar terminal en VS Code
- **Ctrl + Shift + ñ** - Nueva terminal

### Variables de entorno
Si necesitas cambiar configuración, edita el archivo `.env`:
```
PORT=3000
AWS_ENDPOINT=http://localhost:4566
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=Users
```

---

## 🎉 ¡Listo para Usar!

Ahora puedes:
1. Iniciar la aplicación con `npm run dev`
2. Probar con cURL, PowerShell, navegador o Postman
3. Revisar la documentación según necesites

¡Disfruta programando! 🚀

