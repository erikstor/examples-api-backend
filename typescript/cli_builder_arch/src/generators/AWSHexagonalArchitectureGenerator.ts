import { ArchitectureGenerator } from './ArchitectureGenerator';

export class AWSHexagonalArchitectureGenerator extends ArchitectureGenerator {
  protected async generateArchitecture(): Promise<void> {
    // Crear estructura basada en AWS Prescriptive Guidance
    await this.createDirectory('src/adapters');
    await this.createDirectory('src/adapters/repository');
    await this.createDirectory('src/adapters/service');
    await this.createDirectory('src/domain');
    await this.createDirectory('src/domain/commands');
    await this.createDirectory('src/domain/command_handlers');
    await this.createDirectory('src/domain/common');
    await this.createDirectory('src/domain/common/consts');
    await this.createDirectory('src/domain/exceptions');
    await this.createDirectory('src/domain/exceptions/constants');
    await this.createDirectory('src/domain/exceptions/core');
    await this.createDirectory('src/domain/model');
    await this.createDirectory('src/domain/model/interfaces');
    await this.createDirectory('src/domain/ports');
    await this.createDirectory('src/entrypoints');
    await this.createDirectory('src/entrypoints/api');
    await this.createDirectory('src/entrypoints/api/model');
    await this.createDirectory('src/infra');
    await this.createDirectory('src/infra/interfaces');
    await this.createDirectory('src/types');
    await this.createDirectory('src/utils');
    await this.createDirectory('test');

    // Domain files
    await this.createFile('src/domain/model/example.entity.ts', this.getEntity());
    await this.createFile('src/domain/model/interfaces/example.interface.ts', this.getModelInterface());
    await this.createFile('src/domain/ports/example.port.ts', this.getPort());
    await this.createFile('src/domain/commands/example.command.ts', this.getCommand());
    await this.createFile('src/domain/command_handlers/example.command.handler.ts', this.getCommandHandler());
    await this.createFile('src/domain/exceptions/core/example.exception.ts', this.getException());
    await this.createFile('src/domain/exceptions/constants/error.messages.ts', this.getErrorMessages());
    await this.createFile('src/domain/common/consts/setup.ts', this.getSetup());
    await this.createFile('src/domain/common/consts/success.messages.ts', this.getSuccessMessages());
    await this.createFile('src/domain/common/success.response.ts', this.getSuccessResponse());

    // Adapters files
    await this.createFile('src/adapters/repository/example.repository.ts', this.getRepository());
    await this.createFile('src/adapters/service/example.service.ts', this.getService());

    // Entrypoints files
    await this.createFile('src/entrypoints/api/example.controller.ts', this.getController());
    await this.createFile('src/entrypoints/api/model/input.ts', this.getInput());

    // Infrastructure files
    await this.createFile('src/infra/interfaces/example.interface.ts', this.getInfraInterface());

    // Utils and types
    await this.createFile('src/utils/example.util.ts', this.getUtil());
    await this.createFile('src/types/example.type.ts', this.getType());

    // Main application file
    await this.createFile('src/index.ts', this.getMainFile());

    // Test file
    await this.createFile('test/example.test.ts', this.getTestFile());
  }

