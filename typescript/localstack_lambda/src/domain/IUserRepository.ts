/**
 * DOMAIN LAYER - Interfaces de repositorios
 * Define el contrato que debe cumplir el repositorio
 */

import { User } from './User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  exists(email: string): Promise<boolean>;
}

