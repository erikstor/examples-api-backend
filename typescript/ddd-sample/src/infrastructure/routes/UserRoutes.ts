import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { UserController } from '../controllers/UserController';

// Infrastructure Layer - Configuración de rutas HTTP (Primary Adapter)
export class UserRoutes {
  private app: Application;
  private userController: UserController;

  constructor(userController: UserController) {
    this.app = express();
    this.userController = userController;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
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

  public getApp(): Application {
    return this.app;
  }
}
