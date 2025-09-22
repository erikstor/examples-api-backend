import { ArchitectureGenerator } from './ArchitectureGenerator';

export class HybridWallyArchitectureGenerator extends ArchitectureGenerator {
  protected async generateArchitecture(): Promise<void> {
    // Crear estructura Hybrid Wally
    await this.createDirectory('src/adapters');
    await this.createDirectory('src/interfaces');
    await this.createDirectory('src/useCase');
    await this.createDirectory('src/repository');
    await this.createDirectory('src/models');
    await this.createDirectory('src/utils');
    await this.createDirectory('test');

    // Adapters Layer
    await this.createFile('src/adapters/example.adapter.ts', this.getAdapter());

    // Interfaces Layer
    await this.createFile('src/interfaces/example.interface.ts', this.getInterface());

    // UseCase Layer
    await this.createFile('src/useCase/example.use-case.ts', this.getUseCase());

    // Repository Layer
    await this.createFile('src/repository/example.repository.ts', this.getRepository());

    // Models Layer
    await this.createFile('src/models/example.model.ts', this.getModel());
    await this.createFile('src/models/example.dto.ts', this.getDto());

    // Utils Layer
    await this.createFile('src/utils/example.util.ts', this.getUtil());
    await this.createFile('src/utils/example.constant.ts', this.getConstant());
    await this.createFile('src/utils/example.error.ts', this.getError());

    // Audit constants si está habilitado
    if (this.options.useWallyAudit) {
      await this.createFile('src/utils/constants/audit.constants.ts', this.getAuditConstants());
    }

    // Main application file
    await this.createFile('src/index.ts', this.getMainFile());

    // Test file
    await this.createFile('test/example.test.ts', this.getTestFile());
  }

  protected getAuditConstants(): string {
    return `export const AUDIT_OVERRIDES = {
  location: 'lambda'
};
`;
  }

  private getAdapter(): string {
    return `import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IExampleUseCase } from '../interfaces/example.interface';

export class ExampleAdapter {
  constructor(private readonly useCase: IExampleUseCase) {}

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
        case 'PUT':
          if (path.startsWith('/example/')) {
            return await this.updateExample(event);
          }
          break;
        case 'DELETE':
          if (path.startsWith('/example/')) {
            return await this.deleteExample(event);
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
    const result = await this.useCase.executeGetExample();
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  }

  private async createExample(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const data = JSON.parse(event.body || '{}');
    const result = await this.useCase.executeCreateExample(data);
    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  }

  private async updateExample(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.path.split('/')[2];
    const data = JSON.parse(event.body || '{}');
    const result = await this.useCase.executeUpdateExample(id, data);
    return {
      statusCode: result ? 200 : 404,
      body: JSON.stringify(result || { error: 'Not found' })
    };
  }

  private async deleteExample(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.path.split('/')[2];
    const result = await this.useCase.executeDeleteExample(id);
    return {
      statusCode: result ? 200 : 404,
      body: JSON.stringify({ success: result })
    };
  }
}`;
  }

  private getInterface(): string {
    return `import { ExampleModel } from '../models/example.model';

export interface IExampleRepository {
  findById(id: string): Promise<ExampleModel | null>;
  findAll(): Promise<ExampleModel[]>;
  save(entity: ExampleModel): Promise<ExampleModel>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export interface IExampleUseCase {
  executeGetExample(): Promise<ExampleModel[]>;
  executeCreateExample(data: Partial<ExampleModel>): Promise<ExampleModel>;
  executeUpdateExample(id: string, data: Partial<ExampleModel>): Promise<ExampleModel | null>;
  executeDeleteExample(id: string): Promise<boolean>;
}

export interface IExampleAdapter {
  handleRequest(event: any): Promise<any>;
}

export interface IExampleService {
  getExample(): Promise<ExampleModel[]>;
  createExample(data: Partial<ExampleModel>): Promise<ExampleModel>;
  updateExample(id: string, data: Partial<ExampleModel>): Promise<ExampleModel | null>;
  deleteExample(id: string): Promise<boolean>;
}`;
  }

