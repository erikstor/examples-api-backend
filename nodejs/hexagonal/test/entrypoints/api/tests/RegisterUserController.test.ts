import { APIGatewayProxyEvent } from 'aws-lambda';
import { RegisterUserController } from '../../../src/entrypoints/api/RegisterUserController';
import { RegisterUserCommandHandler } from '../../../src/domain/command_handlers/RegisterUserCommandHandler';
import { User } from '../../../src/domain/model/User';

// Mock del command handler
const mockCommandHandler = {
  handle: jest.fn()
} as jest.Mocked<RegisterUserCommandHandler>;

describe('RegisterUserController', () => {
  let controller: RegisterUserController;

  beforeEach(() => {
    controller = new RegisterUserController(mockCommandHandler);
    jest.clearAllMocks();
  });

  it('should register user successfully', async () => {
    const mockUser = new User('Juan Pérez', 'juan@example.com');
    const mockResult = {
      userId: 'user_123456',
      user: mockUser,
      timestamp: new Date('2024-01-01T00:00:00Z')
    };

    mockCommandHandler.handle.mockResolvedValue(mockResult);

    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        name: 'Juan Pérez',
        email: 'juan@example.com'
      })
    } as APIGatewayProxyEvent;

    const response = await controller.handle(event);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Usuario registrado exitosamente',
      data: {
        userId: 'user_123456',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    });
  });

  it('should return 400 for invalid user data', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        name: '', // Nombre vacío
        email: 'invalid-email' // Email inválido
      })
    } as APIGatewayProxyEvent;

    const response = await controller.handle(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('error');
  });

  it('should return 400 for missing body', async () => {
    const event: APIGatewayProxyEvent = {
      body: null
    } as APIGatewayProxyEvent;

    const response = await controller.handle(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('error');
  });

  it('should handle command handler errors', async () => {
    mockCommandHandler.handle.mockRejectedValue(new Error('Database error'));

    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        name: 'Juan Pérez',
        email: 'juan@example.com'
      })
    } as APIGatewayProxyEvent;

    const response = await controller.handle(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toHaveProperty('error');
  });
}); 
