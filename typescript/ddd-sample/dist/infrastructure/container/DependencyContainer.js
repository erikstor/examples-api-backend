"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyContainer = void 0;
const UserUseCases_1 = require("../../application/useCases/UserUseCases");
const InMemoryUserRepository_1 = require("../repositories/InMemoryUserRepository");
const DatabaseUserRepository_1 = require("../repositories/DatabaseUserRepository");
const UserController_1 = require("../controllers/UserController");
const UserRoutes_1 = require("../routes/UserRoutes");
// Infrastructure Layer - Contenedor de inyección de dependencias
class DependencyContainer {
    constructor(useDatabase = false) {
        this.initializeDependencies(useDatabase);
    }
    initializeDependencies(useDatabase) {
        // 1. Configurar repositorio (Secondary Adapter)
        if (useDatabase) {
            this.userRepository = new DatabaseUserRepository_1.DatabaseUserRepository();
        }
        else {
            this.userRepository = new InMemoryUserRepository_1.InMemoryUserRepository();
            // Inicializar con datos de muestra
            this.userRepository.initializeWithSampleData();
        }
        // 2. Configurar casos de uso (Application Layer)
        this.getUserUseCase = new UserUseCases_1.GetUserUseCaseImpl(this.userRepository);
        this.createUserUseCase = new UserUseCases_1.CreateUserUseCaseImpl(this.userRepository);
        this.listUsersUseCase = new UserUseCases_1.ListUsersUseCaseImpl(this.userRepository);
        // 3. Configurar controlador (Primary Adapter)
        this.userController = new UserController_1.UserController(this.getUserUseCase, this.createUserUseCase, this.listUsersUseCase);
        // 4. Configurar rutas (Primary Adapter)
        this.userRoutes = new UserRoutes_1.UserRoutes(this.userController);
    }
    // Getters para acceder a las dependencias
    getUserRepository() {
        return this.userRepository;
    }
    getGetUserUseCase() {
        return this.getUserUseCase;
    }
    getCreateUserUseCase() {
        return this.createUserUseCase;
    }
    getListUsersUseCase() {
        return this.listUsersUseCase;
    }
    getUserController() {
        return this.userController;
    }
    getUserRoutes() {
        return this.userRoutes;
    }
    getApp() {
        return this.userRoutes.getApp();
    }
}
exports.DependencyContainer = DependencyContainer;
//# sourceMappingURL=DependencyContainer.js.map