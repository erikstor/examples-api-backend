import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  /**
   * POST /users - Crear un nuevo usuario
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, age } = req.body;

      // Validaciones básicas
      if (!email || !name) {
        res.status(400).json({
          error: 'Email and name are required',
        });
        return;
      }

      // Verificar si el email ya existe
      const emailExists = await userService.emailExists(email);
      if (emailExists) {
        res.status(409).json({
          error: 'Email already exists',
        });
        return;
      }

      const user = await userService.createUser({ email, name, age });

      res.status(201).json({
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /users/:id - Obtener un usuario por ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        data: user,
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /users - Obtener todos los usuarios
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        data: users,
        count: users.length,
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * PUT /users/:id - Actualizar un usuario
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, name, age } = req.body;

      // Si se va a actualizar el email, verificar que no exista
      if (email) {
        const existingUsers = await userService.getUsersByEmail(email);
        const otherUserWithEmail = existingUsers.find(u => u.id !== id);
        
        if (otherUserWithEmail) {
          res.status(409).json({
            error: 'Email already exists',
          });
          return;
        }
      }

      const updatedUser = await userService.updateUser(id, { email, name, age });

      if (!updatedUser) {
        res.status(404).json({
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /users/:id - Eliminar un usuario
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

