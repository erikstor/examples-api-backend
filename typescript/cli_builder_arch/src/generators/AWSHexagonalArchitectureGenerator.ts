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
    await this.createDirectory('src/types');
    await this.createDirectory('src/utils');
    await this.createDirectory('test');

    // Domain files
    await this.createFile('src/domain/model/ExampleModel.ts', this.getExampleModel());
    await this.createFile('src/domain/model/interfaces/IExample.ts', this.getIExampleInterface());
    await this.createFile('src/domain/model/interfaces/IResponse.ts', this.getIResponseInterface());
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
      await this.createFile('src/domain/common/consts/AuditConstants.ts', this.getAuditConstants());
    }

    // Adapters files
    await this.createFile('src/adapters/repository/DynamoCustomerRepository.ts', this.getDynamoCustomerRepository());
    await this.createFile('src/adapters/service/ExampleService.ts', this.getExampleService());

    // Entrypoints files
    await this.createFile('src/entrypoints/api/ExampleController.ts', this.getExampleController());
    await this.createFile('src/entrypoints/api/model/InputExample.ts', this.getInputExample());

    // Infrastructure files
    await this.createFile('src/infra/Dynamodb.ts', this.getDynamodb());
    await this.createFile('src/infra/Logger.ts', this.getLogger());
    await this.createFile('src/infra/HttpClient.ts', this.getHttpClient());
    await this.createFile('src/infra/Date.ts', this.getDateUtils());
    await this.createFile('src/infra/AwsSecretManager.ts', this.getAwsSecretManager());

    // Utils and types
    await this.createFile('src/utils/ErrorExtractor.ts', this.getErrorExtractor());

    // Main application file
    await this.createFile('src/index.ts', this.getMainFile());

    // Test file
    await this.createFile('test/example.test.ts', this.getTestFile());
    await this.createFile('jest.config.js', this.getJestConfig());
    await this.createFile('tsconfig.test.json', this.getTsConfigTest());
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
    public readonly data: any = {},
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


  private getExampleService(): string {
    return `export class ExampleService {
  // Clase vacía de ejemplo
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

  private async validateRequest(event: APIGatewayProxyEvent) {
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
  }

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    try {
      Logger.getInstance().info('Inicio de proceso de validación de datos', JSON.stringify(event));

      const request = await this.validateRequest(event);

      if (request instanceof InvalidDataException) {
        return request.toResponse();
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



  private getHttpClient(): string {
    return `import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Logger from './Logger';

export class HttpClient {
  /**
   * Método estático para realizar peticiones HTTP usando axios
   * @param config Configuración de axios para la petición
   * @returns Promise con la respuesta de la petición
   */
  static async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.request<T>(config);
      return response;
    } catch (error: any) {
      Logger.getInstance().error('Error in request:', {
        raw: error,
        error: { error },
        extra: {
          config
        }
      });
      throw error;
    }
  }
}`;
  }

  private getDateUtils(): string {
    return `import { DateTime, Duration } from 'luxon';

/**
 * Clase utilitaria para manipular fechas usando Luxon
 * Proporciona métodos estáticos para crear, formatear y manipular fechas
 */
export class DateUtils {
  /**
   * Crea una fecha actual en UTC
   * @returns DateTime en UTC
   */
  static now(): DateTime {
    return DateTime.utc();
  }

  /**
   * Crea una fecha desde un string ISO
   * @param isoString - String en formato ISO (ej: "2023-12-25T10:30:00Z")
   * @returns DateTime parseada
   */
  static fromISO(isoString: string): DateTime {
    return DateTime.fromISO(isoString);
  }

  /**
   * Crea una fecha desde un timestamp Unix
   * @param timestamp - Timestamp en segundos
   * @returns DateTime
   */
  static fromTimestamp(timestamp: number): DateTime {
    return DateTime.fromSeconds(timestamp);
  }

  /**
   * Crea una fecha desde un objeto Date de JavaScript
   * @param date - Objeto Date de JavaScript
   * @returns DateTime
   */
  static fromJSDate(date: Date): DateTime {
    return DateTime.fromJSDate(date);
  }

