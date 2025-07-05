import { APIGatewayProxyResult } from "aws-lambda";
import { HTTP_STATUS_CODES } from "./constants/ErrorMessages";

export class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
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
        message: this.message,
        error: {
          code: this.code,
          message: this.message
        }
      })
    };
  }
}