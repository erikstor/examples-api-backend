import { UserService } from '../src/services/UserService';
import * as dotenv from 'dotenv';

dotenv.config();

const userService = new UserService();

async function testCRUD() {
  console.log('='.repeat(60));
  console.log('🧪 Testing CRUD Operations');
  console.log('='.repeat(60));

  try {
    // CREATE - Crear usuarios
    console.log('\n📝 CREATE - Creating users...');
    const user1 = await userService.createUser({
      email: 'john.doe@example.com',
      name: 'John Doe',
      age: 30,
    });
    console.log('✅ User 1 created:', user1);

    const user2 = await userService.createUser({
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      age: 25,
    });
    console.log('✅ User 2 created:', user2);

    const user3 = await userService.createUser({
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson',
    });
    console.log('✅ User 3 created:', user3);

    // READ - Obtener usuario por ID
    console.log('\n📖 READ - Getting user by ID...');
    const foundUser = await userService.getUserById(user1.id);
    console.log('✅ User found:', foundUser);

    // READ - Obtener todos los usuarios
    console.log('\n📖 READ - Getting all users...');
    const allUsers = await userService.getAllUsers();
    console.log(`✅ Found ${allUsers.length} users:`);
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    // READ - Buscar por email
    console.log('\n🔍 SEARCH - Finding user by email...');
    const usersByEmail = await userService.getUsersByEmail('jane.smith@example.com');
    console.log('✅ Users found by email:', usersByEmail);

    // UPDATE - Actualizar usuario
    console.log('\n✏️  UPDATE - Updating user...');
    const updatedUser = await userService.updateUser(user1.id, {
      name: 'John Updated Doe',
      age: 31,
    });
    console.log('✅ User updated:', updatedUser);

    // READ - Verificar actualización
    console.log('\n📖 READ - Verifying update...');
    const verifyUser = await userService.getUserById(user1.id);
    console.log('✅ Updated user verified:', verifyUser);

    // DELETE - Eliminar usuario
    console.log('\n🗑️  DELETE - Deleting user...');
    const deleted = await userService.deleteUser(user2.id);
    console.log(`✅ User deleted: ${deleted}`);

    // READ - Verificar eliminación
    console.log('\n📖 READ - Verifying deletion...');
    const deletedUser = await userService.getUserById(user2.id);
    console.log(`✅ User after deletion: ${deletedUser ? 'Still exists (ERROR)' : 'Not found (SUCCESS)'}`);

    // READ - Usuarios finales
    console.log('\n📖 READ - Final list of users...');
    const finalUsers = await userService.getAllUsers();
    console.log(`✅ Final count: ${finalUsers.length} users:`);
    finalUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Age: ${user.age || 'N/A'}`);
    });

    console.log('\n='.repeat(60));
    console.log('✅ All CRUD operations completed successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Error during CRUD operations:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Ejecutar las pruebas
testCRUD();