  /**
   * Crea una fecha desde componentes individuales
   * @param year - Año
   * @param month - Mes (1-12)
   * @param day - Día
   * @param hour - Hora (opcional)
   * @param minute - Minuto (opcional)
   * @param second - Segundo (opcional)
   * @returns DateTime
   */
  static fromComponents(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0
  ): DateTime {
    return DateTime.utc(year, month, day, hour, minute, second);
  }

  /**
   * Formatea una fecha a string ISO
   * @param date - DateTime a formatear
   * @returns String ISO
   */
  static toISO(date: DateTime): string {
    return date.toISO() || '';
  }

  /**
   * Formatea una fecha a string con formato personalizado
   * @param date - DateTime a formatear
   * @param format - Formato (ej: "yyyy-MM-dd HH:mm:ss")
   * @returns String formateado
   */
  static format(date: DateTime, format: string): string {
    return date.toFormat(format);
  }

  /**
   * Formatea una fecha a formato legible
   * @param date - DateTime a formatear
   * @returns String legible (ej: "25 de diciembre de 2023")
   */
  static toReadable(date: DateTime): string {
    return date.toLocaleString(DateTime.DATE_FULL);
  }

  /**
   * Obtiene el timestamp Unix de una fecha
   * @param date - DateTime
   * @returns Timestamp en segundos
   */
  static toTimestamp(date: DateTime): number {
    return date.toSeconds();
  }

  /**
   * Convierte DateTime a objeto Date de JavaScript
   * @param date - DateTime
   * @returns Objeto Date de JavaScript
   */
  static toJSDate(date: DateTime): Date {
    return date.toJSDate();
  }

  /**
   * Suma tiempo a una fecha
   * @param date - Fecha base
   * @param duration - Duración a sumar (ej: { days: 1, hours: 2 })
   * @returns Nueva DateTime
   */
  static add(date: DateTime, duration: Duration | object): DateTime {
    if (duration instanceof Duration) {
      return date.plus(duration);
    }
    return date.plus(duration);
  }

  /**
   * Resta tiempo de una fecha
   * @param date - Fecha base
   * @param duration - Duración a restar (ej: { days: 1, hours: 2 })
   * @returns Nueva DateTime
   */
  static subtract(date: DateTime, duration: Duration | object): DateTime {
    if (duration instanceof Duration) {
      return date.minus(duration);
    }
    return date.minus(duration);
  }

  /**
   * Compara dos fechas
   * @param date1 - Primera fecha
   * @param date2 - Segunda fecha
   * @returns -1 si date1 < date2, 0 si son iguales, 1 si date1 > date2
   */
  static compare(date1: DateTime, date2: DateTime): number {
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
    return 0;
  }

  /**
   * Verifica si una fecha está entre dos fechas
   * @param date - Fecha a verificar
   * @param start - Fecha de inicio
   * @param end - Fecha de fin
   * @returns true si está en el rango
   */
  static isBetween(date: DateTime, start: DateTime, end: DateTime): boolean {
    return date >= start && date <= end;
  }

  /**
   * Obtiene la diferencia entre dos fechas
   * @param date1 - Primera fecha
   * @param date2 - Segunda fecha
   * @returns Duration entre las fechas
   */
  static diff(date1: DateTime, date2: DateTime): Duration {
    return date1.diff(date2);
  }

  /**
   * Obtiene el inicio del día
   * @param date - Fecha base
   * @returns DateTime al inicio del día (00:00:00)
   */
  static startOfDay(date: DateTime): DateTime {
    return date.startOf('day');
  }

  /**
   * Obtiene el final del día
   * @param date - Fecha base
   * @returns DateTime al final del día (23:59:59.999)
   */
  static endOfDay(date: DateTime): DateTime {
    return date.endOf('day');
  }

  /**
   * Obtiene el inicio del mes
   * @param date - Fecha base
   * @returns DateTime al inicio del mes
   */
  static startOfMonth(date: DateTime): DateTime {
    return date.startOf('month');
  }

