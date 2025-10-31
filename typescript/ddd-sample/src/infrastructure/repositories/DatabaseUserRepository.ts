import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';

// Infrastructure Layer - Adaptador de repositorio simulado con base de datos (Secondary Adapter)
export class DatabaseUserRepository implements UserRepository {
  // Simulación de datos en base de datos
  private users: Map<string, User> = new Map();

  constructor() {
    this.initializeWithSampleData();
  }

  async findById(id: string): Promise<User | null> {
    // Simular latencia de base de datos
    await this.simulateDatabaseDelay();
    
    const userData = this.users.get(id);
    if (!userData) {
      return null;
    }

    // Reconstruir la entidad desde los datos persistidos
    return User.fromPersistence(
      userData.id,
      userData.email,
      userData.name,
      userData.createdAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    await this.simulateDatabaseDelay();
    
    for (const userData of this.users.values()) {
      if (userData.email === email) {
        return User.fromPersistence(
          userData.id,
          userData.email,
          userData.name,
          userData.createdAt
        );
      }
    }
    return null;
  }

  async save(user: User): Promise<void> {
    await this.simulateDatabaseDelay();
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    await this.simulateDatabaseDelay();
    this.users.delete(id);
  }

  async findAll(): Promise<User[]> {
    await this.simulateDatabaseDelay();
    
    return Array.from(this.users.values()).map(userData => 
      User.fromPersistence(
        userData.id,
        userData.email,
        userData.name,
        userData.createdAt
      )
    );
  }

  private async simulateDatabaseDelay(): Promise<void> {
    // Simular latencia de base de datos
    return new Promise(resolve => setTimeout(resolve, 50));
  }

  private initializeWithSampleData(): void {
    const sampleUsers = [
      User.create('1', 'juan@example.com', 'Juan Pérez'),
      User.create('2', 'maria@example.com', 'María García'),
      User.create('3', 'carlos@example.com', 'Carlos López'),
      User.create('4', 'ana@example.com', 'Ana Martínez'),
      User.create('5', 'pedro@example.com', 'Pedro Rodríguez')
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }
}
