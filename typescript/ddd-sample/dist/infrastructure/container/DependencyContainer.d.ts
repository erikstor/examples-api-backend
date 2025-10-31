import { UserRepository } from '../../domain/ports/UserRepository';
import { GetUserUseCase, CreateUserUseCase, ListUsersUseCase } from '../../domain/ports/UserUseCases';
import { UserController } from '../controllers/UserController';
import { UserRoutes } from '../routes/UserRoutes';
export declare class DependencyContainer {
    private userRepository;
    private getUserUseCase;
    private createUserUseCase;
    private listUsersUseCase;
    private userController;
    private userRoutes;
    constructor(useDatabase?: boolean);
    private initializeDependencies;
    getUserRepository(): UserRepository;
    getGetUserUseCase(): GetUserUseCase;
    getCreateUserUseCase(): CreateUserUseCase;
    getListUsersUseCase(): ListUsersUseCase;
    getUserController(): UserController;
    getUserRoutes(): UserRoutes;
    getApp(): import("express").Application;
}
//# sourceMappingURL=DependencyContainer.d.ts.map