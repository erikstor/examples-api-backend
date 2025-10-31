# 🐛 Guía de Debugging con VS Code / Cursor

Esta guía te enseña cómo usar el debugger integrado de VS Code o Cursor para depurar el proyecto.

## 🎯 Configuraciones Disponibles

Se han creado 5 configuraciones de debugging en `.vscode/launch.json`:

### 1. 🚀 Debug API (Development)
**Usa esto para:** Debuggear la aplicación principal en modo desarrollo

- Corre con `ts-node` (sin compilar)
- Lee variables de `.env`
- Consola integrada en VS Code
- **Más usado** para desarrollo día a día

### 2. 🔧 Debug Init DynamoDB  
**Usa esto para:** Debuggear el script de inicialización de la base de datos

- Útil si tienes problemas creando la tabla
- Puedes poner breakpoints en `scripts/init-dynamodb.ts`

### 3. 🧪 Debug CRUD Tests
**Usa esto para:** Debuggear las pruebas CRUD

- Ejecuta `scripts/test-crud.ts` en modo debug
- Perfecto para entender el flujo de las operaciones

### 4. 🔌 Attach to Running Process
**Usa esto para:** Conectar el debugger a un proceso que ya está corriendo

- Útil si iniciaste la app manualmente con `--inspect`
- Se conecta al puerto 9229

### 5. 🏗️ Debug API (Compiled)
**Usa esto para:** Debuggear el código JavaScript compilado

- Compila TypeScript a JavaScript primero
- Útil para debuggear problemas de producción

## 🚀 Cómo Usar el Debugger

### Opción 1: Desde el Panel de Debug

1. **Abre el panel de Debug**
   - Presiona `Ctrl+Shift+D` (Windows/Linux)
   - O `Cmd+Shift+D` (Mac)
   - O haz clic en el ícono de "play con un bicho" en la barra lateral

2. **Selecciona una configuración**
   - En el dropdown superior, selecciona: `🚀 Debug API (Development)`

3. **Inicia el debugger**
   - Presiona `F5`
   - O haz clic en el botón verde de play

4. **¡Listo!** La aplicación se iniciará en modo debug

### Opción 2: Desde un Archivo Abierto

1. **Abre el archivo que quieres debuggear**
   - Por ejemplo: `src/services/UserService.ts`

2. **Pon un breakpoint**
   - Haz clic a la izquierda del número de línea (aparece un círculo rojo)
   - O presiona `F9` con el cursor en la línea

3. **Inicia el debugger**
   - Presiona `F5`
   - Selecciona `🚀 Debug API (Development)`

4. **Ejecuta una petición**
   - Desde otra terminal: `curl http://localhost:3000/api/users`
   - O usa `requests.http` en VS Code

5. **El código se detendrá en tu breakpoint** ✨

## 🎮 Controles del Debugger

Cuando el código se detiene en un breakpoint:

| Tecla | Acción | Descripción |
|-------|--------|-------------|
| `F5` | Continue | Continuar hasta el próximo breakpoint |
| `F10` | Step Over | Ejecutar la línea actual y pasar a la siguiente |
| `F11` | Step Into | Entrar dentro de la función que se está llamando |
| `Shift+F11` | Step Out | Salir de la función actual |
| `Ctrl+Shift+F5` | Restart | Reiniciar el debugger |
| `Shift+F5` | Stop | Detener el debugger |

## 📍 Tipos de Breakpoints

### 1. Breakpoint Normal
Haz clic a la izquierda del número de línea.

```typescript
// El código se detendrá aquí ⬇️
const user = await userService.getUserById(id);
```

### 2. Breakpoint Condicional
Click derecho en el breakpoint → "Edit Breakpoint" → "Expression"

```typescript
// Solo se detiene si id === "abc123"
const user = await userService.getUserById(id);
```

Condición: `id === "abc123"`

### 3. Logpoint
Click derecho en el número de línea → "Add Logpoint"

```typescript
// En lugar de detenerse, imprime un mensaje
const user = await userService.getUserById(id);
```

Mensaje: `User ID: {id}`

## 🧪 Ejemplo Práctico: Debuggear Creación de Usuario

### Paso 1: Preparar el entorno

```bash
# Terminal 1: Asegúrate de que LocalStack está corriendo
cd localstack
docker-compose up -d
```

### Paso 2: Poner breakpoints

Abre `src/services/UserService.ts` y pon breakpoints en:

```typescript
// Línea ~15
async createUser(input: CreateUserInput): Promise<User> {
  const now = new Date().toISOString();
  const user: User = {
    id: uuidv4(),  // ⬅️ Breakpoint aquí
    email: input.email,
    name: input.name,
    age: input.age,
    createdAt: now,
    updatedAt: now,
  };

  // ... resto del código
  await dynamoDbDocClient.send(command);  // ⬅️ Otro breakpoint aquí
  return user;
}
```

### Paso 3: Iniciar debugger

1. Presiona `F5`
2. Selecciona `🚀 Debug API (Development)`
3. Espera a que aparezca: "Server is running on port 3000"

### Paso 4: Disparar el breakpoint

