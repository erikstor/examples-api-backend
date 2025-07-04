import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../types';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors: ValidationError[] = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: validationErrors
      });
      return;
    }

    req.body = value;
    next();
  };
};

// Validation schemas
export const userCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres',
    'any.required': 'El nombre es requerido'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Por favor ingresa un email válido',
    'any.required': 'El email es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida'
  }),
  age: Joi.number().min(18).max(120).optional().messages({
    'number.min': 'La edad mínima es 18 años',
    'number.max': 'La edad máxima es 120 años'
  })
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Por favor ingresa un email válido'
  }),
  age: Joi.number().min(18).max(120).optional().messages({
    'number.min': 'La edad mínima es 18 años',
    'number.max': 'La edad máxima es 120 años'
  }),
  is_active: Joi.boolean().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Por favor ingresa un email válido',
    'any.required': 'El email es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida'
  })
}); 