import { ArchitectureGenerator } from './ArchitectureGenerator';

export class LayeredArchitectureGenerator extends ArchitectureGenerator {
  protected async generateArchitecture(): Promise<void> {
    // Crear estructura de capas
    await this.createDirectory('src/models');
    await this.createDirectory('src/models/dto');
    await this.createDirectory('src/controller');
    await this.createDirectory('src/services');
    await this.createDirectory('src/utils');
    await this.createDirectory('test');

    // Models Layer
    await this.createFile('src/models/example.model.ts', this.getModel());
    await this.createFile('src/models/dto/example.dto.ts', this.getDto());

    // Controller Layer
    await this.createFile('src/controller/example.controller.ts', this.getController());

    // Services Layer
    await this.createFile('src/services/example.service.ts', this.getService());

    // Utils Layer
    await this.createFile('src/utils/example.util.ts', this.getUtil());
    await this.createFile('src/utils/example.interface.ts', this.getInterface());
    await this.createFile('src/utils/example.exception.ts', this.getException());

    // Main application file
    await this.createFile('src/index.ts', this.getMainFile());

    // Test file
    await this.createFile('test/example.test.ts', this.getTestFile());
  }

  private getController(): string {
    return `import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ExampleService } from '../services/example.service';

export class ExampleController {
  constructor(private exampleService: ExampleService) {}

  async handleRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const method = event.httpMethod;
      const path = event.path;

      switch (method) {
        case 'GET':
          if (path === '/example') {
            return await this.getExample();
          }
          break;
        case 'POST':
          if (path === '/example') {
            return await this.createExample(event);
          }
          break;
      }

      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not found' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }

  private async getExample(): Promise<APIGatewayProxyResult> {
    const result = await this.exampleService.getExample();
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  }

  private async createExample(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const data = JSON.parse(event.body || '{}');
    const result = await this.exampleService.createExample(data);
    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  }
}`;
  }

  private getUtil(): string {
    return `export class ExampleUtil {
  static formatResponse(data: any, statusCode: number = 200) {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify(data)
    };
  }

  static validateInput(data: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => data.hasOwnProperty(field));
  }

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}`;
  }

  private getService(): string {
    return `import { ExampleDto } from '../models/dto/example.dto';
import { ExampleModel } from '../models/example.model';

export class ExampleService {
  async getExample(): Promise<ExampleDto[]> {
    // Business logic here
    return [];
  }

  async createExample(data: ExampleDto): Promise<ExampleDto> {
    // Business logic here
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description
    };
  }

  async updateExample(id: string, data: Partial<ExampleDto>): Promise<ExampleDto | null> {
    // Business logic here
    return null;
  }

  async deleteExample(id: string): Promise<boolean> {
    // Business logic here
    return true;
  }
}`;
  }


  private getModel(): string {
    return `export interface ExampleModel {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ExampleEntity implements ExampleModel {
  constructor(
    public id: string,
    public name: string,
    public description?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  toDto() {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    };
  }
}`;
  }

  private getDto(): string {
    return `export interface ExampleDto {
  id?: string;
  name: string;
  description?: string;
}

export interface CreateExampleDto {
  name: string;
  description?: string;
}

export interface UpdateExampleDto {
  name?: string;
  description?: string;
}

export interface ExampleResponse {
  success: boolean;
  data?: any;
  error?: string;
}`;
  }

  private getInterface(): string {
    return `import { ExampleDto } from '../models/dto/example.dto';

export interface IExampleService {
  getExample(): Promise<ExampleDto[]>;
  createExample(data: ExampleDto): Promise<ExampleDto>;
  updateExample(id: string, data: Partial<ExampleDto>): Promise<ExampleDto | null>;
  deleteExample(id: string): Promise<boolean>;
}

export interface IExampleController {
  handleRequest(event: any): Promise<any>;
}`;
  }

  private getException(): string {
    return `export class ExampleException extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ExampleException';
  }
}

export class ValidationException extends ExampleException {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends ExampleException {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundException';
  }
}

export class BusinessLogicException extends ExampleException {
  constructor(message: string) {
    super(message, 422);
    this.name = 'BusinessLogicException';
  }
}`;
  }

  private getMainFile(): string {
    const loggerImport = this.options.usePowertoolsLogger ? `import Logger from './utils/Logger';` : '';
    const auditImport = this.options.useWallyAudit ? `import { Audit } from '@wallytech/sdk-audit';
import { AUDIT_OVERRIDES } from './constants/audit.constants';` : '';
    
    const loggerInit = this.options.usePowertoolsLogger ? `  Logger.setInstance(context);` : '';
    const auditInit = this.options.useWallyAudit ? `  const auditTracker = await Audit.createTracker(event as any, context, {
    action: context.functionName,
    location: AUDIT_OVERRIDES.location
  });` : '';
    
    const loggerInfo = this.options.usePowertoolsLogger ? `  Logger.getInstance().info('Evento recibido:', JSON.stringify(event));
  Logger.getInstance().info('Contexto:', JSON.stringify(context));` : `  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));`;
    
    const loggerError = this.options.usePowertoolsLogger ? `    Logger.getInstance().error('Error in handler:', {raw: error, error: {error}, extra: { }});` : `    console.error('Error:', error);`;
    
    const auditSuccess = this.options.useWallyAudit ? `    await auditTracker.success(result);` : '';
    const auditError = this.options.useWallyAudit ? `    await auditTracker.error(error);` : '';

    return `${loggerImport}
${auditImport}
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ExampleController } from './controller/example.controller';
import { ExampleService } from './services/example.service';

// Initialize dependencies
const exampleService = new ExampleService();
const exampleController = new ExampleController(exampleService);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
${loggerInit}
${auditInit}
${loggerInfo}

  try {
    const result = await exampleController.handleRequest(event);
    ${auditSuccess}
    return result;
  } catch (error) {
    ${loggerError}
    ${auditError}
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// For local testing
if (require.main === module) {
  const testEvent = {
    httpMethod: 'GET',
    path: '/example',
    body: null
  } as APIGatewayProxyEvent;

  handler(testEvent, {} as Context).then(result => {
    console.log('Test result:', result);
  });
}
`;
  }

  private getTestFile(): string {
    return `import { handler } from '../src/index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('Example Lambda Handler', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeEach(() => {
    mockEvent = {
      httpMethod: 'GET',
      path: '/example',
      body: null,
      headers: {},
      multiValueHeaders: {},
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      pathParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: ''
    };

    mockContext = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'test-function',
      functionVersion: '1',
      invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
      memoryLimitInMB: '128',
      awsRequestId: 'test-request-id',
      logGroupName: '/aws/lambda/test-function',
      logStreamName: '2023/01/01/[$LATEST]test-stream',
      getRemainingTimeInMillis: () => 30000,
      done: () => {},
      fail: () => {},
      succeed: () => {}
    };
  });

  it('should handle GET request successfully', async () => {
    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });

  it('should handle POST request successfully', async () => {
    mockEvent.httpMethod = 'POST';
    mockEvent.body = JSON.stringify({
      name: 'Test Example',
      description: 'Test Description'
    });

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
  });

  it('should return 404 for unknown paths', async () => {
    mockEvent.path = '/unknown';

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(404);
  });
});
`;
  }
}

