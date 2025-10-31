import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';
import { GetUserUseCase, CreateUserUseCase, ListUsersUseCase } from '../../domain/ports/UserUseCases';
import { UserNotFoundError, InvalidUserDataError, UserAlreadyExistsError } from '../../domain/exceptions/UserExceptions';

// Application Layer - Caso de uso para obtener un usuario
export class GetUserUseCaseImpl implements GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    if (!userId || userId.trim().length === 0) {
      throw new InvalidUserDataError('El ID del usuario es requerido');
    }

    const user = await this.userRepository.findById(userId.trim());
    
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return user;
  }
}

// Application Layer - Caso de uso para crear un usuario
export class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: {
    id: string;
    email: string;
    name: string;
  }): Promise<User> {
    // Validar datos de entrada
    if (!userData.id || !userData.email || !userData.name) {
      throw new InvalidUserDataError('ID, email y name son requeridos');
    }

    // Verificar si ya existe un usuario con ese email
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(userData.email);
    }

    // Crear la entidad usuario
    const user = User.create(userData.id, userData.email, userData.name);

    // Guardar en el repositorio
    await this.userRepository.save(user);

    return user;
  }
}

// Application Layer - Caso de uso para listar usuarios
export class ListUsersUseCaseImpl implements ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
