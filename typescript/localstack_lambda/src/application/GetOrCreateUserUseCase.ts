/**
 * APPLICATION LAYER - Casos de uso
 * Caso de uso que obtiene un usuario existente o crea uno nuevo si no existe
 */

import { User, CreateUserInput } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { GetUserUseCase } from './GetUserUseCase';

export class GetOrCreateUserUseCase {
  private createUserUseCase: CreateUserUseCase;
  private getUserUseCase: GetUserUseCase;

  constructor(private userRepository: IUserRepository) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.getUserUseCase = new GetUserUseCase(userRepository);
  }

  /**
   * Intenta obtener un usuario por email, si no existe lo crea
   */
  async executeByEmail(input: CreateUserInput): Promise<{ user: User; created: boolean }> {
    // Validar email
    if (!input.email || !input.email.includes('@')) {
      throw new Error('Valid email is required');
    }

    // Buscar usuario por email
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      return {
        user: existingUser,
        created: false,
      };
    }

    // Si no existe, crear nuevo usuario
    const newUser = await this.createUserUseCase.execute(input);

    return {
      user: newUser,
      created: true,
    };
  }

  /**
   * Intenta obtener un usuario por ID, si no existe retorna null
   */
  async executeById(userId: string): Promise<User | null> {
    return await this.getUserUseCase.execute(userId);
  }
}

