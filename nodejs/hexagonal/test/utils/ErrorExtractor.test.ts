import { ValidationError } from 'class-validator';
import {
  createSummaryMessage,
  errorsToObject,
  extractValidationErrors,
  flattenErrorMessages
} from '../../src/utils/ErrorExtractor';

// Ejemplo de uso de la función de extracción de errores
describe('ErrorExtractor', () => {

  // Simular errores de validación como los que devuelve class-validator
  const mockValidationErrors: ValidationError[] = [
    {
      property: 'name',
      constraints: {
        isString: 'El nombre debe ser una cadena de texto',
        isNotEmpty: 'El nombre es requerido',
        length: 'El nombre debe tener entre 2 y 50 caracteres'
      },
      children: []
    },
    {
      property: 'email',
      constraints: {
        isEmail: 'El correo electrónico debe tener un formato válido',
        isNotEmpty: 'El correo electrónico es requerido'
      },
      children: []
    }
  ];

  describe('extractValidationErrors', () => {
    it('debería extraer correctamente los errores de validación', () => {
      const result = extractValidationErrors(mockValidationErrors);

      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(5);
      expect(result.errors).toHaveLength(2);

      // Verificar errores del campo 'name'
      const nameErrors = result.errors.find(e => e.field === 'name');
      expect(nameErrors).toBeDefined();
      expect(nameErrors!.messages).toContain('El nombre debe ser una cadena de texto');
      expect(nameErrors!.messages).toContain('El nombre es requerido');
      expect(nameErrors!.messages).toContain('El nombre debe tener entre 2 y 50 caracteres');

      // Verificar errores del campo 'email'
      const emailErrors = result.errors.find(e => e.field === 'email');
      expect(emailErrors).toBeDefined();
      expect(emailErrors!.messages).toContain('El correo electrónico debe tener un formato válido');
      expect(emailErrors!.messages).toContain('El correo electrónico es requerido');
    });

    it('debería manejar arrays vacíos', () => {
      const result = extractValidationErrors([]);

      expect(result.hasErrors).toBe(false);
      expect(result.errorCount).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('debería manejar errores anidados', () => {
      const nestedErrors: ValidationError[] = [
        {
          property: 'address',
          constraints: {},
          children: [
            {
              property: 'street',
              constraints: {
                isNotEmpty: 'La calle es requerida'
              },
              children: []
            }
          ]
        }
      ];

      const result = extractValidationErrors(nestedErrors);

      expect(result.hasErrors).toBe(true);
      expect(result.errorCount).toBe(1);

      const addressErrors = result.errors.find(e => e.field === 'address.street');
      expect(addressErrors).toBeDefined();
      expect(addressErrors!.messages).toContain('La calle es requerida');
    });
  });

  describe('flattenErrorMessages', () => {
    it('debería convertir errores a un array plano de mensajes', () => {
      const extractedErrors = extractValidationErrors(mockValidationErrors);
      const messages = flattenErrorMessages(extractedErrors);

      expect(messages).toHaveLength(5);
      expect(messages).toContain('El nombre debe ser una cadena de texto');
      expect(messages).toContain('El nombre es requerido');
      expect(messages).toContain('El nombre debe tener entre 2 y 50 caracteres');
      expect(messages).toContain('El correo electrónico debe tener un formato válido');
      expect(messages).toContain('El correo electrónico es requerido');
    });
  });

  describe('errorsToObject', () => {
    it('debería convertir errores a un objeto plano', () => {
      const extractedErrors = extractValidationErrors(mockValidationErrors);
      const errorObject = errorsToObject(extractedErrors);

      expect(errorObject.name).toBeDefined();
      expect(errorObject.name).toHaveLength(3);
      expect(errorObject.email).toBeDefined();
      expect(errorObject.email).toHaveLength(2);

      expect(errorObject.name).toContain('El nombre debe ser una cadena de texto');
      expect(errorObject.email).toContain('El correo electrónico debe tener un formato válido');
    });
  });

  describe('createSummaryMessage', () => {
    it('debería crear un mensaje resumido cuando hay errores', () => {
      const extractedErrors = extractValidationErrors(mockValidationErrors);
      const summary = createSummaryMessage(extractedErrors);

      expect(summary).toBe('Se encontraron 5 error(es) de validación en 2 campo(s)');
    });

    it('debería crear un mensaje cuando no hay errores', () => {
      const extractedErrors = extractValidationErrors([]);
      const summary = createSummaryMessage(extractedErrors);

      expect(summary).toBe('No hay errores de validación');
    });
  });
});

// Ejemplo de uso práctico
console.log('=== Ejemplo de uso de ErrorExtractor ===');

const exampleValidationErrors: ValidationError[] = [
  {
    property: 'name',
    constraints: {
      isString: 'El nombre debe ser una cadena de texto',
      isNotEmpty: 'El nombre es requerido'
    },
    children: []
  },
  {
    property: 'email',
    constraints: {
      isEmail: 'El correo electrónico debe tener un formato válido'
    },
    children: []
  }
];

// Extraer errores
const extractedErrors = extractValidationErrors(exampleValidationErrors);
console.log('Errores extraídos:', JSON.stringify(extractedErrors, null, 2));

// Obtener mensajes planos
const flatMessages = flattenErrorMessages(extractedErrors);
console.log('Mensajes planos:', flatMessages);

// Convertir a objeto
const errorObject = errorsToObject(extractedErrors);
console.log('Objeto de errores:', errorObject);

// Crear resumen
const summary = createSummaryMessage(extractedErrors);
console.log('Resumen:', summary); 
