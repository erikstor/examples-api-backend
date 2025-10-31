"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlreadyExistsError = exports.InvalidUserDataError = exports.UserNotFoundError = void 0;
// Domain Layer - Excepciones de dominio
class UserNotFoundError extends Error {
    constructor(userId) {
        super(`Usuario con ID ${userId} no encontrado`);
        this.name = 'UserNotFoundError';
    }
}
exports.UserNotFoundError = UserNotFoundError;
class InvalidUserDataError extends Error {
    constructor(message) {
        super(`Datos de usuario inválidos: ${message}`);
        this.name = 'InvalidUserDataError';
    }
}
exports.InvalidUserDataError = InvalidUserDataError;
class UserAlreadyExistsError extends Error {
    constructor(email) {
        super(`Ya existe un usuario con el email ${email}`);
        this.name = 'UserAlreadyExistsError';
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
//# sourceMappingURL=UserExceptions.js.map