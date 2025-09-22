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
    await this.createDirectory('src/domain/events');
    await this.createDirectory('src/entrypoints');
    await this.createDirectory('src/entrypoints/api');
    await this.createDirectory('src/entrypoints/api/model');
    await this.createDirectory('src/infra');
    await this.createDirectory('src/infra/interfaces');
    await this.createDirectory('src/types');
    await this.createDirectory('src/utils');
    await this.createDirectory('test');

    // Domain files
    await this.createFile('src/domain/model/ExampleModel.ts', this.getExampleModel());
    await this.createFile('src/domain/model/interfaces/IExample.ts', this.getIExampleInterface());
    await this.createFile('src/domain/model/interfaces/IResponse.ts', this.getIResponseInterface());
    await this.createFile('src/domain/model/interfaces/ITransfer.ts', this.getITransferInterface());
    await this.createFile('src/domain/ports/IAwsSecretService.ts', this.getIAwsSecretServicePort());
    await this.createFile('src/domain/ports/ICustomerRepository.ts', this.getICustomerRepositoryPort());
    await this.createFile('src/domain/commands/GetCustomerCommand.ts', this.getGetCustomerCommand());
    await this.createFile('src/domain/command_handlers/GetCustomerCommandHandler.ts', this.getGetCustomerCommandHandler());
    await this.createFile('src/domain/exceptions/core/BaseException.ts', this.getBaseException());
    await this.createFile('src/domain/exceptions/core/AwsSecretManagerException.ts', this.getAwsSecretManagerException());
    await this.createFile('src/domain/exceptions/core/InvalidDataException.ts', this.getInvalidDataException());
    await this.createFile('src/domain/exceptions/core/NotFoundException.ts', this.getNotFoundException());
    await this.createFile('src/domain/exceptions/core/SystemException.ts', this.getSystemException());
    await this.createFile('src/domain/exceptions/constants/ErrorMessages.ts', this.getErrorMessages());
    await this.createFile('src/domain/exceptions/constants/InputMessageException.ts', this.getInputMessageException());
    await this.createFile('src/domain/exceptions/ExampleCustomException.ts', this.getExampleCustomException());
    await this.createFile('src/domain/common/consts/Setup.ts', this.getSetup());
    await this.createFile('src/domain/common/consts/SuccessMessages.ts', this.getSuccessMessages());
    await this.createFile('src/domain/common/SuccessResponse.ts', this.getSuccessResponse());
    await this.createFile('src/domain/events/ExampleEvent.ts', this.getExampleEvent());

    // Audit constants si está habilitado
    if (this.options.useWallyAudit) {
      await this.createFile('src/domain/common/consts/audit.constants.ts', this.getAuditConstants());
    }

    // Adapters files
    await this.createFile('src/adapters/repository/DynamoCustomerRepository.ts', this.getDynamoCustomerRepository());
    await this.createFile('src/adapters/service/AwsSecretService.ts', this.getAwsSecretService());

    // Entrypoints files
    await this.createFile('src/entrypoints/api/ExampleController.ts', this.getExampleController());
    await this.createFile('src/entrypoints/api/model/InputExample.ts', this.getInputExample());

    // Infrastructure files
    await this.createFile('src/infra/interfaces/IAudit.ts', this.getIAuditInterface());
    await this.createFile('src/infra/Audit.ts', this.getAudit());
    await this.createFile('src/infra/Dynamodb.ts', this.getDynamodb());
    await this.createFile('src/infra/Logger.ts', this.getLogger());

    // Utils and types
    await this.createFile('src/utils/ErrorExtractor.ts', this.getErrorExtractor());

    // Main application file
    await this.createFile('src/index.ts', this.getMainFile());

    // Test file
    await this.createFile('test/example.test.ts', this.getTestFile());
    await this.createFile('jest.config.js', this.getJestConfig());
  }

  private getExampleModel(): string {
    return `export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerImpl implements Customer {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Domain methods
  updateName(newName: string): CustomerImpl {
    return new CustomerImpl(
      this.id,
      newName,
      this.email,
      this.phone,
      this.createdAt,
      new Date()
    );
  }

  updateEmail(newEmail: string): CustomerImpl {
    return new CustomerImpl(
      this.id,
      this.name,
      newEmail,
      this.phone,
      this.createdAt,
      new Date()
    );
  }

  // Business rules
  isValid(): boolean {
    return this.name.length >= 3 && this.email.includes('@');
  }
}`;
  }




  private getIExampleInterface(): string {
    return `export interface IExample {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}`;
  }


  private getIResponseInterface(): string {
    return `import { APIGatewayProxyResult } from "aws-lambda";

export interface IResponse {
  toResponse(): APIGatewayProxyResult;
}`;
  }

  private getITransferInterface(): string {
    return `export interface ITransfer {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}`;
  }

  private getIAwsSecretServicePort(): string {
    return `export interface IAwsSecretService {
  getSecret(secretName: string): Promise<string>;
  getSecretValue(secretName: string, key: string): Promise<string>;
}`;
  }

  private getICustomerRepositoryPort(): string {
    return `import { Customer } from '../model/ExampleModel';

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}`;
  }



  private getGetCustomerCommand(): string {
    return `

/**
 * Los comandos son las entradas de la aplicación, es decir, que reciben los datos de la aplicación y los procesan. 
 * Para darle el formato necesario para que el handler pueda procesarlos.
 */ 
export class GetCustomerCommand {
  constructor(
    public readonly customerId: string
  ) {}
}`;
  }




  private getGetCustomerCommandHandler(): string {
    return `import { GetCustomerCommand } from '../commands/GetCustomerCommand';
import { ICustomerRepository } from '../ports/ICustomerRepository';
import { Customer } from '../model/ExampleModel';

export class GetCustomerCommandHandler {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async handle(command: GetCustomerCommand): Promise<Customer | null> {
    return await this.customerRepository.findById(command.customerId);
  }
}`;
  }




  private getBaseException(): string {
    return `import { APIGatewayProxyResult } from "aws-lambda";

import { IResponse } from "../../model/interfaces/IResponse";
import { HTTP_STATUS_CODES } from "../constants/ErrorMessages";

export class BaseException extends Error implements IResponse {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    public readonly data: any = {},
    public readonly title: string = 'Error'
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  public toResponse(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        title: this.title,
        code: this.code,
        message: this.message,
        error: {
          detail: this.data
        }
      })
    };
  }
}`;
  }

  private getAwsSecretManagerException(): string {
    return `import { ERROR_CODES } from "../constants/ErrorMessages";
import { BaseException } from "./BaseException";

export class AwsSecretManagerException extends BaseException {
  constructor(message: string, status: number) {
    super(message, ERROR_CODES.INTERNAL_ERROR, status);
    this.name = 'AwsSecretManagerException';
  }
}`;
}

  private getInvalidDataException(): string {
    return `import { BaseException } from "./BaseException";
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS_CODES } from "../constants/ErrorMessages";


export class InvalidDataException extends BaseException {

  constructor(errorMessages: string[]) {
    super(ERROR_MESSAGES.INVALID_DATA, ERROR_CODES.INVALID_DATA, HTTP_STATUS_CODES.BAD_REQUEST, errorMessages);
    this.name = 'InvalidDataException';
  }

}`;
}

  private getNotFoundException(): string {
    return `import { BaseException } from "./BaseException";
import { ERROR_MESSAGES, ERROR_CODES, HTTP_STATUS_CODES } from "../constants/ErrorMessages";


export class NotFoundException extends BaseException {
  constructor() {
    super(ERROR_MESSAGES.NOT_FOUND, ERROR_CODES.INVALID_DATA, HTTP_STATUS_CODES.NOT_FOUND);
    this.name = 'NotFoundException';
  }
}`;
}

  private getSystemException(): string {
    return `import { BaseException } from "./BaseException";
import { ERROR_CODES, HTTP_STATUS_CODES } from "../constants/ErrorMessages";

export class SystemException extends BaseException {
  constructor(message: string) {
    super(message, ERROR_CODES.INTERNAL_ERROR, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    this.name = 'SystemException';
  }
}`;
  }

  private getErrorMessages(): string {
    return `export const ERROR_MESSAGES = {
  // Validaciones generales
  REQUIRED_FIELD: 'El campo es obligatorio',
  INVALID_FORMAT: 'El formato no es válido',
  INVALID_LENGTH: 'La longitud no es válida',
  INVALID_DATA: 'Los datos de entrada no son válidos',
  INTERNAL_ERROR: 'Error interno del servidor',
  NOT_FOUND: 'No se encontró el recurso',

}

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusCodeKey = keyof typeof HTTP_STATUS_CODES;


export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_DATA: 'INVALID_DATA',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES;
`;
  }


  private getInputMessageException(): string {
    return `export const INPUT_MESSAGE_EXCEPTIONS = {
  INVALID_INPUT: 'Invalid input message format',
  MISSING_REQUIRED_FIELDS: 'Missing required fields in input message',
  INVALID_DATA_TYPE: 'Invalid data type in input message'
} as const;
`;
  }

  private getExampleCustomException(): string {
    return `import { BaseException } from './core/BaseException';
import { ERROR_CODES, HTTP_STATUS_CODES } from './constants/ErrorMessages';

export class ExampleCustomException extends BaseException {
  constructor(message: string) {
    super(message, ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS_CODES.BAD_REQUEST);
    this.name = 'ExampleCustomException';
  }
}`;
  }



  private getSetup(): string {
    return `export const Setup = {
  timeZone: process.env.TIME_ZONE ?? 'America/Panama'
}

//TODO: Cambiar valores por los reales
export const AUDIT = {
  ACTION: "ACT00060010", 
  SOURCE: "BACKOFFICE", 
  LOCATION: "BACKOFFICE" 
}


`;
  }

  private getSuccessMessages(): string {
    return `export const SUCCESS_MESSAGES = {
  OK: "Operación exitosa",
  EXAMPLE_CONFIRMED: "Ejemplo confirmado exitosamente",
} as const


export const SUCCESS_CODES = {
  OK: 'OK',
  CREATED: 'CREATED',
} as const;


`;
  }

  private getSuccessResponse(): string {
    return `import { APIGatewayProxyResult } from "aws-lambda";

import { HTTP_STATUS_CODES } from "../exceptions/constants/ErrorMessages";
import { IResponse } from "../model/interfaces/IResponse";
import { SUCCESS_CODES, SUCCESS_MESSAGES } from "./consts/SuccessMessages";


export class SuccessResponse implements IResponse {

  constructor(
    public readonly data: any,
    public readonly name: string = 'SuccessResponse',
    public readonly title: string = 'Success',
    public readonly message: string = SUCCESS_MESSAGES.OK,
    public readonly code: string = SUCCESS_CODES.OK,
    public readonly statusCode: number = HTTP_STATUS_CODES.OK,
  ) { }



  public toResponse(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        message: this.message,
        ...this.data
      })
    };
  }

}`;
  }

  private getExampleEvent(): string {
    return `import { SQS } from 'aws-sdk';

export interface ExampleEvent {
  transactionId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export class ExampleEventPublisher {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS({ region: process.env.AWS_REGION || 'us-east-1' });
  }

  async publishExampleEvent(event: ExampleEvent): Promise<void> {
    const params = {
      QueueUrl: process.env.EXAMPLE_EVENT_QUEUE_URL || 'https://sqs.us-east-1.amazonaws.com/123456789012/example-events',
      MessageBody: JSON.stringify(event),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'example'
        },
        status: {
          DataType: 'String',
          StringValue: event.status
        }
      }
    };

    try {
      await this.sqs.sendMessage(params).promise();
      console.log('Example event published successfully:', event.transactionId);
    } catch (error) {
      console.error('Error publishing example event:', error);
      throw error;
    }
  }
}`;
  }

  protected getAuditConstants(): string {
    return `export const AUDIT_OVERRIDES = {
  location: 'lambda'
};
`;
  }

  private getDynamoCustomerRepository(): string {
    return `
import { Customer } from '../../domain/model/ExampleModel';
import { ICustomerRepository } from '../../domain/ports/ICustomerRepository';
import { DynamoDBClientImp } from '../../infra/Dynamodb';


export class DynamoCustomerRepository implements ICustomerRepository {

  constructor(
    private readonly dynamoDB: DynamoDBClientImp = new DynamoDBClientImp(),
    private readonly tableName: string = process.env.CUSTOMERS_TABLE_NAME || 'customers'
  ) {
  }

  async findById(id: string): Promise<Customer | null> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    const result = await this.dynamoDB.getItem(params.TableName, params.Key);
    return result.Item as Customer || null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const result = await this.dynamoDB.query(params.TableName, params.KeyConditionExpression, params.ExpressionAttributeValues);
    return result.Items?.[0] as Customer || null;
  }

  async save(customer: Customer): Promise<Customer> {
    const params = {
      TableName: this.tableName,
      Item: customer
    };

    await this.dynamoDB.putItem(params.TableName, params.Item);
    return customer;
  }

  async update(customer: Customer): Promise<Customer> {
    const params = {
      TableName: this.tableName,
      Key: { id: customer.id },
      UpdateExpression: 'SET #name = :name, email = :email, phone = :phone, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': customer.name,
        ':email': customer.email,
        ':phone': customer.phone,
        ':updatedAt': customer.updatedAt
      }
    };

    await this.dynamoDB.updateItem(params.TableName, params.Key, params.UpdateExpression, params.ExpressionAttributeValues);
    return customer;
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    await this.dynamoDB.deleteItem(params.TableName, params.Key);
  }

  async exists(id: string): Promise<boolean> {
    const customer = await this.findById(id);
    return customer !== null;
  }
}`;
  }


  private getAwsSecretService(): string {
    return `import { SecretsManager } from 'aws-sdk';
import { IAwsSecretService } from '../../domain/ports/IAwsSecretService';

export class AwsSecretService implements IAwsSecretService {
  private secretsManager: SecretsManager;

  constructor() {
    this.secretsManager = new SecretsManager({
      region: process.env.AWS_REGION || 'us-east-1'
    });
  }

  async getSecret(secretName: string): Promise<string> {
    try {
      const result = await this.secretsManager.getSecretValue({
        SecretId: secretName
      }).promise();

      return result.SecretString || '';
    } catch (error) {
      console.error('Error getting secret:', error);
      throw new Error(\`Failed to get secret: \${secretName}\`);
    }
  }

  async getSecretValue(secretName: string, key: string): Promise<string> {
    try {
      const secretString = await this.getSecret(secretName);
      const secretObject = JSON.parse(secretString);
      return secretObject[key] || '';
    } catch (error) {
      console.error('Error getting secret value:', error);
      throw new Error(\`Failed to get secret value: \${secretName}.\${key}\`);
    }
  }
}`;
  }


  private getExampleController(): string {
    return `import { AuditTracker } from '@wallytech/sdk-audit';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';


import { GetCustomerCommandHandler } from '../../domain/command_handlers/GetCustomerCommandHandler';
import { GetCustomerCommand } from '../../domain/commands/GetCustomerCommand';
import { SuccessResponse } from '../../domain/common/SuccessResponse';
import { ERROR_MESSAGES } from '../../domain/exceptions/constants/ErrorMessages';
import { BaseException } from '../../domain/exceptions/core/BaseException';
import { InvalidDataException } from '../../domain/exceptions/core/InvalidDataException';
import { NotFoundException } from '../../domain/exceptions/core/NotFoundException';
import { SystemException } from '../../domain/exceptions/core/SystemException';

import { extractValidationErrors, flattenErrorMessages } from '../../utils/ErrorExtractor';
import { InputExample } from './model/InputExample';
import Logger from '../../infra/Logger';


export class ExampleController {


  constructor(
    private readonly auditService: AuditTracker,
    private readonly getCustomerHandler: GetCustomerCommandHandler
  ) { }

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    try {
      Logger.getInstance().info('Inicio de proceso de validación de datos', JSON.stringify(event));

      const body = JSON.parse(event.body ?? '{}');
      const params = event.pathParameters ?? {};

      const request = plainToInstance(InputExample, { ...body, ...params }) as unknown as InputExample;

      const validationErrors = await validate(request);

      if (validationErrors.length > 0) {

        const extractedErrors = extractValidationErrors(validationErrors);
        const errorMessages = flattenErrorMessages(extractedErrors);

        Logger.getInstance().error('Mensajes de error:', JSON.stringify(errorMessages));

        const errorResponse = new InvalidDataException(errorMessages)

        this.auditService.error(errorResponse);

        return errorResponse.toResponse();

      }

      const command = new GetCustomerCommand(request.data)
      const result = await this.getCustomerHandler.handle(command);

      if (!result) {
        return new NotFoundException().toResponse();
      }

      return new SuccessResponse(result).toResponse();
    } catch (error) {

      if (error instanceof BaseException) {

        this.auditService.error(error);

        return error.toResponse();
      }

      this.auditService.error(new SystemException(ERROR_MESSAGES.INTERNAL_ERROR));

      return new SystemException(ERROR_MESSAGES.INTERNAL_ERROR).toResponse();
    }


  }


}`;
  }


  private getIAuditInterface(): string {
    return `export interface IAudit {
  action: string;
  source: string;
  location: string;
  timestamp: Date;
  userId?: string;
  details?: any;
}

export interface AuditTracker {
  success(result: any): Promise<void>;
  error(error: any): Promise<void>;
}`;
  }

  private getAudit(): string {
    return `import { IAudit, AuditTracker } from './interfaces/IAudit';

export class Audit implements IAudit {
  constructor(
    public readonly action: string,
    public readonly source: string,
    public readonly location: string,
    public readonly timestamp: Date = new Date(),
    public readonly userId?: string,
    public readonly details?: any
  ) {}

  static createTracker(event: any, context: any, options: { action: string; location: string }): AuditTracker {
    return new AuditTrackerImpl(event, context, options);
  }
}

class AuditTrackerImpl implements AuditTracker {
  constructor(
    private event: any,
    private context: any,
    private options: { action: string; location: string }
  ) {}

  async success(result: any): Promise<void> {
    console.log('Audit Success:', {
      action: this.options.action,
      location: this.options.location,
      result: result,
      timestamp: new Date().toISOString()
    });
  }

  async error(error: any): Promise<void> {
    console.log('Audit Error:', {
      action: this.options.action,
      location: this.options.location,
      error: error,
      timestamp: new Date().toISOString()
    });
  }
}`;
  }

  private getDynamodb(): string {
    return `import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';

import AWSXRay from 'aws-xray-sdk-core';

export class DynamoDBClientImp {
  private dynamoDB: DynamoDBDocumentClient;

  constructor() {

    const dynamoClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
    this.dynamoDB = DynamoDBDocumentClient.from(dynamoClient)

  }

  async getItem(tableName: string, key: any): Promise<any> {
    const params = new GetCommand({
      TableName: tableName,
      Key: key
    });

    const result = await this.dynamoDB.send(params);
    return result.Item;
  }

  async putItem(tableName: string, item: any): Promise<any> {
    const params = new PutCommand({
      TableName: tableName,
      Item: item
    });

    return await this.dynamoDB.send(params);
  }

  async updateItem(tableName: string, key: any, updateExpression: string, expressionAttributeValues: any): Promise<any> {
    const params = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    });

    return await this.dynamoDB.send(params);
  }

  async deleteItem(tableName: string, key: any): Promise<any> {
    const params = new DeleteCommand({
      TableName: tableName,
      Key: key
    });

    return await this.dynamoDB.send(params);
  }

  async query(tableName: string, keyConditionExpression: string, expressionAttributeValues: any): Promise<any> {
    const params = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    });

    const result = await this.dynamoDB.send(params);
    return result.Items;
  }
}`;
  }


  private getErrorExtractor(): string {
    return `import { ValidationError } from 'class-validator';

export interface ExtractedError {
  field: string;
  messages: string[];
}

export interface ErrorExtractionResult {
  errors: ExtractedError[];
  hasErrors: boolean;
  errorCount: number;
}

/**
 * Extrae y formatea los mensajes de error de validación
 * @param validationErrors - Array de errores de validación de class-validator
 * @returns Objeto con los errores extraídos y metadatos
 */
export function extractValidationErrors(validationErrors: ValidationError[]): ErrorExtractionResult {
  if (!validationErrors || validationErrors.length === 0) {
    return {
      errors: [],
      hasErrors: false,
      errorCount: 0
    };
  }

  const extractedErrors: ExtractedError[] = [];

  validationErrors.forEach(error => {
    const field = error.property;
    const messages: string[] = [];

    // Extraer mensajes de las restricciones
    if (error.constraints) {
      Object.values(error.constraints).forEach(message => {
        if (message && typeof message === 'string') {
          messages.push(message);
        }
      });
    }

    // Procesar errores anidados (para objetos complejos)
    if (error.children && error.children.length > 0) {
      const nestedErrors = extractValidationErrors(error.children);
      nestedErrors.errors.forEach(nestedError => {
        const nestedField = \`\${field}.\${nestedError.field}\`;
        const existingError = extractedErrors.find(e => e.field === nestedField);
        
        if (existingError) {
          existingError.messages.push(...nestedError.messages);
        } else {
          extractedErrors.push({
            field: nestedField,
            messages: [...nestedError.messages]
          });
        }
      });
    }

    // Agregar errores del campo actual si tiene mensajes
    if (messages.length > 0) {
      const existingError = extractedErrors.find(e => e.field === field);
      if (existingError) {
        existingError.messages.push(...messages);
      } else {
        extractedErrors.push({
          field,
          messages
        });
      }
    }
  });

  return {
    errors: extractedErrors,
    hasErrors: extractedErrors.length > 0,
    errorCount: extractedErrors.reduce((total, error) => total + error.messages.length, 0)
  };
}

/**
 * Convierte los errores extraídos a un formato plano de mensajes
 * @param extractedErrors - Resultado de extractValidationErrors
 * @returns Array de mensajes de error
 */
export function flattenErrorMessages(extractedErrors: ErrorExtractionResult): string[] {
  const messages: string[] = [];
  
  extractedErrors.errors.forEach(error => {
    messages.push(...error.messages);
  });
  
  return messages;
}

/**
 * Convierte los errores extraídos a un formato de objeto plano
 * @param extractedErrors - Resultado de extractValidationErrors
 * @returns Objeto con campo como clave y mensajes como valor
 */
export function errorsToObject(extractedErrors: ErrorExtractionResult): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  
  extractedErrors.errors.forEach(error => {
    result[error.field] = error.messages;
  });
  
  return result;
}

/**
 * Crea un mensaje de error resumido
 * @param extractedErrors - Resultado de extractValidationErrors
 * @returns Mensaje resumido de los errores
 */
export function createSummaryMessage(extractedErrors: ErrorExtractionResult): string {
  if (!extractedErrors.hasErrors) {
    return 'No hay errores de validación';
  }

  const errorCount = extractedErrors.errorCount;
  const fieldCount = extractedErrors.errors.length;
  
  return \`Se encontraron \${errorCount} error(es) de validación en \${fieldCount} campo(s)\`;
} `;
  }




  private getCyberSourceTypes(): string {
    return `declare module 'cybersource-rest-client' {
  export interface CyberSourceConfig {
    authenticationType: string;
    runEnvironment: string;
    merchantID: string;
    merchantKeyId: string;
    merchantsecretKey: string;
    enableLog: boolean;
    logDirectory: string;
    logFileName: string;
    logFileMaxSize: string;
    timeout: number;
    enableClientCert: boolean;
    clientCertDirectory: string;
    clientCertFile: string;
    clientCertPassword: string;
    clientId: string;
    clientSecret: string;
  }

  export interface PaymentRequest {
    clientReferenceInformation: {
      code: string;
    };
    processingInformation: {
      commerceIndicator: string;
    };
    paymentInformation: {
      card: {
        number: string;
        expirationMonth: string;
        expirationYear: string;
        securityCode: string;
      };
    };
    orderInformation: {
      amountDetails: {
        totalAmount: string;
        currency: string;
      };
      billTo: {
        firstName: string;
        lastName: string;
        address1: string;
        locality: string;
        administrativeArea: string;
        postalCode: string;
        country: string;
        email: string;
        phoneNumber: string;
      };
    };
  }

  export interface PaymentResponse {
    id: string;
    status: string;
    reasonCode: number;
  message: string;
    createdTime: string;
    _links: {
      self: {
        href: string;
      };
    };
  }

  export class PaymentsApi {
    constructor(config: CyberSourceConfig);
    createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse>;
  }
}`;
  }

  private getTestFile(): string {
    return `import { handler } from '../src/index';
import { Context } from 'aws-lambda';

describe('AWS Hexagonal Architecture Lambda Handler', () => {
  let mockEvent: any;
  let mockContext: Context;

  beforeEach(() => {
    mockEvent = {
      httpMethod: 'GET',
      path: '/example/customer/test-customer-id',
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
      done: () => { },
      fail: () => { },
      succeed: () => { }
    };
  });



  it('should handle GET customer request successfully', async () => {
    mockEvent.httpMethod = 'GET';
    mockEvent.path = '/example/customer/123';

    const result = await handler(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });


});
`;
  }

  private getMainFile(): string {
    return `import { AuditTracker } from '@wallytech/sdk-audit';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoCustomerRepository } from './adapters/repository/DynamoCustomerRepository';
import { GetCustomerCommandHandler } from './domain/command_handlers/GetCustomerCommandHandler';
import { ExampleController } from './entrypoints/api/ExampleController';
import { Audit } from './infra/Audit';
import Logger from './infra/Logger';
import { AUDIT_OVERRIDES } from './domain/common/consts/audit.constants';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {

  Logger.setInstance(context);
  const auditTracker = await Audit.createTracker(event as any, context, {
    action: context.functionName,
    location: AUDIT_OVERRIDES.location
  });
  Logger.getInstance().info('Evento recibido:', JSON.stringify(event));
  Logger.getInstance().info('Contexto:', JSON.stringify(context));

  // Initialize dependencies
  const customerRepository = new DynamoCustomerRepository();
  const getCustomerHandler = new GetCustomerCommandHandler(customerRepository);
  const exampleController = new ExampleController(auditTracker as AuditTracker, getCustomerHandler);

  try {
    const result = await exampleController.handle(event);
    await auditTracker.success(result);
    return result;
  } catch (error) {
    Logger.getInstance().error('Error in handler:', { raw: error, error: { error }, extra: {} });
    await auditTracker.error(error);
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
    path: '/example/customer/test-customer-id'
  } as APIGatewayProxyEvent;

  handler(testEvent, {} as Context).then(result => {
    console.log('Test result:', result);
  });
}
`;
  }

  private getLogger(): string {
    return `import { Logger as LoggerPower } from '@aws-lambda-powertools/logger';
import { Context } from "aws-lambda";

class Logger {
  private static instance: LoggerPower;

  public static getInstance(): LoggerPower {
    return Logger.instance;
  }
  
  public static setInstance(context: Context) {
    Logger.instance = new LoggerPower({ serviceName: context.functionName });
    Logger.getInstance().addContext(context);
  }
}

export default Logger;
`;
  }

  private getInputExample(): string {
    return `import "reflect-metadata";

import { IsString } from "class-validator";
import { ERROR_MESSAGES } from "../../../domain/exceptions/constants/ErrorMessages";

export class InputExample {

  @IsString({ message: ERROR_MESSAGES.INVALID_DATA })
  data!: string;

  constructor(data: string) {
    this.data = data
  }
} `;
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
