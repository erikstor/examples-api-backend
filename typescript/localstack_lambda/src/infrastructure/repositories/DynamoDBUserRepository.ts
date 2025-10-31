/**
 * INFRASTRUCTURE LAYER - Implementación de repositorios
 * Implementación concreta del repositorio usando DynamoDB
 */

import {
  PutCommand,
  GetCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { User } from '../../domain/User';
import { IUserRepository } from '../../domain/IUserRepository';
import { dynamoDbDocClient, TABLE_NAME } from '../config/dynamodb';

export class DynamoDBUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      });

      const response = await dynamoDbDocClient.send(command);
      return (response.Item as User) || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error(`Failed to find user by ID: ${id}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
        Limit: 1,
      });

      const response = await dynamoDbDocClient.send(command);
      
      if (response.Items && response.Items.length > 0) {
        return response.Items[0] as User;
      }

      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error(`Failed to find user by email: ${email}`);
    }
  }

  async save(user: User): Promise<User> {
    try {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
      });

      await dynamoDbDocClient.send(command);
      return user;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }
  }

  async exists(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }
}

