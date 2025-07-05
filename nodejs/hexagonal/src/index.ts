import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { RegisterUserController } from './entrypoints/api/RegisterUserController';
import { RegisterUserCommandHandler } from './domain/command_handlers/RegisterUserCommandHandler';
import { DynamoUserRepository } from './adapters/repository/DynamoUserRepository';
import { SystemException } from './domain/exceptions/SystemError';
import { ERROR_MESSAGES } from './domain/exceptions/constants/ErrorMessages';
import Logger from './infra/Logger';

// Handler principal de Lambda
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {

  Logger.setInstance(context);
  Logger.getInstance().info('Evento recibido:', JSON.stringify(event));
  Logger.getInstance().info('Contexto:', JSON.stringify(context));

  try {

    // Configuración de dependencias
    const userRepository = new DynamoUserRepository(process.env.USERS_TABLE_NAME ?? 'users-table');
    const commandHandler = new RegisterUserCommandHandler(userRepository);
    const controller = new RegisterUserController(commandHandler);

    return controller.handle(event);
  } catch (error) {
    Logger.getInstance().error('Error no controlado: ', error instanceof Error ? error.message : String(error));
    return new SystemException(ERROR_MESSAGES.INTERNAL_ERROR).toResponse();
  }


}; 
