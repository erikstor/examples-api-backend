import { UserRepository } from '../../domain/ports/UserRepository';
import { GetUserUseCase, CreateUserUseCase, ListUsersUseCase } from '../../domain/ports/UserUseCases';
import { GetUserUseCaseImpl, CreateUserUseCaseImpl, ListUsersUseCaseImpl } from '../../application/useCases/UserUseCases';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { DatabaseUserRepository } from '../repositories/DatabaseUserRepository';
import { UserController } from '../controllers/UserController';
import { UserRoutes } from '../routes/UserRoutes';

// Infrastructure Layer - Contenedor de inyección de dependencias
export class DependencyContainer {
  private userRepository!: UserRepository;
  private getUserUseCase!: GetUserUseCase;
  private createUserUseCase!: CreateUserUseCase;
  private listUsersUseCase!: ListUsersUseCase;
  private userController!: UserController;
  private userRoutes!: UserRoutes;

  constructor(useDatabase: boolean = false) {
    this.initializeDependencies(useDatabase);
  }

  private initializeDependencies(useDatabase: boolean): void {
    // 1. Configurar repositorio (Secondary Adapter)
    if (useDatabase) {
      this.userRepository = new DatabaseUserRepository();
    } else {
      this.userRepository = new InMemoryUserRepository();
      // Inicializar con datos de muestra
      (this.userRepository as InMemoryUserRepository).initializeWithSampleData();
    }

    // 2. Configurar casos de uso (Application Layer)
    this.getUserUseCase = new GetUserUseCaseImpl(this.userRepository);
    this.createUserUseCase = new CreateUserUseCaseImpl(this.userRepository);
    this.listUsersUseCase = new ListUsersUseCaseImpl(this.userRepository);

    // 3. Configurar controlador (Primary Adapter)
    this.userController = new UserController(
      this.getUserUseCase,
      this.createUserUseCase,
      this.listUsersUseCase
    );

    // 4. Configurar rutas (Primary Adapter)
    this.userRoutes = new UserRoutes(this.userController);
  }

  // Getters para acceder a las dependencias
  public getUserRepository(): UserRepository {
    return this.userRepository;
  }

  public getGetUserUseCase(): GetUserUseCase {
    return this.getUserUseCase;
  }

  public getCreateUserUseCase(): CreateUserUseCase {
    return this.createUserUseCase;
  }

  public getListUsersUseCase(): ListUsersUseCase {
    return this.listUsersUseCase;
  }

  public getUserController(): UserController {
    return this.userController;
  }

  public getUserRoutes(): UserRoutes {
    return this.userRoutes;
  }

  public getApp() {
    return this.userRoutes.getApp();
  }
}