  private getEntity(): string {
    return `export interface ExampleEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ExampleEntityImpl implements ExampleEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Domain methods
  updateName(newName: string): ExampleEntityImpl {
    return new ExampleEntityImpl(
      this.id,
      newName,
      this.description,
      this.createdAt,
      new Date()
    );
  }

  updateDescription(newDescription: string): ExampleEntityImpl {
    return new ExampleEntityImpl(
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


  private getModelInterface(): string {
    return `export interface ExampleModel {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExampleModel {
  name: string;
  description?: string;
}

export interface UpdateExampleModel {
  name?: string;
  description?: string;
}`;
  }

  private getPort(): string {
    return `import { ExampleEntity } from '../model/example.entity';

export interface ExamplePort {
  findById(id: string): Promise<ExampleEntity | null>;
  findAll(): Promise<ExampleEntity[]>;
  save(entity: ExampleEntity): Promise<ExampleEntity>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export interface ExampleExternalPort {
  callExternalService(data: any): Promise<any>;
  validateExternalData(data: any): Promise<boolean>;
}`;
  }

  private getCommand(): string {
    return `export class ExampleCommand {
  constructor(
    public readonly id?: string,
    public readonly name: string = '',
    public readonly description?: string
  ) {}
}

export class CreateExampleCommand extends ExampleCommand {
  constructor(name: string, description?: string) {
    super(undefined, name, description);
  }
}

export class UpdateExampleCommand extends ExampleCommand {
  constructor(id: string, name?: string, description?: string) {
    super(id, name, description);
  }
}

export class DeleteExampleCommand extends ExampleCommand {
  constructor(id: string) {
    super(id);
  }
}`;
  }

  private getCommandHandler(): string {
    return `import { ExampleCommand } from '../commands/example.command';
import { ExampleEntity, ExampleEntityImpl } from '../model/example.entity';
import { ExamplePort } from '../ports/example.port';
import { CreateExampleCommand, UpdateExampleCommand, DeleteExampleCommand } from '../commands/example.command';

export class ExampleCommandHandler {
  constructor(private readonly port: ExamplePort) {}

  async handle(command: ExampleCommand): Promise<ExampleEntity> {
    switch (command.constructor.name) {
      case 'CreateExampleCommand':
        return await this.handleCreate(command as CreateExampleCommand);
      case 'UpdateExampleCommand':
        return await this.handleUpdate(command as UpdateExampleCommand);
      case 'DeleteExampleCommand':
        return await this.handleDelete(command as DeleteExampleCommand);
      default:
        throw new Error('Unknown command type');
    }
  }

  private async handleCreate(command: CreateExampleCommand): Promise<ExampleEntity> {
    const entity = new ExampleEntityImpl(
      this.generateId(),
      command.name,
      command.description
    );
    
    return await this.port.save(entity);
  }

  private async handleUpdate(command: UpdateExampleCommand): Promise<ExampleEntity> {
    const existing = await this.port.findById(command.id!);
    if (!existing) {
      throw new Error('Example not found');
    }

    const entity = new ExampleEntityImpl(
      command.id!,
      command.name || existing.name,
      command.description || existing.description,
      existing.createdAt,
      new Date()
    );

    return await this.port.save(entity);
  }

  private async handleDelete(command: DeleteExampleCommand): Promise<ExampleEntity> {
    const existing = await this.port.findById(command.id!);
    if (!existing) {
      throw new Error('Example not found');
    }

    await this.port.delete(command.id!);
    return existing;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}`;
  }

  private getException(): string {
    return `export class BaseException extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'BaseException';
  }
}

export class AwsSecretManagerException extends BaseException {
  constructor(message: string) {
    super(message, 500);
    this.name = 'AwsSecretManagerException';
  }
}

export class InvalidDataException extends BaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidDataException';
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundException';
  }
}

export class SystemException extends BaseException {
  constructor(message: string) {
    super(message, 500);
    this.name = 'SystemException';
  }
}`;
  }

  private getErrorMessages(): string {
    return `export const ErrorMessages = {
  EXAMPLE_NOT_FOUND: 'Example not found',
  INVALID_DATA: 'Invalid data provided',
  SYSTEM_ERROR: 'System error occurred',
  AWS_SECRET_MANAGER_ERROR: 'AWS Secret Manager error',
  VALIDATION_ERROR: 'Validation error',
  BUSINESS_LOGIC_ERROR: 'Business logic error'
} as const;

export type ErrorMessage = typeof ErrorMessages[keyof typeof ErrorMessages];
`;
  }

  private getSetup(): string {
    return `export const Setup = {
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  LAMBDA_FUNCTION_NAME: process.env.LAMBDA_FUNCTION_NAME || 'example-function',
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || 'example-table',
  SECRET_MANAGER_SECRET_NAME: process.env.SECRET_MANAGER_SECRET_NAME || 'example-secret'
} as const;
`;
  }

  private getSuccessMessages(): string {
    return `export const SuccessMessages = {
  EXAMPLE_CREATED: 'Example created successfully',
  EXAMPLE_UPDATED: 'Example updated successfully',
  EXAMPLE_DELETED: 'Example deleted successfully',
  EXAMPLE_RETRIEVED: 'Example retrieved successfully',
  OPERATION_SUCCESSFUL: 'Operation completed successfully'
} as const;

export type SuccessMessage = typeof SuccessMessages[keyof typeof SuccessMessages];
`;
  }

  private getSuccessResponse(): string {
    return `import { SuccessMessages } from './consts/success.messages';

export class SuccessResponse {
  static create(data: any, message: string = SuccessMessages.OPERATION_SUCCESSFUL) {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  static createList(data: any[], message: string = SuccessMessages.OPERATION_SUCCESSFUL) {
    return {
      success: true,
      message,
      data,
      count: data.length,
      timestamp: new Date().toISOString()
    };
  }
}`;
  }

  private getRepository(): string {
    return `import { ExampleEntity } from '../../domain/model/example.entity';
import { ExamplePort } from '../../domain/ports/example.port';

export class ExampleRepository implements ExamplePort {
  private entities: Map<string, ExampleEntity> = new Map();

