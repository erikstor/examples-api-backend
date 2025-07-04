import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { auth, AuthenticatedRequest } from '../middleware/auth';
import { validate, userCreateSchema, userUpdateSchema } from '../middleware/validation';
import { UserCreate, UserUpdate, PaginationParams } from '../types';

const router = Router();

// GET /api/users - Get all users (with pagination)
router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const params: PaginationParams = { page, limit };
    const result = await UserService.findAll(params);
    
    res.json(result);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de usuario inválido' });
      return;
    }
    
    const user = await UserService.findById(id);
    
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /api/users - Create new user
router.post('/', auth, validate(userCreateSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: UserCreate = req.body;
    const { name, email, password, age } = userData;

    // Check if email already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    const user = await UserService.create(userData);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', auth, validate(userUpdateSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de usuario inválido' });
      return;
    }
    
    const userData: UserUpdate = req.body;
    const { name, email, age, is_active } = userData;

    const user = await UserService.update(id, userData);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    if (error instanceof Error && error.message.includes('email ya está registrado')) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /api/users/:id - Soft delete user
router.delete('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de usuario inválido' });
      return;
    }
    
    const user = await UserService.delete(id);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({
      message: 'Usuario eliminado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router; 