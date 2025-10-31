import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDbDocClient, TABLE_NAME } from '../config/dynamodb';
import { User, CreateUserInput, UpdateUserInput } from '../models/User';

export class UserService {
  /**
   * Crear un nuevo usuario
   */
  async createUser(input: CreateUserInput): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: uuidv4(),
      email: input.email,
      name: input.name,
      age: input.age,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
      // Evitar sobrescribir si ya existe un usuario con este ID
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await dynamoDbDocClient.send(command);
    return user;
  }

  /**
   * Obtener un usuario por ID
   */
  async getUserById(id: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const response = await dynamoDbDocClient.send(command);
    return response.Item as User || null;
  }

  /**
   * Obtener todos los usuarios
   */
  async getAllUsers(): Promise<User[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await dynamoDbDocClient.send(command);
    return (response.Items as User[]) || [];
  }

  /**
   * Buscar usuarios por email
   */
  async getUsersByEmail(email: string): Promise<User[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    });

    const response = await dynamoDbDocClient.send(command);
    return (response.Items as User[]) || [];
  }

  /**
   * Actualizar un usuario
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return null;
    }

    // Construir expresiones de actualización dinámicamente
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (input.email !== undefined) {
      updateExpressions.push('#email = :email');
      expressionAttributeNames['#email'] = 'email';
      expressionAttributeValues[':email'] = input.email;
    }

    if (input.name !== undefined) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = input.name;
    }

    if (input.age !== undefined) {
      updateExpressions.push('#age = :age');
      expressionAttributeNames['#age'] = 'age';
      expressionAttributeValues[':age'] = input.age;
    }

    // Siempre actualizar updatedAt
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await dynamoDbDocClient.send(command);
    return response.Attributes as User;
  }

  /**
   * Eliminar un usuario
   */
  async deleteUser(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: 'ALL_OLD',
    });

    const response = await dynamoDbDocClient.send(command);
    return !!response.Attributes;
  }

  /**
   * Verificar si existe un usuario con un email dado
   */
  async emailExists(email: string): Promise<boolean> {
    const users = await this.getUsersByEmail(email);
    return users.length > 0;
  }
}

