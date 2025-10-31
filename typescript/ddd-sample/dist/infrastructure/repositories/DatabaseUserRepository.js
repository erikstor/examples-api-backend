"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUserRepository = void 0;
const User_1 = require("../../domain/entities/User");
// Infrastructure Layer - Adaptador de repositorio simulado con base de datos (Secondary Adapter)
class DatabaseUserRepository {
    constructor() {
        // Simulación de datos en base de datos
        this.users = new Map();
        this.initializeWithSampleData();
    }
    async findById(id) {
        // Simular latencia de base de datos
        await this.simulateDatabaseDelay();
        const userData = this.users.get(id);
        if (!userData) {
            return null;
        }
        // Reconstruir la entidad desde los datos persistidos
        return User_1.User.fromPersistence(userData.id, userData.email, userData.name, userData.createdAt);
    }
    async findByEmail(email) {
        await this.simulateDatabaseDelay();
        for (const userData of this.users.values()) {
            if (userData.email === email) {
                return User_1.User.fromPersistence(userData.id, userData.email, userData.name, userData.createdAt);
            }
        }
        return null;
    }
    async save(user) {
        await this.simulateDatabaseDelay();
        this.users.set(user.id, user);
    }
    async delete(id) {
        await this.simulateDatabaseDelay();
        this.users.delete(id);
    }
    async findAll() {
        await this.simulateDatabaseDelay();
        return Array.from(this.users.values()).map(userData => User_1.User.fromPersistence(userData.id, userData.email, userData.name, userData.createdAt));
    }
    async simulateDatabaseDelay() {
        // Simular latencia de base de datos
        return new Promise(resolve => setTimeout(resolve, 50));
    }
    initializeWithSampleData() {
        const sampleUsers = [
            User_1.User.create('1', 'juan@example.com', 'Juan Pérez'),
            User_1.User.create('2', 'maria@example.com', 'María García'),
            User_1.User.create('3', 'carlos@example.com', 'Carlos López'),
            User_1.User.create('4', 'ana@example.com', 'Ana Martínez'),
            User_1.User.create('5', 'pedro@example.com', 'Pedro Rodríguez')
        ];
        sampleUsers.forEach(user => {
            this.users.set(user.id, user);
        });
    }
}
exports.DatabaseUserRepository = DatabaseUserRepository;
//# sourceMappingURL=DatabaseUserRepository.js.map