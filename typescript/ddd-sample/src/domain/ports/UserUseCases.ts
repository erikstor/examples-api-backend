import { User } from '../entities/User';

// Port - Interfaz para el caso de uso de obtener usuario (Primary Port)
export interface GetUserUseCase {
  execute(userId: string): Promise<User>;
}

// Port - Interfaz para el caso de uso de crear usuario (Primary Port)
export interface CreateUserUseCase {
  execute(userData: {
    id: string;
    email: string;
    name: string;
  }): Promise<User>;
}

// Port - Interfaz para el caso de uso de listar usuarios (Primary Port)
export interface ListUsersUseCase {
  execute(): Promise<User[]>;
}
