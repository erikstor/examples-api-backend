/**
 * PRESENTATION LAYER - Lambda Handler
 * Punto de entrada de la Lambda
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { GetOrCreateUserUseCase } from '../application/GetOrCreateUserUseCase';
import { DynamoDBUserRepository } from '../infrastructure/repositories/DynamoDBUserRepository';
import { CreateUserInput } from '../domain/User';

// Inicializar repositorio y casos de uso
const userRepository = new DynamoDBUserRepository();
const getOrCreateUserUseCase = new GetOrCreateUserUseCase(userRepository);

/**
 * Lambda Handler principal
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  try {
    const httpMethod = event.httpMethod || 'GET';
    const path = event.path || '/';

    // Ruta: GET /user/{id} - Obtener usuario por ID
    if (httpMethod === 'GET' && path.startsWith('/user/')) {
      const userId = path.split('/')[2];
      return await handleGetUser(userId);
    }

    // Ruta: POST /user - Crear o obtener usuario
    if (httpMethod === 'POST' && path === '/user') {
      return await handleCreateOrGetUser(event);
    }

    // Ruta por defecto - Información de la API
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'User Lambda API',
        endpoints: {
          'GET /user/{id}': 'Obtener usuario por ID',
          'POST /user': 'Crear o obtener usuario por email',
        },
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

/**
 * Maneja la solicitud GET para obtener un usuario por ID
 */
async function handleGetUser(userId: string): Promise<APIGatewayProxyResult> {
  try {
    const user = await getOrCreateUserUseCase.executeById(userId);

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Not Found',
          message: `User with ID ${userId} not found`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Maneja la solicitud POST para crear o obtener un usuario
 */
async function handleCreateOrGetUser(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Request body is required',
        }),
      };
    }

    const input: CreateUserInput = JSON.parse(event.body);

    // Validar campos requeridos
    if (!input.email || !input.name) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Email and name are required',
        }),
      };
    }

    const result = await getOrCreateUserUseCase.executeByEmail(input);

    return {
      statusCode: result.created ? 201 : 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: result.user,
        created: result.created,
        message: result.created ? 'User created successfully' : 'User already exists',
      }),
    };
  } catch (error) {
    console.error('Error creating/getting user:', error);
    
    if (error instanceof Error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Bad Request',
          message: error.message,
        }),
      };
    }

    throw error;
  }
}

