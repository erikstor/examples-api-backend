import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';
import { UserService } from '../services/userService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Token de acceso requerido' });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    const user = await UserService.findById(decoded.userId);
    
    if (!user || !user.is_active) {
      res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}; 