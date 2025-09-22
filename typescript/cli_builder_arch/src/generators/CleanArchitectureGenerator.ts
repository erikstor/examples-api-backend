
import { ArchitectureGenerator } from './ArchitectureGenerator';

export class CleanArchitectureGenerator extends ArchitectureGenerator {
  protected async generateArchitecture(): Promise<void> {
    // Crear estructura de Clean Architecture
    await this.createDirectory('src/domain');
    await this.createDirectory('src/domain/models');
    await this.createDirectory('src/domain/errors');
    await this.createDirectory('src/domain/validators');
    await this.createDirectory('src/domain/interfaces');
    await this.createDirectory('src/domain/ports');
    await this.createDirectory('src/infra');
    await this.createDirectory('src/infra/services');
    await this.createDirectory('src/infra/repository');
    await this.createDirectory('src/infra/external');
    await this.createDirectory('src/app');
    await this.createDirectory('src/app/useCase');
    await this.createDirectory('src/app/dtos');
    await this.createDirectory('src/utils');
    await this.createDirectory('test');

    // Domain Layer
    await this.createFile('src/domain/models/example.model.ts', this.getModel());
    await this.createFile('src/domain/errors/example.error.ts', this.getError());
    await this.createFile('src/domain/validators/example.validator.ts', this.getValidator());
    await this.createFile('src/domain/interfaces/example.interface.ts', this.getInterface());
    await this.createFile('src/domain/ports/example.port.ts', this.getPort());

    // Infrastructure Layer
    await this.createFile('src/infra/services/example.service.ts', this.getInfraService());
    await this.createFile('src/infra/repository/example.repository.ts', this.getRepository());
    await this.createFile('src/infra/external/example.external.ts', this.getExternal());

    // Application Layer
    await this.createFile('src/app/useCase/example.use-case.ts', this.getUseCase());
    await this.createFile('src/app/dtos/example.dto.ts', this.getDto());

    // Utils Layer
    await this.createFile('src/utils/example.util.ts', this.getUtil());

    // Audit constants si está habilitado
    if (this.options.useWallyAudit) {
      await this.createFile('src/domain/common/consts/audit.constants.ts', this.getAuditConstants());
    }

    // Main application file
    await this.createFile('src/index.ts', this.getMainFile());

    // Test file
    await this.createFile('test/example.test.ts', this.getTestFile());
    await this.createFile('jest.config.js', this.getJestConfig());
  }

  protected getAuditConstants(): string {
    return `export const AUDIT_OVERRIDES = {
  location: 'lambda'
};
`;
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
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description?: string,
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date()
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain methods
  updateName(newName: string): ExampleEntity {
    return new ExampleEntity(
      this._id,
      newName,
      this._description,
      this._createdAt,
      new Date()
    );
  }

  updateDescription(newDescription: string): ExampleEntity {
    return new ExampleEntity(
      this._id,
      this._name,
      newDescription,
      this._createdAt,
      new Date()
    );
  }

  isValid(): boolean {
    return this._name.length >= 3;
  }
}`;
  }

  private getError(): string {
    return `export class ExampleError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ExampleError';
  }
}

export class ValidationError extends ExampleError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ExampleError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class BusinessLogicError extends ExampleError {
  constructor(message: string) {
    super(message, 422);
    this.name = 'BusinessLogicError';
  }
}`;
  }

  private getValidator(): string {
    return `import { ExampleModel } from '../models/example.model';
import { ValidationError } from '../errors/example.error';

export class ExampleValidator {
  static validateCreate(data: Partial<ExampleModel>): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }
    
    if (data.name.length < 3) {
      throw new ValidationError('Name must be at least 3 characters long');
    }
  }

  static validateUpdate(data: Partial<ExampleModel>): void {
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new ValidationError('Name cannot be empty');
    }
    
    if (data.name !== undefined && data.name.length < 3) {
      throw new ValidationError('Name must be at least 3 characters long');
    }
  }

  static validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new ValidationError('ID is required');
    }
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

export interface IExampleService {
  getExample(): Promise<ExampleModel[]>;
  createExample(data: Partial<ExampleModel>): Promise<ExampleModel>;
  updateExample(id: string, data: Partial<ExampleModel>): Promise<ExampleModel | null>;
  deleteExample(id: string): Promise<boolean>;
}

export interface IExampleUseCase {
  executeGetExample(): Promise<ExampleModel[]>;
  executeCreateExample(data: Partial<ExampleModel>): Promise<ExampleModel>;
  executeUpdateExample(id: string, data: Partial<ExampleModel>): Promise<ExampleModel | null>;
  executeDeleteExample(id: string): Promise<boolean>;
}`;
  }

  private getPort(): string {
    return `import { ExampleModel } from '../models/example.model';

