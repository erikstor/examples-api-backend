"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserExceptions_1 = require("../../domain/exceptions/UserExceptions");
// Infrastructure Layer - Controlador HTTP (Primary Adapter)
class UserController {
    constructor(getUserUseCase, createUserUseCase, listUsersUseCase) {
        this.getUserUseCase = getUserUseCase;
        this.createUserUseCase = createUserUseCase;
        this.listUsersUseCase = listUsersUseCase;
    }
    // Obtener un usuario por ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    error: 'ID de usuario requerido',
                    message: 'Debe proporcionar un ID de usuario válido'
                });
                return;
            }
            const user = await this.getUserUseCase.execute(id);
            res.status(200).json({
                success: true,
                data: user.toJSON()
            });
        }
        catch (error) {
            if (error instanceof UserExceptions_1.UserNotFoundError) {
                res.status(404).json({
                    error: 'Usuario no encontrado',
                    message: error.message
                });
                return;
            }
            if (error instanceof UserExceptions_1.InvalidUserDataError) {
                res.status(400).json({
                    error: 'Datos inválidos',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                error: 'Error interno del servidor',
                message: 'Ha ocurrido un error inesperado'
            });
        }
    }
    // Crear un nuevo usuario
    async createUser(req, res) {
        try {
            const { id, email, name } = req.body;
            if (!id || !email || !name) {
                res.status(400).json({
                    error: 'Datos requeridos',
                    message: 'ID, email y name son campos requeridos'
                });
                return;
            }
            const user = await this.createUserUseCase.execute({ id, email, name });
            res.status(201).json({
                success: true,
                data: user.toJSON(),
                message: 'Usuario creado exitosamente'
            });
        }
        catch (error) {
            if (error instanceof UserExceptions_1.UserAlreadyExistsError) {
                res.status(409).json({
                    error: 'Usuario ya existe',
                    message: error.message
                });
                return;
            }
            if (error instanceof UserExceptions_1.InvalidUserDataError) {
                res.status(400).json({
                    error: 'Datos inválidos',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                error: 'Error interno del servidor',
                message: 'Ha ocurrido un error inesperado'
            });
        }
    }
    // Listar todos los usuarios
    async listUsers(req, res) {
        try {
            const users = await this.listUsersUseCase.execute();
            res.status(200).json({
                success: true,
                data: users.map(user => user.toJSON()),
                count: users.length
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Error interno del servidor',
                message: 'Ha ocurrido un error inesperado'
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map