  /**
   * Obtiene el final del mes
   * @param date - Fecha base
   * @returns DateTime al final del mes
   */
  static endOfMonth(date: DateTime): DateTime {
    return date.endOf('month');
  }

  /**
   * Obtiene el inicio del año
   * @param date - Fecha base
   * @returns DateTime al inicio del año
   */
  static startOfYear(date: DateTime): DateTime {
    return date.startOf('year');
  }

  /**
   * Obtiene el final del año
   * @param date - Fecha base
   * @returns DateTime al final del año
   */
  static endOfYear(date: DateTime): DateTime {
    return date.endOf('year');
  }

  /**
   * Verifica si una fecha es válida
   * @param date - DateTime a verificar
   * @returns true si es válida
   */
  static isValid(date: DateTime): boolean {
    return date.isValid;
  }

  /**
   * Obtiene el error de una fecha inválida
   * @param date - DateTime inválida
   * @returns String con el error
   */
  static getInvalidReason(date: DateTime): string | null {
    return date.invalidReason;
  }

  /**
   * Convierte una fecha a una zona horaria específica
   * @param date - DateTime a convertir
   * @param zone - Zona horaria (ej: "America/Mexico_City")
   * @returns DateTime en la zona horaria especificada
   */
  static setZone(date: DateTime, zone: string): DateTime {
    return date.setZone(zone);
  }

  /**
   * Obtiene la zona horaria de una fecha
   * @param date - DateTime
   * @returns String con la zona horaria
   */
  static getZone(date: DateTime): string {
    return date.zoneName || '';
  }

  /**
   * Crea una duración desde un objeto
   * @param duration - Objeto con duración (ej: { days: 1, hours: 2, minutes: 30 })
   * @returns Duration
   */
  static createDuration(duration: object): Duration {
    return Duration.fromObject(duration);
  }

  /**
   * Crea una duración desde un string ISO
   * @param isoString - String ISO de duración (ej: "P1DT2H30M")
   * @returns Duration
   */
  static durationFromISO(isoString: string): Duration {
    return Duration.fromISO(isoString);
  }

  /**
   * Convierte una duración a milisegundos
   * @param duration - Duration
   * @returns Milisegundos
   */
  static durationToMillis(duration: Duration): number {
    return duration.as('milliseconds');
  }

  /**
   * Convierte una duración a segundos
   * @param duration - Duration
   * @returns Segundos
   */
  static durationToSeconds(duration: Duration): number {
    return duration.as('seconds');
  }

  /**
   * Convierte una duración a minutos
   * @param duration - Duration
   * @returns Minutos
   */
  static durationToMinutes(duration: Duration): number {
    return duration.as('minutes');
  }

  /**
   * Convierte una duración a horas
   * @param duration - Duration
   * @returns Horas
   */
  static durationToHours(duration: Duration): number {
    return duration.as('hours');
  }

  /**
   * Convierte una duración a días
   * @param duration - Duration
   * @returns Días
   */
  static durationToDays(duration: Duration): number {
    return duration.as('days');
  }
}`;
  }

  private getAwsSecretManager(): string {
    return `import { SecretsManager } from 'aws-sdk';
import { IAwsSecretService } from '../domain/ports/IAwsSecretService';

export class AwsSecretManager implements IAwsSecretService {
  private readonly secretsManager: SecretsManager;

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
    return `import { Audit, AuditTracker } from '@wallytech/sdk-audit';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoCustomerRepository } from './adapters/repository/DynamoCustomerRepository';
import { GetCustomerCommandHandler } from './domain/command_handlers/GetCustomerCommandHandler';
import { ExampleController } from './entrypoints/api/ExampleController';
import Logger from './infra/Logger';
import { AUDIT_OVERRIDES } from './domain/common/consts/AuditConstants';

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
  } catch (error: any) {
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
    '^.+\\\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },  
}; `;
  }

  private getTsConfigTest(): string {
    return `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest", "node"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "outDir": "./dist-test",
    "typeRoots": ["./node_modules/@types", "./test/types"]
  },
  "include": [
    "src/**/*",
    "test/**/*",
    "test/types/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "dist-test"
  ]
}`;
  }
}
