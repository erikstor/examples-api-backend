# 🔧 Guía de Troubleshooting

Esta guía te ayudará a resolver los problemas más comunes.

## ❌ Error: "socket hang up" o "ECONNRESET" al inicializar DynamoDB

### Síntoma
```
❌ Error creating table: Error [TimeoutError]: socket hang up
code: 'ECONNRESET'
```

### Causa
LocalStack necesita tiempo para inicializarse completamente. El script intentó conectarse demasiado rápido.

### Solución

#### Opción 1: Esperar y reintentar (Más rápida)
```bash
# Esperar 15 segundos
sleep 15

# Intentar de nuevo
npm run init-db
```

#### Opción 2: Reiniciar LocalStack
```bash
# Detener LocalStack
docker-compose down

# Iniciar de nuevo
docker-compose up -d

# Esperar 15-20 segundos
sleep 15

# Inicializar DB
npm run init-db
```

#### Opción 3: Usar el script de inicio actualizado
```bash
# Bash (Linux/Mac/Git Bash)
bash start.sh

# PowerShell (Windows)
.\start.ps1
```

Los scripts actualizados ahora esperan automáticamente.

### Verificar que LocalStack está listo

```bash
# Ver estado de salud
curl http://localhost:4566/_localstack/health

# Ver logs
docker logs localstack-lambda

# Ver contenedores corriendo
docker ps
```

## ❌ Error: "Port 4566 is already allocated"

### Síntoma
```
Error: bind: address already in use
```

### Causa
Ya hay algo usando el puerto 4566 (probablemente otra instancia de LocalStack).

### Solución

#### Opción 1: Detener el contenedor existente
```bash
docker-compose down
docker-compose up -d
```

#### Opción 2: Encontrar y matar el proceso
**En Windows PowerShell:**
```powershell
# Encontrar qué usa el puerto
netstat -ano | findstr :4566

# Matar el proceso (reemplaza <PID> con el ID del proceso)
taskkill /PID <PID> /F
```

**En Linux/Mac/Git Bash:**
```bash
# Encontrar qué usa el puerto
lsof -i :4566

# Matar el proceso
kill -9 <PID>
```

#### Opción 3: Cambiar el puerto
Edita `docker-compose.yml`:
```yaml
ports:
  - "4567:4566"  # Cambiar 4566 a otro puerto
```

Y actualiza `.env`:
```env
AWS_ENDPOINT=http://localhost:4567
```

## ❌ Error: "Cannot connect to Docker daemon"

### Síntoma
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

### Causa
Docker Desktop no está corriendo o no tienes permisos.

### Solución

#### Windows
1. Abre Docker Desktop desde el menú de inicio
2. Espera a que el ícono en la bandeja muestre "Docker Desktop is running"
3. Intenta de nuevo

#### Linux
```bash
# Iniciar Docker
sudo systemctl start docker

# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión para aplicar cambios
```

#### Mac
1. Abre Docker Desktop desde Applications
2. Espera a que se inicie completamente
3. Intenta de nuevo

## ❌ Error: "Table already exists"

### Síntoma
```
⚠️ Table Users already exists
```

### Causa
La tabla ya fue creada anteriormente.

### Solución

#### Opción 1: Usar la tabla existente (Recomendado)
```bash
# No hacer nada, la tabla ya existe y funciona
npm run local
```

#### Opción 2: Recrear la tabla
```bash
npm run init-db -- --force
```

Esto eliminará y recreará la tabla (perderás los datos).

## ❌ Error: "Lambda function not found"

### Síntoma
```
Function not found: arn:aws:lambda:...
```

### Causa
La Lambda no ha sido desplegada.

### Solución
```bash
# Compilar y desplegar
npm run build
npm run deploy
```

## ❌ Error al compilar con Webpack

### Síntoma
```
ERROR in ...
Module not found
```

### Causa
Dependencias no instaladas o configuración incorrecta.

### Solución

#### Opción 1: Reinstalar dependencias
```bash
# Eliminar node_modules
rm -rf node_modules

# Reinstalar
npm install
```

#### Opción 2: Limpiar y recompilar
```bash
npm run clean
npm run build
```

#### Opción 3: Verificar versión de Node
```bash
# Necesitas Node.js 18.x o superior
node --version

# Si es menor, actualiza Node.js
```

## ❌ Error: "AWS CLI command not found"

### Síntoma
```
bash: aws: command not found
```

### Causa
AWS CLI no está instalado (solo necesario para algunos scripts).

### Solución

#### Opción 1: Usar scripts de NPM (Recomendado)
```bash
# En lugar de usar AWS CLI directamente
npm run deploy
npm test
```

