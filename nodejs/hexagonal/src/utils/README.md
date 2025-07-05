# ErrorExtractor - Utilidad para Extracción de Mensajes de Error

Esta utilidad proporciona funciones para extraer y procesar mensajes de error de validación de manera estructurada y reutilizable.

## Funciones Disponibles

### `extractValidationErrors(validationErrors: ValidationError[]): ErrorExtractionResult`

Función principal que extrae y organiza los errores de validación.

**Parámetros:**
- `validationErrors`: Array de errores de validación de class-validator

**Retorna:**
```typescript
{
  errors: ExtractedError[];      // Array de errores organizados por campo
  hasErrors: boolean;            // Indica si hay errores
  errorCount: number;           // Número total de mensajes de error
}
```

### `flattenErrorMessages(extractedErrors: ErrorExtractionResult): string[]`

Convierte los errores extraídos a un array plano de mensajes.

**Retorna:** Array de strings con todos los mensajes de error.

### `errorsToObject(extractedErrors: ErrorExtractionResult): Record<string, string[]>`

Convierte los errores a un objeto donde las claves son los campos y los valores son arrays de mensajes.

**Retorna:** Objeto con estructura `{ campo: [mensajes] }`

### `createSummaryMessage(extractedErrors: ErrorExtractionResult): string`

Crea un mensaje resumido de los errores encontrados.

**Retorna:** String con el resumen de errores.

## Interfaces

```typescript
interface ExtractedError {
  field: string;        // Nombre del campo con error
  messages: string[];   // Array de mensajes de error para ese campo
}

interface ErrorExtractionResult {
  errors: ExtractedError[];  // Array de errores extraídos
  hasErrors: boolean;        // Indica si hay errores
  errorCount: number;       // Número total de mensajes
}
```

## Ejemplo de Uso

```typescript
import { validate } from 'class-validator';
import { extractValidationErrors, flattenErrorMessages, createSummaryMessage } from './utils/ErrorExtractor';

// En tu controlador o servicio
const validationErrors = await validate(userData);

if (validationErrors.length > 0) {
  // Extraer errores de manera estructurada
  const extractedErrors = extractValidationErrors(validationErrors);
  
  // Obtener mensajes planos para logging
  const errorMessages = flattenErrorMessages(extractedErrors);
  
  // Crear resumen para el log
  const summary = createSummaryMessage(extractedErrors);
  
  console.log('Resumen de errores:', summary);
  console.log('Mensajes de error:', errorMessages);
  
  // Los errores extraídos contienen información estructurada
  console.log('Errores por campo:', extractedErrors.errors);
}
```

## Características

- ✅ **Manejo de errores anidados**: Procesa correctamente objetos complejos con validaciones anidadas
- ✅ **Estructura organizada**: Agrupa errores por campo para fácil procesamiento
- ✅ **Múltiples formatos de salida**: Array plano, objeto estructurado, resumen
- ✅ **TypeScript**: Completamente tipado para mejor experiencia de desarrollo
- ✅ **Reutilizable**: Puede usarse en cualquier parte del proyecto
- ✅ **Logging mejorado**: Proporciona información detallada para debugging

## Casos de Uso

1. **Logging estructurado**: Obtener información detallada de errores para logs
2. **Respuestas de API**: Formatear errores para respuestas HTTP
3. **Validación de formularios**: Procesar errores de validación del frontend
4. **Testing**: Verificar que los errores se procesan correctamente

## Migración desde el código anterior

**Antes:**
```typescript
const errorMessages = validationErrors.map(error => error.constraints);
```

**Después:**
```typescript
const extractedErrors = extractValidationErrors(validationErrors);
const errorMessages = flattenErrorMessages(extractedErrors);
const summary = createSummaryMessage(extractedErrors);
```

Esta nueva implementación proporciona más información y mejor estructura para el manejo de errores. 
