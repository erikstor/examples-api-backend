import { User } from '../model/User';

export interface IUserRepository {
  save(user: User): Promise<string>; // Retorna el ID del usuario creado
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, user: User): Promise<void>;
  delete(id: string): Promise<void>;
} 
