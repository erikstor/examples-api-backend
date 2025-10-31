"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("@/shared/entities");
const AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [entities_1.User],
    synchronize: true,
});
async function seedDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Base de datos conectada');
        const userRepository = AppDataSource.getRepository(entities_1.User);
        const existingUsers = await userRepository.count();
        if (existingUsers > 0) {
            console.log('📊 La base de datos ya tiene usuarios');
            return;
        }
        const users = [
            {
                name: 'Juan Pérez',
                email: 'juan@example.com',
                age: 30,
            },
            {
                name: 'María García',
                email: 'maria@example.com',
                age: 25,
            },
            {
                name: 'Carlos López',
                email: 'carlos@example.com',
                age: 35,
            },
        ];
        for (const userData of users) {
            const user = userRepository.create(userData);
            await userRepository.save(user);
            console.log(`✅ Usuario creado: ${user.name}`);
        }
        console.log('🎉 Base de datos poblada exitosamente');
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await AppDataSource.destroy();
    }
}
seedDatabase();
//# sourceMappingURL=seed-database.js.map