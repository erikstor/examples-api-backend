// Domain Layer - Excepciones de dominio
export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`Usuario con ID ${userId} no encontrado`);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidUserDataError extends Error {
  constructor(message: string) {
    super(`Datos de usuario inválidos: ${message}`);
    this.name = 'InvalidUserDataError';
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Ya existe un usuario con el email ${email}`);
    this.name = 'UserAlreadyExistsError';
  }
}
