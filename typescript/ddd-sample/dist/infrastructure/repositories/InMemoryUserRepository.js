"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
const User_1 = require("../../domain/entities/User");
// Infrastructure Layer - Adaptador de repositorio en memoria (Secondary Adapter)
class InMemoryUserRepository {
    constructor() {
        this.users = new Map();
    }
    async findById(id) {
        return this.users.get(id) || null;
    }
    async findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }
    async save(user) {
        this.users.set(user.id, user);
    }
    async delete(id) {
        this.users.delete(id);
    }
    async findAll() {
        return Array.from(this.users.values());
    }
    // Método para inicializar con datos de prueba
    initializeWithSampleData() {
        const sampleUsers = [
            User_1.User.create('1', 'juan@example.com', 'Juan Pérez'),
            User_1.User.create('2', 'maria@example.com', 'María García'),
            User_1.User.create('3', 'carlos@example.com', 'Carlos López')
        ];
        sampleUsers.forEach(user => {
            this.users.set(user.id, user);
        });
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
//# sourceMappingURL=InMemoryUserRepository.js.map