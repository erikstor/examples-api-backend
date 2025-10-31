import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';

// Infrastructure Layer - Adaptador de repositorio en memoria (Secondary Adapter)
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Método para inicializar con datos de prueba
  initializeWithSampleData(): void {
    const sampleUsers = [
      User.create('1', 'juan@example.com', 'Juan Pérez'),
      User.create('2', 'maria@example.com', 'María García'),
      User.create('3', 'carlos@example.com', 'Carlos López')
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }
}
