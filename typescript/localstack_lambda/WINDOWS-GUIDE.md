# 🪟 Guía para Windows

Esta guía proporciona instrucciones específicas para ejecutar el proyecto en Windows.

## Requisitos Previos

### 1. Instalar Node.js

Descarga e instala Node.js desde: https://nodejs.org/

Verifica la instalación:
```powershell
node --version
npm --version
```

### 2. Instalar Docker Desktop

Descarga e instala Docker Desktop desde: https://www.docker.com/products/docker-desktop/

**Importante**: Asegúrate de que Docker Desktop esté corriendo antes de continuar.

### 3. Instalar Git Bash (Opcional)

Para ejecutar scripts de bash en Windows:
- Descarga Git para Windows: https://git-scm.com/download/win
- Durante la instalación, asegúrate de que "Git Bash" esté seleccionado

## Opciones para Ejecutar el Proyecto

En Windows, tienes varias opciones para ejecutar el proyecto:

### Opción 1: PowerShell (Recomendado para Windows)

```powershell
# Iniciar el proyecto
.\start.ps1

# Detener el proyecto
.\stop.ps1
```

### Opción 2: Git Bash

```bash
# Iniciar el proyecto
bash start.sh

# Detener el proyecto
bash stop.sh
```

### Opción 3: Comandos Manuales

```powershell
# 1. Iniciar LocalStack
docker-compose up -d

# 2. Instalar dependencias
npm install

# 3. Inicializar base de datos
npm run init-db

# 4. Ejecutar localmente
npm run local

# 5. O desplegar en LocalStack
npm run deploy
npm test
```

## Scripts NPM (Funcionan igual en todas las plataformas)

```powershell
# Desarrollo local
npm run local

# Compilar
npm run build

# Inicializar DB
npm run init-db

# Desplegar Lambda
npm run deploy

# Probar Lambda
npm test

# Limpiar
npm run clean
```

## Debugging en Windows

### Con VS Code

1. Abre el proyecto en VS Code
2. Asegúrate de que LocalStack está corriendo:
   ```powershell
   docker ps
   ```
3. Presiona `F5` o ve a la vista de Debug (Ctrl+Shift+D)
4. Selecciona "Debug Lambda Local"
5. Presiona `F5` o haz clic en "Start Debugging"

### Variables de Entorno en PowerShell

Si necesitas ejecutar comandos manualmente con variables de entorno:

```powershell
$env:AWS_REGION="us-east-1"
$env:AWS_ENDPOINT="http://localhost:4566"
$env:AWS_ACCESS_KEY_ID="test"
$env:AWS_SECRET_ACCESS_KEY="test"
$env:DYNAMODB_TABLE_NAME="Users"

npm run local
```

## Problemas Comunes en Windows

### 1. Docker Desktop no está corriendo

**Síntoma**: Error al ejecutar `docker-compose`

**Solución**:
- Abre Docker Desktop desde el menú de inicio
- Espera a que el ícono de Docker en la bandeja del sistema muestre "Docker Desktop is running"

### 2. Puerto 4566 en uso

**Síntoma**: Error "port is already allocated"

**Solución**:
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :4566

# Detener el proceso (reemplaza <PID> con el ID del proceso)
taskkill /PID <PID> /F

# O simplemente reinicia Docker Desktop
```

### 3. Error de permisos con volúmenes de Docker

**Síntoma**: Error al montar volúmenes

**Solución**:
- Abre Docker Desktop → Settings → Resources → File Sharing
- Asegúrate de que tu directorio de proyecto está compartido
- Reinicia Docker Desktop

### 4. Scripts de PowerShell bloqueados

**Síntoma**: "cannot be loaded because running scripts is disabled"

**Solución**:
```powershell
# Ejecutar PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 5. Problemas con Git Bash y rutas de Windows

**Síntoma**: Rutas no reconocidas en Git Bash

**Solución**:
- Usa rutas de estilo Unix en Git Bash: `/c/Users/...` en lugar de `C:\Users\...`
- O usa PowerShell en su lugar

### 6. AWS CLI no instalado

**Síntoma**: `aws` command not found

**Solución**:

Opción A - Usar scripts de NPM (recomendado):
```powershell
npm run deploy
npm test
```

Opción B - Instalar AWS CLI:
- Descarga desde: https://aws.amazon.com/cli/
- O usa Chocolatey: `choco install awscli`

### 7. Error al compilar con Webpack

**Síntoma**: Error de memoria o compilación lenta

**Solución**:
```powershell
# Aumentar límite de memoria de Node
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## Uso de WSL2 (Windows Subsystem for Linux)

Si tienes WSL2 instalado, puedes usar el proyecto exactamente como en Linux:

```bash
# En WSL2
cd /mnt/c/Users/JARVIS/Desktop/examples-api-backend/typescript/localstack_lambda

# Instalar dependencias
npm install

# Iniciar proyecto
bash start.sh

# Todo lo demás funciona igual que en Linux
```

**Ventajas de WSL2**:
- Mejor rendimiento
- Compatibilidad 100% con scripts de bash
- Integración nativa con VS Code

## Comandos Útiles para Windows

### Ver logs de Docker

```powershell
# Logs de LocalStack
docker logs -f localstack-lambda

# Logs de todos los contenedores
docker-compose logs -f
```

### Verificar estado de LocalStack

```powershell
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores
docker ps -a

# Inspeccionar contenedor
docker inspect localstack-lambda
```

### Limpiar Docker

```powershell
# Detener y eliminar contenedores
docker-compose down

# Eliminar volúmenes también
docker-compose down -v

# Limpiar todo Docker
docker system prune -a
```

## Integración con VS Code en Windows

### Extensiones Recomendadas

- **AWS Toolkit**: Para trabajar con Lambda
- **Docker**: Para gestionar contenedores
- **REST Client**: Para probar endpoints desde `requests.http`
- **ESLint**: Para linting de código
- **Prettier**: Para formateo de código

### Terminal en VS Code

Configura Git Bash como terminal predeterminada:

1. Ctrl+Shift+P
2. Busca "Terminal: Select Default Profile"
3. Selecciona "Git Bash"

O usa PowerShell (también funciona bien):

1. Ctrl+Shift+P
2. Busca "Terminal: Select Default Profile"
3. Selecciona "PowerShell"

## Notas Importantes para Windows

1. **Separadores de ruta**: Windows usa `\` mientras que Linux/Mac usan `/`. Node.js maneja esto automáticamente.

2. **Variables de entorno**: Se definen diferente en PowerShell vs CMD vs Bash.

3. **Line endings**: Git puede cambiar los line endings. Asegúrate de tener:
   ```
   git config --global core.autocrlf true
   ```

4. **Docker Volumes**: Las rutas en `docker-compose.yml` son compatibles con Windows.

5. **Scripts de bash**: Necesitas Git Bash para ejecutar archivos `.sh`.

## Recursos Adicionales

- [Docker Desktop para Windows](https://docs.docker.com/desktop/windows/)
- [Node.js en Windows](https://nodejs.org/en/download/)
- [WSL2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [VS Code en Windows](https://code.visualstudio.com/docs/setup/windows)

## Soporte

Si encuentras problemas específicos de Windows que no están documentados aquí, por favor:

1. Verifica los logs: `docker logs localstack-lambda`
2. Verifica que Docker Desktop está corriendo
3. Verifica que las variables de entorno están configuradas correctamente
4. Intenta usar PowerShell en lugar de CMD
5. Considera usar WSL2 para mejor compatibilidad