#### Opción 2: Instalar AWS CLI

**Windows:**
- Descarga desde: https://aws.amazon.com/cli/
- O con Chocolatey: `choco install awscli`

**Mac:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

## ❌ Debugging no funciona en VS Code

### Síntoma
Breakpoints no se activan o el debugger no se conecta.

### Solución

#### 1. Verificar que LocalStack está corriendo
```bash
docker ps
```

#### 2. Verificar que la tabla existe
```bash
npm run init-db
```

#### 3. Usar la configuración correcta
- Presiona F5
- Selecciona "Debug Lambda Local" (no otras configuraciones)

#### 4. Verificar source maps
```bash
# Los source maps deben existir
ls dist/*.map
```

Si no existen:
```bash
npm run build:dev
```

## ❌ Error: "Cannot find module 'dotenv'"

### Síntoma
```
Error: Cannot find module 'dotenv'
```

### Causa
Dependencias no instaladas.

### Solución
```bash
npm install
```

## ❌ API Gateway retorna "Internal Server Error"

### Síntoma
```bash
curl ... → {"message": "Internal server error"}
```

### Causa
La Lambda tiene errores o no está desplegada correctamente.

### Solución

#### 1. Ver logs de Lambda
```bash
docker logs localstack-lambda -f
```

#### 2. Probar Lambda directamente
```bash
npm run local
```

#### 3. Redesplegar Lambda
```bash
npm run build
npm run deploy
```

#### 4. Reconfigurar API Gateway
```bash
npm run setup-api
```

## ❌ Error: "Missing Authentication Token"

### Síntoma
```
{"message":"Missing Authentication Token"}
```

### Causa
URL incorrecta o API ID incorrecto.

### Solución

#### 1. Verificar API ID
```bash
cat .env.api
```

#### 2. Usar el formato correcto de URL
```
http://localhost:4566/restapis/{API_ID}/dev/_user_request_/{path}
```

#### 3. Listar APIs disponibles
```bash
aws --endpoint-url=http://localhost:4566 apigateway get-rest-apis
```

## 🔍 Comandos de Diagnóstico

### Verificar estado general
```bash
# LocalStack corriendo
docker ps | grep localstack

# LocalStack respondiendo
curl http://localhost:4566/_localstack/health

# Tabla DynamoDB existe
aws --endpoint-url=http://localhost:4566 dynamodb list-tables

# Lambda desplegada
aws --endpoint-url=http://localhost:4566 lambda list-functions

# API Gateway configurada
aws --endpoint-url=http://localhost:4566 apigateway get-rest-apis
```

### Ver logs detallados
```bash
# Logs de LocalStack
docker logs localstack-lambda -f

# Últimas 100 líneas
docker logs localstack-lambda --tail 100

# Logs desde hace 5 minutos
docker logs localstack-lambda --since 5m
```

### Reinicio completo
```bash
# Detener todo
docker-compose down

# Eliminar datos persistentes (opcional)
rm -rf localstack-data/

# Limpiar compilación
npm run clean

# Iniciar desde cero
docker-compose up -d
sleep 15
npm run init-db
npm run build
npm run deploy
```

## 📞 ¿Aún tienes problemas?

### Checklist de verificación

- [ ] Docker Desktop está corriendo
- [ ] LocalStack responde en http://localhost:4566
- [ ] Tabla DynamoDB creada (`npm run init-db`)
- [ ] Lambda compilada (`npm run build`)
- [ ] Lambda desplegada (`npm run deploy`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Node.js versión 18.x o superior

### Información útil para reportar problemas

```bash
# Versión de Node
node --version

# Versión de npm
npm --version

# Versión de Docker
docker --version

# Estado de LocalStack
docker ps
docker logs localstack-lambda --tail 50

# Estado de los servicios
curl http://localhost:4566/_localstack/health
```

## 💡 Tips de Prevención

### 1. Siempre espera después de iniciar LocalStack
```bash
docker-compose up -d
sleep 15  # ¡Importante!
```

### 2. Verifica antes de continuar
```bash
curl http://localhost:4566/_localstack/health
```

### 3. Usa los scripts de inicio
```bash
# Estos scripts ya esperan automáticamente
bash start.sh      # o
.\start.ps1
```

### 4. Revisa los logs regularmente
```bash
docker logs localstack-lambda -f
```

### 5. Mantén Docker Desktop actualizado
Actualiza regularmente Docker Desktop para evitar bugs.

---

**¿Resolviste tu problema?** ¡Genial! Ahora puedes continuar con [QUICKSTART.md](./QUICKSTART.md)