  private getUseCase(): string {
    return `import { IExampleUseCase } from '../interfaces/example.interface';
import { ExampleModel } from '../models/example.model';
import { IExampleService } from '../interfaces/example.interface';

export class ExampleUseCase implements IExampleUseCase {
  constructor(private readonly service: IExampleService) {}

  async executeGetExample(): Promise<ExampleModel[]> {
    return await this.service.getExample();
  }

  async executeCreateExample(data: Partial<ExampleModel>): Promise<ExampleModel> {
    return await this.service.createExample(data);
  }

  async executeUpdateExample(id: string, data: Partial<ExampleModel>): Promise<ExampleModel | null> {
    return await this.service.updateExample(id, data);
  }

  async executeDeleteExample(id: string): Promise<boolean> {
    return await this.service.deleteExample(id);
  }
}`;
  }

  private getRepository(): string {
    return `import { IExampleRepository } from '../interfaces/example.interface';
import { ExampleModel } from '../models/example.model';

export class ExampleRepository implements IExampleRepository {
  private entities: Map<string, ExampleModel> = new Map();

  async findById(id: string): Promise<ExampleModel | null> {
    return this.entities.get(id) || null;
  }

  async findAll(): Promise<ExampleModel[]> {
    return Array.from(this.entities.values());
  }

  async save(entity: ExampleModel): Promise<ExampleModel> {
    this.entities.set(entity.id, entity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    this.entities.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.entities.has(id);
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
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Domain methods
  updateName(newName: string): ExampleEntity {
    return new ExampleEntity(
      this.id,
      newName,
      this.description,
      this.createdAt,
      new Date()
    );
  }

  updateDescription(newDescription: string): ExampleEntity {
    return new ExampleEntity(
      this.id,
      this.name,
      newDescription,
      this.createdAt,
      new Date()
    );
  }

  // Business rules
  isValid(): boolean {
    return this.name.length >= 3;
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
  timestamp?: string;
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

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static validateInput(data: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => data.hasOwnProperty(field));
  }

  static formatDate(date: Date): string {
    return date.toISOString();
  }

  static parseJsonSafely(jsonString: string, defaultValue: any = null): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return defaultValue;
    }
  }
}`;
  }

  private getConstant(): string {
    return `export const ExampleConstants = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const;

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR'
} as const;

export const SuccessMessages = {
  CREATED: 'Example created successfully',
  UPDATED: 'Example updated successfully',
  DELETED: 'Example deleted successfully',
  RETRIEVED: 'Example retrieved successfully'
} as const;
`;
  }

  private getError(): string {
    return `export class ExampleError extends Error {
  constructor(message: string, public statusCode: number = 500, public code?: string) {
    super(message);
    this.name = 'ExampleError';
  }
}

export class ValidationError extends ExampleError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ExampleError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class BusinessLogicError extends ExampleError {
  constructor(message: string) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR');
    this.name = 'BusinessLogicError';
  }
}

export class InternalError extends ExampleError {
  constructor(message: string) {
    super(message, 500, 'INTERNAL_ERROR');
    this.name = 'InternalError';
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
import { ExampleAdapter } from './adapters/example.adapter';
import { ExampleUseCase } from './useCase/example.use-case';
import { ExampleRepository } from './repository/example.repository';
import { IExampleService } from './interfaces/example.interface';

// Service implementation
class ExampleService implements IExampleService {
  constructor(private readonly repository: ExampleRepository) {}

  async getExample(): Promise<any[]> {
    return await this.repository.findAll();
  }

  async createExample(data: any): Promise<any> {
    const entity = {
      id: this.generateId(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.repository.save(entity);
  }

  async updateExample(id: string, data: any): Promise<any | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };

    return await this.repository.save(updated);
  }

  async deleteExample(id: string): Promise<boolean> {
    const exists = await this.repository.exists(id);
    if (exists) {
      await this.repository.delete(id);
      return true;
    }
    return false;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Initialize dependencies
const repository = new ExampleRepository();
const service = new ExampleService(repository);
const useCase = new ExampleUseCase(service);
const adapter = new ExampleAdapter(useCase);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
${loggerInit}
${auditInit}
${loggerInfo}

  try {
    const result = await adapter.handleRequest(event);
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

describe('Hybrid Wally Architecture Lambda Handler', () => {
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

  it('should handle PUT request successfully', async () => {
    mockEvent.httpMethod = 'PUT';
    mockEvent.path = '/example/123';
    mockEvent.body = JSON.stringify({
      name: 'Updated Example',
      description: 'Updated Description'
    });

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });

  it('should handle DELETE request successfully', async () => {
    mockEvent.httpMethod = 'DELETE';
    mockEvent.path = '/example/123';

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(200);
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
