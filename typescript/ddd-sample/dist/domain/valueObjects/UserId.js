"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.UserId = void 0;
// Domain Layer - Value Objects
class UserId {
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('El ID del usuario no puede estar vacío');
        }
        return new UserId(value.trim());
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
exports.UserId = UserId;
class Email {
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('El email no puede estar vacío');
        }
        if (!this.isValidEmail(value)) {
            throw new Error('El formato del email no es válido');
        }
        return new Email(value.toLowerCase().trim());
    }
    getValue() {
        return this.value;
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
exports.Email = Email;
//# sourceMappingURL=UserId.js.map