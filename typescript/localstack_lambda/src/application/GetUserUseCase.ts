/**
 * APPLICATION LAYER - Casos de uso
 * Contiene la lógica de negocio de la aplicación
 */

import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User | null> {
    // Validación
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required');
    }

    // Obtener usuario del repositorio
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return null;
    }

    return user;
  }
}

