/**
 * APPLICATION LAYER - Casos de uso
 * Contiene la lógica de negocio de la aplicación
 */

import { User, CreateUserInput, UserEntity } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    // Validaciones de negocio
    if (!input.email || !input.email.includes('@')) {
      throw new Error('Valid email is required');
    }

    if (!input.name || input.name.trim() === '') {
      throw new Error('Name is required');
    }

    if (input.age !== undefined && (input.age < 0 || input.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    // Verificar si el email ya existe
    const emailExists = await this.userRepository.exists(input.email);
    if (emailExists) {
      throw new Error(`User with email ${input.email} already exists`);
    }

    // Crear entidad de usuario
    const userId = uuidv4();
    const userEntity = UserEntity.create(input, userId);

    // Guardar en el repositorio
    const savedUser = await this.userRepository.save(userEntity.toJSON());

    return savedUser;
  }
}