export interface ExamplePort {
  findById(id: string): Promise<ExampleModel | null>;
  findAll(): Promise<ExampleModel[]>;
  save(entity: ExampleModel): Promise<ExampleModel>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export interface ExampleExternalPort {
  callExternalService(data: any): Promise<any>;
  validateExternalData(data: any): Promise<boolean>;
}`;
  }

  private getInfraService(): string {
    return `import { IExampleService } from '../../domain/interfaces/example.interface';
import { ExampleModel } from '../../domain/models/example.model';
import { IExampleRepository } from '../../domain/interfaces/example.interface';

export class ExampleInfraService implements IExampleService {
  constructor(private readonly repository: IExampleRepository) {}

  async getExample(): Promise<ExampleModel[]> {
    return await this.repository.findAll();
  }

  async createExample(data: Partial<ExampleModel>): Promise<ExampleModel> {
    const entity: ExampleModel = {
      id: this.generateId(),
      name: data.name!,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.repository.save(entity);
  }

  async updateExample(id: string, data: Partial<ExampleModel>): Promise<ExampleModel | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    const updated: ExampleModel = {
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
}`;
  }

  private getRepository(): string {
    return `import { IExampleRepository } from '../../domain/interfaces/example.interface';
import { ExampleModel } from '../../domain/models/example.model';

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

  private getExternal(): string {
    return `import { ExampleExternalPort } from '../../domain/ports/example.port';

export class ExampleExternal implements ExampleExternalPort {
  async callExternalService(data: any): Promise<any> {
    // External service call logic here
    return { success: true, data };
  }

  async validateExternalData(data: any): Promise<boolean> {
    // External validation logic here
    return true;
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

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static validateInput(data: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => data.hasOwnProperty(field));
  }
}`;
  }

  private getTestFile(): string {
    return `import { handler } from '../src/index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('Clean Architecture Lambda Handler', () => {
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
});
`;
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

  private getUseCase(): string {
    return `import { IExampleUseCase } from '../../domain/interfaces/example.interface';
import { ExampleModel } from '../../domain/models/example.model';
import { ExampleValidator } from '../../domain/validators/example.validator';
import { IExampleService } from '../../domain/interfaces/example.interface';

export class ExampleUseCase implements IExampleUseCase {
  constructor(private readonly service: IExampleService) {}

  async executeGetExample(): Promise<ExampleModel[]> {
    return await this.service.getExample();
  }

  async executeCreateExample(data: Partial<ExampleModel>): Promise<ExampleModel> {
    ExampleValidator.validateCreate(data);
    return await this.service.createExample(data);
  }

  async executeUpdateExample(id: string, data: Partial<ExampleModel>): Promise<ExampleModel | null> {
    ExampleValidator.validateId(id);
    ExampleValidator.validateUpdate(data);
    return await this.service.updateExample(id, data);
  }

  async executeDeleteExample(id: string): Promise<boolean> {
    ExampleValidator.validateId(id);
    return await this.service.deleteExample(id);
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
    
    const auditSuccess = this.options.useWallyAudit ? `        await auditTracker.success(result);` : '';
    const auditError = this.options.useWallyAudit ? `        await auditTracker.error(error);` : '';

    return `${loggerImport}
${auditImport}
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ExampleUseCase } from './app/useCase/example.use-case';
import { ExampleInfraService } from './infra/services/example.service';
import { ExampleRepository } from './infra/repository/example.repository';
import { ExampleUtil } from './utils/example.util';

// Initialize dependencies
const repository = new ExampleRepository();
const service = new ExampleInfraService(repository);
const useCase = new ExampleUseCase(service);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
${loggerInit}
${auditInit}
${loggerInfo}

  try {
    const method = event.httpMethod;
    const path = event.path;

    switch (method) {
      case 'GET':
        if (path === '/example') {
          const result = await useCase.executeGetExample();
          ${auditSuccess}
          return ExampleUtil.formatResponse(result);
        }
        break;
      case 'POST':
        if (path === '/example') {
          const data = JSON.parse(event.body || '{}');
          const result = await useCase.executeCreateExample(data);
          ${auditSuccess}
          return ExampleUtil.formatResponse(result, 201);
        }
        break;
      case 'PUT':
        if (path.startsWith('/example/')) {
          const id = path.split('/')[2];
          const data = JSON.parse(event.body || '{}');
          const result = await useCase.executeUpdateExample(id, data);
          ${auditSuccess}
          return ExampleUtil.formatResponse(result || { error: 'Not found' }, result ? 200 : 404);
        }
        break;
      case 'DELETE':
        if (path.startsWith('/example/')) {
          const id = path.split('/')[2];
          const result = await useCase.executeDeleteExample(id);
          ${auditSuccess}
          return ExampleUtil.formatResponse({ success: result }, result ? 200 : 404);
        }
        break;
    }

    return ExampleUtil.formatResponse({ error: 'Not found' }, 404);
  } catch (error) {
    ${loggerError}
    ${auditError}
    return ExampleUtil.formatResponse({ error: 'Internal server error' }, 500);
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

  private getJestConfig(): string {
    return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },  
}; `;
  }
}
