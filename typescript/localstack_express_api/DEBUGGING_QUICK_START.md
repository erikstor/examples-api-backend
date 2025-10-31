# 🐛 Debugging - Quick Start

## 🚀 En 30 segundos

1. **Abre VS Code/Cursor** en el directorio `localstack/`

2. **Abre un archivo** que quieras debuggear:
   ```
   src/services/UserService.ts
   ```

3. **Pon un breakpoint** (haz clic a la izquierda del número de línea)

4. **Presiona F5** y selecciona: `🚀 Debug API (Development)`

5. **Haz una petición HTTP** (desde otra terminal o con `requests.http`)

6. **¡El código se detendrá en tu breakpoint!** ✨

## ⌨️ Controles Esenciales

| Tecla | Acción |
|-------|--------|
| `F5` | Iniciar / Continuar |
| `F10` | Siguiente línea |
| `F11` | Entrar en función |
| `Shift+F5` | Detener |

## 🎯 Configuraciones Disponibles

- `🚀 Debug API (Development)` - Para la aplicación principal
- `🧪 Debug CRUD Tests` - Para los tests
- `🔧 Debug Init DynamoDB` - Para el script de inicialización

## 📖 Documentación Completa

Lee [DEBUG_GUIDE.md](DEBUG_GUIDE.md) para ejemplos detallados y casos de uso avanzados.