Desde otra terminal o usando `requests.http`:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"debug@example.com","name":"Debug User","age":30}'
```

### Paso 5: Explorar variables

Cuando se detenga en el breakpoint:

1. **Panel VARIABLES**: Ve el valor de todas las variables
   - `input` → Ve el objeto de entrada
   - `now` → Ve el timestamp
   - `user` → Ve el objeto completo del usuario

2. **Panel WATCH**: Añade expresiones a observar
   - Añade: `input.email`
   - Añade: `user.id`

3. **Panel CALL STACK**: Ve la cadena de llamadas
   - `createUser` ← Dónde estás ahora
   - `create` ← Controller que llamó
   - `Express` ← Framework

4. **DEBUG CONSOLE**: Ejecuta código
   ```javascript
   input.email
   // "debug@example.com"
   
   user.id.length
   // 36
   ```

### Paso 6: Continuar debugging

- Presiona `F10` para ir línea por línea
- Presiona `F11` para entrar en funciones
- Presiona `F5` para continuar hasta el siguiente breakpoint

## 🔥 Casos de Uso Comunes

### Debuggear una operación específica

```typescript
// src/services/UserService.ts
async getUserById(id: string): Promise<User | null> {
  console.log('Getting user with ID:', id);  // Agrega logs temporales
  
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },  // ⬅️ Breakpoint aquí para ver el ID
  });

  const response = await dynamoDbDocClient.send(command);
  return response.Item as User || null;  // ⬅️ Breakpoint aquí para ver la respuesta
}
```

### Debuggear validaciones

```typescript
// src/controllers/UserController.ts
async create(req: Request, res: Response): Promise<void> {
  try {
    const { email, name, age } = req.body;

    // Validaciones básicas
    if (!email || !name) {  // ⬅️ Breakpoint aquí
      res.status(400).json({
        error: 'Email and name are required',
      });
      return;
    }
    
    // ... resto del código
  }
}
```

### Debuggear errores de DynamoDB

```typescript
// src/services/UserService.ts
async createUser(input: CreateUserInput): Promise<User> {
  try {
    // ... crear usuario
    
    await dynamoDbDocClient.send(command);  // ⬅️ Breakpoint aquí
    return user;
  } catch (error) {
    console.error('Error creating user:', error);  // ⬅️ Y aquí
    throw error;
  }
}
```

## 🛠️ Configuración Avanzada

### Debug con inspect flag

Si prefieres iniciar manualmente:

```bash
# Terminal
cd localstack
node --inspect -r ts-node/register src/app.ts
```

Luego usa la configuración `🔌 Attach to Running Process`

### Debug con nodemon

Agrega a `package.json`:

```json
{
  "scripts": {
    "dev:debug": "nodemon --exec node --inspect -r ts-node/register src/app.ts"
  }
}
```

### Debug con puerto personalizado

En `.vscode/launch.json`, agrega:

```json
{
  "name": "Debug Custom Port",
  "type": "node",
  "request": "attach",
  "port": 9230,  // Puerto personalizado
  "restart": true
}
```

Inicia con: `node --inspect=9230 ...`

## 📊 Debugging con Variables de Entorno

Puedes sobrescribir variables en `launch.json`:

```json
{
  "name": "Debug with Custom Port",
  "type": "node",
  "request": "launch",
  "runtimeArgs": ["-r", "ts-node/register"],
  "args": ["${workspaceFolder}/src/app.ts"],
  "env": {
    "PORT": "3001",
    "AWS_ENDPOINT": "http://localhost:4566",
    "DEBUG": "true"
  }
}
```

## 🧪 Tips y Trucos

### 1. Log Points son tus amigos
En lugar de agregar `console.log` por todos lados, usa Logpoints:
- No necesitas modificar el código
- No necesitas recompilar
- Puedes activarlos/desactivarlos fácilmente

### 2. Usa la Debug Console
Puedes ejecutar cualquier código JavaScript mientras estás detenido en un breakpoint:

```javascript
// En la Debug Console
user.email = "changed@example.com"
JSON.stringify(user, null, 2)
Object.keys(req.body)
```

### 3. Conditional Breakpoints para loops
Si estás en un loop y solo quieres parar en casos específicos:

```typescript
for (const user of users) {
  // Breakpoint condicional: user.age > 30
  processUser(user);
}
```

### 4. Auto Attach
En configuración de VS Code, activa:
```json
"debug.node.autoAttach": "on"
```

Ahora cualquier proceso node que inicies desde la terminal integrada se auto-debuggeará.

## 🆘 Troubleshooting

### El debugger no se detiene en los breakpoints

1. **Verifica que estás usando la configuración correcta**
   - `🚀 Debug API (Development)` para desarrollo
   - NO uses la de código compilado a menos que hayas compilado

2. **Verifica que ts-node está instalado**
   ```bash
   npm list ts-node
   ```

3. **Limpia y reinstala**
   ```bash
   rm -rf node_modules dist
   npm install
   ```

### "Cannot find module"

Asegúrate de estar en el directorio correcto:
```json
"cwd": "${workspaceFolder}"
```

### Variables de entorno no se cargan

Verifica que el archivo `.env` existe y tiene:
```json
"envFile": "${workspaceFolder}/.env"
```

## 📚 Recursos

- [VS Code Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [TypeScript Debugging](https://code.visualstudio.com/docs/typescript/typescript-debugging)

---

## 🎯 Resumen Rápido

1. **Abrir panel de debug**: `Ctrl+Shift+D`
2. **Poner breakpoint**: Click izquierdo del número de línea
3. **Iniciar debug**: `F5`
4. **Seleccionar**: `🚀 Debug API (Development)`
5. **Controles**:
   - `F5` = Continue
   - `F10` = Step Over
   - `F11` = Step Into
   - `Shift+F5` = Stop

¡Feliz debugging! 🐛✨

