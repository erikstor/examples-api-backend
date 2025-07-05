import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { RegisterUserCommandHandler } from '../../domain/command_handlers/RegisterUserCommandHandler';
import { RegisterUserCommand } from '../../domain/commands/RegisterUserCommand';
import { ERROR_MESSAGES, HTTP_STATUS_CODES } from '../../domain/exceptions/constants/ErrorMessages';
import { SUCCESS_MESSAGES } from '../../domain/exceptions/constants/SuccessMessages';
import { SystemException } from '../../domain/exceptions/SystemError';
import { InvalidUserDataException } from '../../domain/exceptions/UserException';
import { User } from '../../domain/model/User';
import Logger from '../../infra/Logger';
import { extractValidationErrors, flattenErrorMessages } from '../../utils/ErrorExtractor';
import { RegisterUserResponse } from './model/RegisterUserRequest';

export class RegisterUserController {
  constructor(
    private readonly commandHandler: RegisterUserCommandHandler
  ) { }

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      // Parsear y validar el body
      const body = JSON.parse(event.body ?? '{}');
      const userData = plainToInstance(User, body) as unknown as User;

      const validationErrors = await validate(userData);

      if (validationErrors.length > 0) {
        // Extraer y procesar los errores de validación
        const extractedErrors = extractValidationErrors(validationErrors);
        const errorMessages = flattenErrorMessages(extractedErrors);

        Logger.getInstance().error('Detalles de errores:', JSON.stringify(extractedErrors));

        return new InvalidUserDataException(errorMessages).toResponse();
      }

      // Crear y ejecutar el comando
      const command = new RegisterUserCommand(userData);

      Logger.getInstance().info('Ejecutando comando:', JSON.stringify(command));

      const result = await this.commandHandler.handle(command);

      // Crear respuesta exitosa
      const response: RegisterUserResponse = {
        message: SUCCESS_MESSAGES.USER_REGISTERED,
        data: {
          userId: result.userId,
          name: result.user.name,
          email: result.user.email,
          timestamp: result.timestamp.toISOString()
        }
      };

      return {
        statusCode: HTTP_STATUS_CODES.CREATED,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response)
      };

    } catch (error) {
      Logger.getInstance().error('Error en el controlador:', error instanceof Error ? error.message : String(error));

      if (error instanceof InvalidUserDataException) {
        return error.toResponse();
      }

      return new SystemException(ERROR_MESSAGES.INTERNAL_ERROR).toResponse();
    }
  }
} 
