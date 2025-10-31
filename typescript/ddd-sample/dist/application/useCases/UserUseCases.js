"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersUseCaseImpl = exports.CreateUserUseCaseImpl = exports.GetUserUseCaseImpl = void 0;
const User_1 = require("../../domain/entities/User");
const UserExceptions_1 = require("../../domain/exceptions/UserExceptions");
// Application Layer - Caso de uso para obtener un usuario
class GetUserUseCaseImpl {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new UserExceptions_1.InvalidUserDataError('El ID del usuario es requerido');
        }
        const user = await this.userRepository.findById(userId.trim());
        if (!user) {
            throw new UserExceptions_1.UserNotFoundError(userId);
        }
        return user;
    }
}
exports.GetUserUseCaseImpl = GetUserUseCaseImpl;
// Application Layer - Caso de uso para crear un usuario
class CreateUserUseCaseImpl {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userData) {
        // Validar datos de entrada
        if (!userData.id || !userData.email || !userData.name) {
            throw new UserExceptions_1.InvalidUserDataError('ID, email y name son requeridos');
        }
        // Verificar si ya existe un usuario con ese email
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new UserExceptions_1.UserAlreadyExistsError(userData.email);
        }
        // Crear la entidad usuario
        const user = User_1.User.create(userData.id, userData.email, userData.name);
        // Guardar en el repositorio
        await this.userRepository.save(user);
        return user;
    }
}
exports.CreateUserUseCaseImpl = CreateUserUseCaseImpl;
// Application Layer - Caso de uso para listar usuarios
class ListUsersUseCaseImpl {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        return await this.userRepository.findAll();
    }
}
exports.ListUsersUseCaseImpl = ListUsersUseCaseImpl;
//# sourceMappingURL=UserUseCases.js.map