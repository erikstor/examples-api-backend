import { ArchitectureGenerator } from './ArchitectureGenerator';

export class AWSHexagonalArchitectureGenerator extends ArchitectureGenerator {
  protected async generateArchitecture(): Promise<void> {
    // Crear estructura basada en AWS Prescriptive Guidance
    await this.createDirectory('src/adapters');
    await this.createDirectory('src/adapters/repository');
    await this.createDirectory('src/adapters/service');
    await this.createDirectory('src/domain');
    await this.createDirectory('src/domain/commands');
    await this.createDirectory('src/domain/commands/recharge');
    await this.createDirectory('src/domain/command_handlers');
    await this.createDirectory('src/domain/command_handlers/recharge');
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
    await this.createFile('src/domain/model/Customer.ts', this.getCustomerModel());
    await this.createFile('src/domain/model/Transaction.ts', this.getTransactionModel());
    await this.createFile('src/domain/model/CyberSourceRequestBuilder.ts', this.getCyberSourceRequestBuilder());
    await this.createFile('src/domain/model/interfaces/ICustomer.ts', this.getICustomerInterface());
    await this.createFile('src/domain/model/interfaces/ICyberSource.ts', this.getICyberSourceInterface());
    await this.createFile('src/domain/model/interfaces/IResponse.ts', this.getIResponseInterface());
    await this.createFile('src/domain/model/interfaces/ITransfer.ts', this.getITransferInterface());
    await this.createFile('src/domain/ports/IAwsSecretRepository.ts', this.getIAwsSecretRepositoryPort());
    await this.createFile('src/domain/ports/ICustomerRepository.ts', this.getICustomerRepositoryPort());
    await this.createFile('src/domain/ports/IPaymentService.ts', this.getIPaymentServicePort());
    await this.createFile('src/domain/ports/ITransactionRepository.ts', this.getITransactionRepositoryPort());
    await this.createFile('src/domain/commands/GetCustomerCommand.ts', this.getGetCustomerCommand());
    await this.createFile('src/domain/commands/PaymentCommand.ts', this.getPaymentCommand());
    await this.createFile('src/domain/commands/recharge/GetTransactionCommand.ts', this.getGetTransactionCommand());
    await this.createFile('src/domain/commands/recharge/UpdateTransactionCommand.ts', this.getUpdateTransactionCommand());
    await this.createFile('src/domain/command_handlers/GetCustomerCommandHandler.ts', this.getGetCustomerCommandHandler());
    await this.createFile('src/domain/command_handlers/PaymentCyberSourceCommandHandler.ts', this.getPaymentCyberSourceCommandHandler());
    await this.createFile('src/domain/command_handlers/recharge/GetTransactionCommandHandler.ts', this.getGetTransactionCommandHandler());
    await this.createFile('src/domain/command_handlers/recharge/UpdateTransactionCommandHandler.ts', this.getUpdateTransactionCommandHandler());
    await this.createFile('src/domain/exceptions/core/BaseException.ts', this.getBaseException());
    await this.createFile('src/domain/exceptions/core/AwsSecretManagerException.ts', this.getAwsSecretManagerException());
    await this.createFile('src/domain/exceptions/core/InvalidDataException.ts', this.getInvalidDataException());
    await this.createFile('src/domain/exceptions/core/NotFoundException.ts', this.getNotFoundException());
    await this.createFile('src/domain/exceptions/core/SystemException.ts', this.getSystemException());
    await this.createFile('src/domain/exceptions/constants/ErrorMessages.ts', this.getErrorMessages());
    await this.createFile('src/domain/exceptions/constants/CyberSourceRequestBuilderExceptions.ts', this.getCyberSourceRequestBuilderExceptions());
    await this.createFile('src/domain/exceptions/constants/InputMessageException.ts', this.getInputMessageException());
    await this.createFile('src/domain/exceptions/CustomerException.ts', this.getCustomerException());
    await this.createFile('src/domain/exceptions/CyberSourceException.ts', this.getCyberSourceException());
    await this.createFile('src/domain/exceptions/TransactionException.ts', this.getTransactionException());
    await this.createFile('src/domain/common/consts/Setup.ts', this.getSetup());
    await this.createFile('src/domain/common/consts/SuccessMessages.ts', this.getSuccessMessages());
    await this.createFile('src/domain/common/SuccessResponse.ts', this.getSuccessResponse());
    await this.createFile('src/domain/events/RechargeEvent.ts', this.getRechargeEvent());

    // Audit constants si está habilitado
    if (this.options.useWallyAudit) {
      await this.createFile('src/domain/common/consts/audit.constants.ts', this.getAuditConstants());
    }

    // Adapters files
    await this.createFile('src/adapters/repository/DynamoCustomerRepository.ts', this.getDynamoCustomerRepository());
    await this.createFile('src/adapters/repository/DynamoTransactionRepository.ts', this.getDynamoTransactionRepository());
    await this.createFile('src/adapters/service/AwsSecretService.ts', this.getAwsSecretService());
    await this.createFile('src/adapters/service/CyberSourcePaymentService.ts', this.getCyberSourcePaymentService());

    // Entrypoints files
    await this.createFile('src/entrypoints/api/RechargeController.ts', this.getRechargeController());
    await this.createFile('src/entrypoints/api/model/InputRecharge.ts', this.getInputRecharge());

    // Infrastructure files
    await this.createFile('src/infra/interfaces/IAudit.ts', this.getIAuditInterface());
    await this.createFile('src/infra/Audit.ts', this.getAudit());
    await this.createFile('src/infra/Dynamodb.ts', this.getDynamodb());
    await this.createFile('src/infra/Logger.ts', this.getLogger());

    // Utils and types
    await this.createFile('src/utils/ErrorExtractor.ts', this.getErrorExtractor());
    await this.createFile('src/utils/formatExpirationMonth.ts', this.getFormatExpirationMonth());
    await this.createFile('src/utils/GetCardProvider.ts', this.getGetCardProvider());
    await this.createFile('src/utils/WarmupHandler.ts', this.getWarmupHandler());
    await this.createFile('src/types/cybersource-rest-client.d.ts', this.getCyberSourceTypes());

    // Main application file
    await this.createFile('src/index.ts', this.getMainFile());

    // Test file
    await this.createFile('test/example.test.ts', this.getTestFile());
  }

