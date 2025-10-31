"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// Domain Layer - Entidad User
class User {
    constructor(_id, _email, _name, _createdAt) {
        this._id = _id;
        this._email = _email;
        this._name = _name;
        this._createdAt = _createdAt;
    }
    // Factory method para crear un usuario
    static create(id, email, name) {
        if (!id || !email || !name) {
            throw new Error('ID, email y name son requeridos para crear un usuario');
        }
        if (!this.isValidEmail(email)) {
            throw new Error('El formato del email no es válido');
        }
        return new User(id, email, name, new Date());
    }
    // Factory method para reconstruir desde persistencia
    static fromPersistence(id, email, name, createdAt) {
        return new User(id, email, name, createdAt);
    }
    // Getters para acceder a las propiedades privadas
    get id() {
        return this._id;
    }
    get email() {
        return this._email;
    }
    get name() {
        return this._name;
    }
    get createdAt() {
        return this._createdAt;
    }
    // Método de dominio para validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Método de dominio para cambiar el nombre
    changeName(newName) {
        if (!newName || newName.trim().length === 0) {
            throw new Error('El nombre no puede estar vacío');
        }
        return new User(this._id, this._email, newName.trim(), this._createdAt);
    }
    // Método para serializar la entidad
    toJSON() {
        return {
            id: this._id,
            email: this._email,
            name: this._name,
            createdAt: this._createdAt.toISOString()
        };
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map