  async findById(id: string): Promise<ExampleEntity | null> {
    return this.entities.get(id) || null;
  }

  async findAll(): Promise<ExampleEntity[]> {
    return Array.from(this.entities.values());
  }

  async save(entity: ExampleEntity): Promise<ExampleEntity> {
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

  private getService(): string {
    return `import { ExampleCommandHandler } from '../../domain/command_handlers/example.command.handler';
import { ExampleRepository } from './repository/example.repository';
import { CreateExampleCommand, UpdateExampleCommand, DeleteExampleCommand } from '../../domain/commands/example.command';

export class ExampleService {
  private commandHandler: ExampleCommandHandler;

  constructor() {
    const repository = new ExampleRepository();
    this.commandHandler = new ExampleCommandHandler(repository);
  }

  async createExample(name: string, description?: string): Promise<any> {
    const command = new CreateExampleCommand(name, description);
    return await this.commandHandler.handle(command);
  }

  async updateExample(id: string, name?: string, description?: string): Promise<any> {
    const command = new UpdateExampleCommand(id, name, description);
    return await this.commandHandler.handle(command);
  }

  async deleteExample(id: string): Promise<any> {
    const command = new DeleteExampleCommand(id);
    return await this.commandHandler.handle(command);
  }
}`;
  }

  private getController(): string {
    return `import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ExampleService } from '../../adapters/service/example.service';
import { SuccessResponse } from '../../domain/common/success.response';
import { Input } from './model/input';

export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  async handleRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const method = event.httpMethod;
      const path = event.path;

      switch (method) {
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

  private async createExample(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const input: Input = JSON.parse(event.body || '{}');
    const result = await this.exampleService.createExample(input.name, input.description);
    
    return {
      statusCode: 201,
      body: JSON.stringify(SuccessResponse.create(result))
    };
  }

  private async updateExample(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.path.split('/')[2];
    const input: Input = JSON.parse(event.body || '{}');
    const result = await this.exampleService.updateExample(id, input.name, input.description);
    
    return {
      statusCode: 200,
      body: JSON.stringify(SuccessResponse.create(result))
    };
  }

  private async deleteExample(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const id = event.path.split('/')[2];
    const result = await this.exampleService.deleteExample(id);
    
    return {
      statusCode: 200,
      body: JSON.stringify(SuccessResponse.create(result))
    };
  }
}`;
  }

  private getInput(): string {
    return `export interface Input {
  name: string;
  description?: string;
}

export interface CreateInput extends Input {}

export interface UpdateInput {
  name?: string;
  description?: string;
}`;
  }

  private getInfraInterface(): string {
    return `export interface IExampleService {
  createExample(name: string, description?: string): Promise<any>;
  updateExample(id: string, name?: string, description?: string): Promise<any>;
  deleteExample(id: string): Promise<any>;
}

export interface IExampleRepository {
  findById(id: string): Promise<any>;
  findAll(): Promise<any[]>;
  save(entity: any): Promise<any>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
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

  private getType(): string {
    return `export type ExampleType = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateExampleType = {
  name: string;
  description?: string;
};

export type UpdateExampleType = {
  name?: string;
  description?: string;
};

export type ExampleResponseType = {
  success: boolean;
  message: string;
  data: any;
  timestamp: string;
};
`;
  }

  private getTestFile(): string {
    return `import { handler } from '../src/index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('AWS Hexagonal Architecture Lambda Handler', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeEach(() => {
    mockEvent = {
      httpMethod: 'POST',
      path: '/example',
      body: JSON.stringify({
        name: 'Test Example',
        description: 'Test Description'
      }),
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

  it('should handle POST request successfully', async () => {
    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
    
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
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
});
`;
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
import { ExampleController } from './entrypoints/api/example.controller';
import { ExampleService } from './adapters/service/example.service';

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
    httpMethod: 'POST',
    path: '/example',
    body: JSON.stringify({
      name: 'Test Example',
      description: 'Test Description'
    })
  } as APIGatewayProxyEvent;

  handler(testEvent, {} as Context).then(result => {
    console.log('Test result:', result);
  });
}
`;
  }
}