  private getCustomerModel(): string {
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

  private getTransactionModel(): string {
    return `export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionImpl implements Transaction {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: 'pending' | 'completed' | 'failed' | 'cancelled',
    public readonly paymentMethod: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Domain methods
  updateStatus(newStatus: 'pending' | 'completed' | 'failed' | 'cancelled'): TransactionImpl {
    return new TransactionImpl(
      this.id,
      this.customerId,
      this.amount,
      this.currency,
      newStatus,
      this.paymentMethod,
      this.createdAt,
      new Date()
    );
  }

  // Business rules
  isValid(): boolean {
    return this.amount > 0 && this.customerId.length > 0;
  }
}`;
  }

  private getCyberSourceRequestBuilder(): string {
    return `export class CyberSourceRequestBuilder {
  private request: any = {};

  setMerchantId(merchantId: string): this {
    this.request.merchantId = merchantId;
    return this;
  }

  setAmount(amount: number): this {
    this.request.amount = amount;
    return this;
  }

  setCurrency(currency: string): this {
    this.request.currency = currency;
    return this;
  }

  setCardData(cardData: any): this {
    this.request.cardData = cardData;
    return this;
  }

  build(): any {
    return this.request;
  }
}`;
  }


  private getICustomerInterface(): string {
    return `export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerModel {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateCustomerModel {
  name?: string;
  email?: string;
  phone?: string;
}`;
  }

  private getICyberSourceInterface(): string {
    return `export interface ICyberSource {
  merchantId: string;
  amount: number;
  currency: string;
  cardData: {
    number: string;
    expirationMonth: string;
    expirationYear: string;
    securityCode: string;
  };
}

export interface CyberSourceResponse {
  status: string;
  reasonCode: number;
  message: string;
  data?: any;
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

  private getIAwsSecretRepositoryPort(): string {
    return `export interface IAwsSecretRepository {
  getSecret(secretName: string): Promise<string>;
  getSecretValue(secretName: string, key: string): Promise<string>;
}`;
  }

  private getICustomerRepositoryPort(): string {
    return `import { Customer } from '../model/Customer';

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}`;
  }

  private getIPaymentServicePort(): string {
    return `import { ICyberSource } from '../model/interfaces/ICyberSource';

export interface IPaymentService {
  processPayment(paymentData: ICyberSource): Promise<any>;
  validatePayment(paymentData: ICyberSource): Promise<boolean>;
  refundPayment(transactionId: string, amount: number): Promise<any>;
}`;
  }

  private getITransactionRepositoryPort(): string {
    return `import { Transaction } from '../model/Transaction';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByCustomerId(customerId: string): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}`;
  }

  private getGetCustomerCommand(): string {
    return `export class GetCustomerCommand {
  constructor(
    public readonly customerId: string
  ) {}
}`;
  }

  private getPaymentCommand(): string {
    return `export class PaymentCommand {
  constructor(
    public readonly customerId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly cardData: any
  ) {}
}`;
  }

  private getGetTransactionCommand(): string {
    return `export class GetTransactionCommand {
  constructor(
    public readonly transactionId: string
  ) {}
}`;
  }

  private getUpdateTransactionCommand(): string {
    return `export class UpdateTransactionCommand {
  constructor(
    public readonly transactionId: string,
    public readonly status: 'pending' | 'completed' | 'failed' | 'cancelled'
  ) {}
}`;
  }

  private getGetCustomerCommandHandler(): string {
    return `import { GetCustomerCommand } from '../commands/GetCustomerCommand';
import { ICustomerRepository } from '../ports/ICustomerRepository';
import { Customer } from '../model/Customer';

export class GetCustomerCommandHandler {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async handle(command: GetCustomerCommand): Promise<Customer | null> {
    return await this.customerRepository.findById(command.customerId);
  }
}`;
  }

  private getPaymentCyberSourceCommandHandler(): string {
    return `import { PaymentCommand } from '../commands/PaymentCommand';
import { IPaymentService } from '../ports/IPaymentService';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { Transaction, TransactionImpl } from '../model/Transaction';

export class PaymentCyberSourceCommandHandler {
  constructor(
    private readonly paymentService: IPaymentService,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async handle(command: PaymentCommand): Promise<Transaction> {
    // Validate payment data
    const isValid = await this.paymentService.validatePayment({
      merchantId: 'default-merchant',
      amount: command.amount,
      currency: command.currency,
      cardData: command.cardData
    });

    if (!isValid) {
      throw new Error('Invalid payment data');
    }

    // Process payment
    const paymentResult = await this.paymentService.processPayment({
      merchantId: 'default-merchant',
      amount: command.amount,
      currency: command.currency,
      cardData: command.cardData
    });

    // Create transaction
    const transaction = new TransactionImpl(
      this.generateId(),
      command.customerId,
      command.amount,
      command.currency,
      paymentResult.status === 'success' ? 'completed' : 'failed',
      'cybersource',
      new Date(),
      new Date()
    );

    return await this.transactionRepository.save(transaction);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}`;
  }

  private getGetTransactionCommandHandler(): string {
    return `import { GetTransactionCommand } from '../commands/recharge/GetTransactionCommand';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { Transaction } from '../model/Transaction';

export class GetTransactionCommandHandler {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async handle(command: GetTransactionCommand): Promise<Transaction | null> {
    return await this.transactionRepository.findById(command.transactionId);
  }
}`;
  }

  private getUpdateTransactionCommandHandler(): string {
    return `import { UpdateTransactionCommand } from '../commands/recharge/UpdateTransactionCommand';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { Transaction } from '../model/Transaction';

export class UpdateTransactionCommandHandler {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async handle(command: UpdateTransactionCommand): Promise<Transaction | null> {
    const existing = await this.transactionRepository.findById(command.transactionId);
    if (!existing) {
      return null;
    }

    const updatedTransaction = {
      ...existing,
      status: command.status,
      updatedAt: new Date()
    };

    return await this.transactionRepository.update(updatedTransaction);
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

  private getCyberSourceRequestBuilderExceptions(): string {
    return `export const CYBERSOURCE_REQUEST_BUILDER_EXCEPTIONS = {
  INVALID_MERCHANT_ID: 'Merchant ID is required',
  INVALID_AMOUNT: 'Amount must be greater than 0',
  INVALID_CURRENCY: 'Currency is required',
  INVALID_CARD_DATA: 'Card data is required'
} as const;
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

  private getCustomerException(): string {
    return `import { BaseException } from './core/BaseException';
import { ERROR_CODES, HTTP_STATUS_CODES } from './constants/ErrorMessages';

export class CustomerException extends BaseException {
  constructor(message: string) {
    super(message, ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS_CODES.BAD_REQUEST);
    this.name = 'CustomerException';
  }
}`;
  }

  private getCyberSourceException(): string {
    return `import { BaseException } from './core/BaseException';
import { ERROR_CODES, HTTP_STATUS_CODES } from './constants/ErrorMessages';

export class CyberSourceException extends BaseException {
  constructor(message: string) {
    super(message, ERROR_CODES.INTERNAL_ERROR, HTTP_STATUS_CODES.BAD_GATEWAY);
    this.name = 'CyberSourceException';
  }
}`;
  }

  private getTransactionException(): string {
    return `import { BaseException } from './core/BaseException';
import { ERROR_CODES, HTTP_STATUS_CODES } from './constants/ErrorMessages';

export class TransactionException extends BaseException {
  constructor(message: string) {
    super(message, ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS_CODES.BAD_REQUEST);
    this.name = 'TransactionException';
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


export const TABLE_PRODUCT_GROUP = 'PRODUTCS#POCKETS'
export const TABLE_PRODUCT_STATUS_ACTIVE = 'ACTIVE'

export const CARD_TYPE = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex',
  DISCOVER: 'discover',
  OTHERS: 'others'
}`;
  }

  private getSuccessMessages(): string {
    return `export const SUCCESS_MESSAGES = {
  OK: "Operación exitosa",
  RECHARGE_CONFIRMED: "Recarga confirmada exitosamente",
  CARD_TOKENIZATION_SAVED: "Datos de tarjeta tokenizada guardados exitosamente",
  CARD_TOKENIZATION_RECHARGE_SAVED: "Datos de tarjeta tokenizada y recarga guardados exitosamente"
} as const


export const SUCCESS_CODES = {
  OK: 'OK',
  CREATED: 'CREATED',
  RECHARGE_CONFIRMED: 'RECHARGE_CONFIRMED',
} as const;


export const CYBERSOURCE_AUTHENTICATION_SUCCESSFUL_STATUS = "AUTHENTICATION_SUCCESSFUL"`;
  }

  private getSuccessResponse(): string {
    return `import { APIGatewayProxyResult } from "aws-lambda";

import { HTTP_STATUS_CODES } from "../constants/ErrorMessages";
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

  private getRechargeEvent(): string {
    return `import { SQS } from 'aws-sdk';

export interface RechargeEvent {
  transactionId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export class RechargeEventPublisher {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS({ region: process.env.AWS_REGION || 'us-east-1' });
  }

  async publishRechargeEvent(event: RechargeEvent): Promise<void> {
    const params = {
      QueueUrl: process.env.RECHARGE_EVENT_QUEUE_URL || 'https://sqs.us-east-1.amazonaws.com/123456789012/recharge-events',
      MessageBody: JSON.stringify(event),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'recharge'
        },
        status: {
          DataType: 'String',
          StringValue: event.status
        }
      }
    };

    try {
      await this.sqs.sendMessage(params).promise();
      console.log('Recharge event published successfully:', event.transactionId);
    } catch (error) {
      console.error('Error publishing recharge event:', error);
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
    return `import { DynamoDB } from 'aws-sdk';
import { ICustomerRepository } from '../../domain/ports/ICustomerRepository';
import { Customer } from '../../domain/model/Customer';

export class DynamoCustomerRepository implements ICustomerRepository {
  private dynamoDB: DynamoDB.DocumentClient;
  private tableName: string;

  constructor() {
    this.dynamoDB = new DynamoDB.DocumentClient();
    this.tableName = process.env.CUSTOMERS_TABLE_NAME || 'customers';
  }

  async findById(id: string): Promise<Customer | null> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    const result = await this.dynamoDB.get(params).promise();
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

    const result = await this.dynamoDB.query(params).promise();
    return result.Items?.[0] as Customer || null;
  }

  async save(customer: Customer): Promise<Customer> {
    const params = {
      TableName: this.tableName,
      Item: customer
    };

    await this.dynamoDB.put(params).promise();
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

    await this.dynamoDB.update(params).promise();
    return customer;
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    await this.dynamoDB.delete(params).promise();
  }

  async exists(id: string): Promise<boolean> {
    const customer = await this.findById(id);
    return customer !== null;
  }
}`;
  }

  private getDynamoTransactionRepository(): string {
    return `import { DynamoDB } from 'aws-sdk';
import { ITransactionRepository } from '../../domain/ports/ITransactionRepository';
import { Transaction } from '../../domain/model/Transaction';

export class DynamoTransactionRepository implements ITransactionRepository {
  private dynamoDB: DynamoDB.DocumentClient;
  private tableName: string;

  constructor() {
    this.dynamoDB = new DynamoDB.DocumentClient();
    this.tableName = process.env.TRANSACTIONS_TABLE_NAME || 'transactions';
  }

  async findById(id: string): Promise<Transaction | null> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    const result = await this.dynamoDB.get(params).promise();
    return result.Item as Transaction || null;
  }

  async findByCustomerId(customerId: string): Promise<Transaction[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'customerId-index',
      KeyConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':customerId': customerId
      }
    };

    const result = await this.dynamoDB.query(params).promise();
    return result.Items as Transaction[] || [];
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const params = {
      TableName: this.tableName,
      Item: transaction
    };

    await this.dynamoDB.put(params).promise();
    return transaction;
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const params = {
      TableName: this.tableName,
      Key: { id: transaction.id },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': transaction.status,
        ':updatedAt': transaction.updatedAt
      }
    };

    await this.dynamoDB.update(params).promise();
    return transaction;
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    await this.dynamoDB.delete(params).promise();
  }

  async exists(id: string): Promise<boolean> {
    const transaction = await this.findById(id);
    return transaction !== null;
  }
}`;
  }

  private getAwsSecretService(): string {
    return `import { SecretsManager } from 'aws-sdk';
import { IAwsSecretRepository } from '../../domain/ports/IAwsSecretRepository';

export class AwsSecretService implements IAwsSecretRepository {
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

  private getCyberSourcePaymentService(): string {
    return `import { IPaymentService } from '../../domain/ports/IPaymentService';
import { ICyberSource } from '../../domain/model/interfaces/ICyberSource';
import { CyberSourceRequestBuilder } from '../../domain/model/CyberSourceRequestBuilder';

export class CyberSourcePaymentService implements IPaymentService {
  private apiKey: string;
  private merchantId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CYBERSOURCE_API_KEY || '';
    this.merchantId = process.env.CYBERSOURCE_MERCHANT_ID || '';
    this.baseUrl = process.env.CYBERSOURCE_BASE_URL || 'https://apitest.cybersource.com';
  }

  async processPayment(paymentData: ICyberSource): Promise<any> {
    try {
      const requestBuilder = new CyberSourceRequestBuilder()
        .setMerchantId(paymentData.merchantId)
        .setAmount(paymentData.amount)
        .setCurrency(paymentData.currency)
        .setCardData(paymentData.cardData);

      const request = requestBuilder.build();

      // Simulate API call to CyberSource
      const response = await this.callCyberSourceAPI(request);
      
      return {
        status: response.status === 'AUTHORIZED' ? 'success' : 'failed',
        transactionId: response.id,
        reasonCode: response.reasonCode,
        message: response.message
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Payment processing failed');
    }
  }

  async validatePayment(paymentData: ICyberSource): Promise<boolean> {
    // Basic validation
    if (!paymentData.merchantId || !paymentData.amount || !paymentData.currency) {
      return false;
    }

    if (paymentData.amount <= 0) {
      return false;
    }

    if (!paymentData.cardData || !paymentData.cardData.number) {
      return false;
    }

    return true;
  }

  async refundPayment(transactionId: string, amount: number): Promise<any> {
    try {
      // Simulate refund API call
      const response = await this.callCyberSourceRefundAPI(transactionId, amount);
      
      return {
        status: response.status === 'REFUNDED' ? 'success' : 'failed',
        refundId: response.id,
        amount: response.amount
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Refund processing failed');
    }
  }

  private async callCyberSourceAPI(request: any): Promise<any> {
    // Simulate API call
    return {
      id: Math.random().toString(36).substr(2, 9),
      status: 'AUTHORIZED',
      reasonCode: 100,
      message: 'Successful transaction'
    };
  }

  private async callCyberSourceRefundAPI(transactionId: string, amount: number): Promise<any> {
    // Simulate refund API call
    return {
      id: Math.random().toString(36).substr(2, 9),
      status: 'REFUNDED',
      amount: amount
    };
  }
}`;
  }

  private getRechargeController(): string {
    return `import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCustomerCommandHandler } from '../../domain/command_handlers/GetCustomerCommandHandler';
import { PaymentCyberSourceCommandHandler } from '../../domain/command_handlers/PaymentCyberSourceCommandHandler';
import { GetTransactionCommandHandler } from '../../domain/command_handlers/recharge/GetTransactionCommandHandler';
import { UpdateTransactionCommandHandler } from '../../domain/command_handlers/recharge/UpdateTransactionCommandHandler';
import { DynamoCustomerRepository } from '../../adapters/repository/DynamoCustomerRepository';
import { DynamoTransactionRepository } from '../../adapters/repository/DynamoTransactionRepository';
import { CyberSourcePaymentService } from '../../adapters/service/CyberSourcePaymentService';
import { SuccessResponse } from '../../domain/common/SuccessResponse';
import { InputRecharge } from './model/InputRecharge';

export class RechargeController {
  private getCustomerHandler: GetCustomerCommandHandler;
  private paymentHandler: PaymentCyberSourceCommandHandler;
  private getTransactionHandler: GetTransactionCommandHandler;
  private updateTransactionHandler: UpdateTransactionCommandHandler;

  constructor() {
    const customerRepository = new DynamoCustomerRepository();
    const transactionRepository = new DynamoTransactionRepository();
    const paymentService = new CyberSourcePaymentService();

    this.getCustomerHandler = new GetCustomerCommandHandler(customerRepository);
    this.paymentHandler = new PaymentCyberSourceCommandHandler(paymentService, transactionRepository);
    this.getTransactionHandler = new GetTransactionCommandHandler(transactionRepository);
    this.updateTransactionHandler = new UpdateTransactionCommandHandler(transactionRepository);
  }

  async handleRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const method = event.httpMethod;
      const path = event.path;

      switch (method) {
        case 'POST':
          if (path === '/recharge') {
            return await this.processRecharge(event);
          }
          break;
        case 'GET':
          if (path.startsWith('/recharge/transaction/')) {
            return await this.getTransaction(event);
          }
          if (path.startsWith('/recharge/customer/')) {
            return await this.getCustomer(event);
          }
          break;
        case 'PUT':
          if (path.startsWith('/recharge/transaction/')) {
            return await this.updateTransaction(event);
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

  private async processRecharge(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const input: InputRecharge = JSON.parse(event.body || '{}');
    
    const command = {
      customerId: input.customerId,
      amount: input.amount,
      currency: input.currency,
      cardData: input.cardData
    };

    const result = await this.paymentHandler.handle(command);
    
    return {
      statusCode: 201,
      body: JSON.stringify(new SuccessResponse(result).toResponse())
    };
  }

  private async getTransaction(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const transactionId = event.path.split('/')[3];
    const command = { transactionId };
    
    const result = await this.getTransactionHandler.handle(command);
    
    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Transaction not found' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(new SuccessResponse(result).toResponse())
    };
  }

  private async getCustomer(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const customerId = event.path.split('/')[3];
    const command = { customerId };
    
    const result = await this.getCustomerHandler.handle(command);
    
    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Customer not found' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(new SuccessResponse(result).toResponse())
    };
  }

  private async updateTransaction(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const transactionId = event.path.split('/')[3];
    const input = JSON.parse(event.body || '{}');
    
    const command = {
      transactionId,
      status: input.status
    };

    const result = await this.updateTransactionHandler.handle(command);
    
    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Transaction not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(new SuccessResponse(result).toResponse())
    };
  }
}`;
  }

  private getInputRecharge(): string {
    return `export interface InputRecharge {
  customerId: string;
  amount: number;
  currency: string;
  cardData: {
    number: string;
    expirationMonth: string;
    expirationYear: string;
    securityCode: string;
    cardholderName: string;
  };
}

export interface CreateRechargeInput extends InputRecharge {}

export interface UpdateRechargeInput {
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
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
    return `import { DynamoDB } from 'aws-sdk';

export class DynamoDBClient {
  private dynamoDB: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDB = new DynamoDB.DocumentClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
  }

  async getItem(tableName: string, key: any): Promise<any> {
    const params = {
      TableName: tableName,
      Key: key
    };

    const result = await this.dynamoDB.get(params).promise();
    return result.Item;
  }

  async putItem(tableName: string, item: any): Promise<any> {
    const params = {
      TableName: tableName,
      Item: item
    };

    return await this.dynamoDB.put(params).promise();
  }

  async updateItem(tableName: string, key: any, updateExpression: string, expressionAttributeValues: any): Promise<any> {
    const params = {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    };

    return await this.dynamoDB.update(params).promise();
  }

  async deleteItem(tableName: string, key: any): Promise<any> {
    const params = {
      TableName: tableName,
      Key: key
    };

    return await this.dynamoDB.delete(params).promise();
  }

  async query(tableName: string, keyConditionExpression: string, expressionAttributeValues: any): Promise<any> {
    const params = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    };

    const result = await this.dynamoDB.query(params).promise();
    return result.Items;
  }
}`;
  }

  private getLogger(): string {
    return `export class Logger {
  private static instance: Logger;

  static setInstance(context: any): void {
    this.instance = new Logger(context);
  }

  static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger({});
    }
    return this.instance;
  }

