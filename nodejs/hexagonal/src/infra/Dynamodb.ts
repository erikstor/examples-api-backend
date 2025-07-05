import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DynamoDBConfig {
  private static clientInstance: DynamoDBClient;
  private static documentClientInstance: DynamoDBDocumentClient;

  static getClient(): DynamoDBClient {
    if (!DynamoDBConfig.clientInstance) {
      const isLocal = process.env.NODE_ENV === 'development' || process.env.DYNAMODB_LOCAL === 'true';

      const config: any = {
        region: process.env.AWS_REGION ?? 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'local',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'local'
        }
      };

      // Configurar endpoint local si estamos en desarrollo
      if (isLocal) {
        config.endpoint = 'http://localhost:8000';
        console.log('🔗 Conectando a DynamoDB Local en http://localhost:8000');
      }

      DynamoDBConfig.clientInstance = new DynamoDBClient(config);
    }

    return DynamoDBConfig.clientInstance;
  }

  static getDocumentClient(): DynamoDBDocumentClient {
    if (!DynamoDBConfig.documentClientInstance) {
      const client = DynamoDBConfig.getClient();
      DynamoDBConfig.documentClientInstance = DynamoDBDocumentClient.from(client);
    }

    return DynamoDBConfig.documentClientInstance;
  }

  static getTableName(): string {
    return process.env.DYNAMODB_TABLE_NAME ?? '';
  }
} 
