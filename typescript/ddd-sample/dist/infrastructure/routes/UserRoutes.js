"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// Infrastructure Layer - Configuración de rutas HTTP (Primary Adapter)
class UserRoutes {
    constructor(userController) {
        this.app = (0, express_1.default)();
        this.userController = userController;
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    setupRoutes() {
        // Rutas de usuarios
        this.app.get('/api/users/:id', (req, res) => {
            this.userController.getUserById(req, res);
        });
        this.app.post('/api/users', (req, res) => {
            this.userController.createUser(req, res);
        });
        this.app.get('/api/users', (req, res) => {
            this.userController.listUsers(req, res);
        });
        // Ruta de salud
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                message: 'Servidor funcionando correctamente',
                timestamp: new Date().toISOString()
            });
        });
        // Ruta por defecto
        this.app.get('/', (req, res) => {
            res.status(200).json({
                message: 'API de Usuarios con DDD y Arquitectura Hexagonal',
                version: '1.0.0',
                endpoints: {
                    'GET /api/users': 'Listar todos los usuarios',
                    'GET /api/users/:id': 'Obtener usuario por ID',
                    'POST /api/users': 'Crear nuevo usuario',
                    'GET /health': 'Verificar estado del servidor'
                }
            });
        });
        // Manejo de rutas no encontradas
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Ruta no encontrada',
                message: `La ruta ${req.originalUrl} no existe`
            });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=UserRoutes.js.map