  constructor(private context: any) {}

  info(message: string, data?: any): void {
    console.log(\`[INFO] \${message}\`, data ? JSON.stringify(data, null, 2) : '');
  }

  error(message: string, data?: any): void {
    console.error(\`[ERROR] \${message}\`, data ? JSON.stringify(data, null, 2) : '');
  }

  warn(message: string, data?: any): void {
    console.warn(\`[WARN] \${message}\`, data ? JSON.stringify(data, null, 2) : '');
  }

  debug(message: string, data?: any): void {
    console.debug(\`[DEBUG] \${message}\`, data ? JSON.stringify(data, null, 2) : '');
  }
}`;
  }

  private getErrorExtractor(): string {
    return `export class ErrorExtractor {
  static extractErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && error.message) {
      return error.message;
    }
    
    return 'Unknown error occurred';
  }

  static extractErrorCode(error: any): string {
    if (error && error.code) {
      return error.code;
    }
    
    if (error && error.statusCode) {
      return error.statusCode.toString();
    }
    
    return 'UNKNOWN_ERROR';
  }

  static extractErrorDetails(error: any): any {
    if (error && error.details) {
      return error.details;
    }
    
    if (error && error.data) {
      return error.data;
    }
    
    return {};
  }
}`;
  }

  private getFormatExpirationMonth(): string {
    return `export function formatExpirationMonth(month: string | number): string {
  const monthStr = month.toString();
  
  if (monthStr.length === 1) {
    return \`0\${monthStr}\`;
  }
  
  if (monthStr.length === 2) {
    return monthStr;
  }
  
  throw new Error('Invalid month format');
}`;
  }

  private getGetCardProvider(): string {
    return `export function getCardProvider(cardNumber: string): string {
  // Remove spaces and non-numeric characters
  const cleanNumber = cardNumber.replace(/\\D/g, '');
  
  // Visa
  if (/^4/.test(cleanNumber)) {
    return 'visa';
  }
  
  // Mastercard
  if (/^5[1-5]/.test(cleanNumber)) {
    return 'mastercard';
  }
  
  // American Express
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  }
  
  // Discover
  if (/^6(?:011|5)/.test(cleanNumber)) {
    return 'discover';
  }
  
  return 'others';
}`;
  }

  private getWarmupHandler(): string {
    return `export class WarmupHandler {
  static isWarmupRequest(event: any): boolean {
    return event.source === 'serverless-plugin-warmup';
  }

  static handleWarmup(): any {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Lambda function warmed up successfully',
        timestamp: new Date().toISOString()
      })
    };
  }
}`;
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
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('AWS Hexagonal Architecture Lambda Handler', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeEach(() => {
    mockEvent = {
      httpMethod: 'POST',
      path: '/recharge',
      body: JSON.stringify({
        customerId: 'test-customer-id',
        amount: 100.00,
        currency: 'USD',
        cardData: {
          number: '4111111111111111',
          expirationMonth: '12',
          expirationYear: '2025',
          securityCode: '123',
          cardholderName: 'Test User'
        }
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

  it('should handle POST recharge request successfully', async () => {
    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
    
    const body = JSON.parse(result.body);
    expect(body.message).toBeDefined();
  });

  it('should handle GET transaction request successfully', async () => {
    mockEvent.httpMethod = 'GET';
    mockEvent.path = '/recharge/transaction/123';

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });

  it('should handle GET customer request successfully', async () => {
    mockEvent.httpMethod = 'GET';
    mockEvent.path = '/recharge/customer/123';

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });

  it('should handle PUT transaction request successfully', async () => {
    mockEvent.httpMethod = 'PUT';
    mockEvent.path = '/recharge/transaction/123';
    mockEvent.body = JSON.stringify({
      status: 'completed'
    });

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });

  it('should handle warmup requests', async () => {
    mockEvent.source = 'serverless-plugin-warmup';

    const result = await handler(mockEvent, mockContext);
    
    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
    
    const body = JSON.parse(result.body);
    expect(body.message).toContain('warmed up');
  });
});
`;
  }

  private getMainFile(): string {
    const loggerImport = this.options.usePowertoolsLogger ? `import Logger from './utils/Logger';` : '';
    const auditImport = this.options.useWallyAudit ? `import { Audit } from './infra/Audit';` : '';
    
    const loggerInit = this.options.usePowertoolsLogger ? `  Logger.setInstance(context);` : '';
    const auditInit = this.options.useWallyAudit ? `  const auditTracker = await Audit.createTracker(event as any, context, {
    action: context.functionName,
    location: 'BACKOFFICE'
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
import { RechargeController } from './entrypoints/api/RechargeController';
import { WarmupHandler } from './utils/WarmupHandler';

// Initialize dependencies
const rechargeController = new RechargeController();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Handle warmup requests
  if (WarmupHandler.isWarmupRequest(event)) {
    return WarmupHandler.handleWarmup();
  }

${loggerInit}
${auditInit}
${loggerInfo}

  try {
    const result = await rechargeController.handleRequest(event);
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
    path: '/recharge',
    body: JSON.stringify({
      customerId: 'test-customer-id',
      amount: 100.00,
      currency: 'USD',
      cardData: {
        number: '4111111111111111',
        expirationMonth: '12',
        expirationYear: '2025',
        securityCode: '123',
        cardholderName: 'Test User'
      }
    })
  } as APIGatewayProxyEvent;

  handler(testEvent, {} as Context).then(result => {
    console.log('Test result:', result);
  });
}
`;
  }
}
