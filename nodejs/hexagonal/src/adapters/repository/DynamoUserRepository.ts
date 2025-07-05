import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/model/User';
import { DynamoDBConfig } from '../../infra/Dynamodb';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoUserRepository implements IUserRepository {
  private readonly dynamoDB;
  private readonly tableName: string;

  constructor(tableName?: string) {
    this.dynamoDB = DynamoDBConfig.getDocumentClient();
    this.tableName = tableName ?? DynamoDBConfig.getTableName();
  }

  async save(user: User): Promise<string> {
    const userId = this.generateUserId();
    const timestamp = new Date().toISOString();

    const item = {
      id: userId,
      name: user.name,
      email: user.email,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await this.dynamoDB.send(new PutCommand({
      TableName: this.tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)'
    }));

    return userId;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.dynamoDB.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'email-index', // Asumiendo que existe un GSI en email
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }));

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const item = result.Items[0];
    return new User(item.name, item.email);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.dynamoDB.send(new GetCommand({
      TableName: this.tableName,
      Key: { id }
    }));

    if (!result.Item) {
      return null;
    }

    const item = result.Item;
    return new User(item.name, item.email);
  }

  async update(id: string, user: User): Promise<void> {
    const timestamp = new Date().toISOString();

    await this.dynamoDB.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET #name = :name, #email = :email, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email'
      },
      ExpressionAttributeValues: {
        ':name': user.name,
        ':email': user.email,
        ':updatedAt': timestamp
      }
    }));
  }

  async delete(id: string): Promise<void> {
    await this.dynamoDB.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { id }
    }));
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 
