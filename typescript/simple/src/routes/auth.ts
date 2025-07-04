import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import { validate, loginSchema, userCreateSchema } from '../middleware/validation';
import { UserCreate, LoginRequest, AuthResponse } from '../types';

const router = Router();

// Register
router.post('/register', validate(userCreateSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: UserCreate = req.body;
    const { name, email, password, age } = userData;

    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    // Create new user
    const user = await UserService.create(userData);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const response: AuthResponse = {
      message: 'Usuario registrado exitosamente',
      user,
      token
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', validate(loginSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData: LoginRequest = req.body;
    const { email, password } = loginData;

    // Find user
    const user = await UserService.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Check password
    const isPasswordValid = await UserService.verifyPassword(user, password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    const response: AuthResponse = {
      message: 'Login exitoso',
      user: userResponse,
      token
    };

    res.json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el login' });
  }
});

export default router; 