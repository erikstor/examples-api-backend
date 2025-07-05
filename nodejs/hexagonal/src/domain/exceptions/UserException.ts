import { BaseError } from './BaseError';
import { ERROR_CODES, HTTP_STATUS_CODES } from './constants/ErrorMessages';
import { USER_ERRORS } from './constants/UserErrors';

export class UserException extends BaseError {
  constructor(message: string, code: string, statusCode: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
  ) {
    super(message, code, statusCode);
    this.name = 'UserException';
  }
}

export class EmailAlreadyExistsException extends UserException {
  constructor() {
    super(USER_ERRORS.EMAIL_ALREADY_EXISTS, ERROR_CODES.INVALID_DATA, HTTP_STATUS_CODES.CONFLICT);
    this.name = 'EmailAlreadyExistsException';
  }
}

export class InvalidUserDataException extends UserException {

  errorMessages: string[];

  constructor(errorMessages: string[]) {
    super(USER_ERRORS.INVALID_USER_DATA, ERROR_CODES.INVALID_DATA, HTTP_STATUS_CODES.BAD_REQUEST);
    this.name = 'InvalidUserDataException';
    this.errorMessages = errorMessages;
  }
}

export class UserNotFoundException extends UserException {
  constructor() {
    super(USER_ERRORS.USER_NOT_FOUND, ERROR_CODES.INVALID_DATA, HTTP_STATUS_CODES.NOT_FOUND);
    this.name = 'UserNotFoundException';
  }
}

