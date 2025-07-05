// Configurar variables de entorno para desarrollo local
process.env.DYNAMODB_LOCAL = 'true';
process.env.NODE_ENV = 'development';

// Verificar si el proyecto está compilado
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.log('📦 Compilando proyecto...');
  const { execSync } = require('child_process');
  execSync('npm run build:dev', { stdio: 'inherit' });
}

// Importar usando require para compatibilidad con scripts
const { DynamoUserRepository } = require('../dist/adapters/repository/DynamoUserRepository');
const { User } = require('../dist/domain/model/User');

async function exampleUsage() {
  try {
    console.log('🚀 Ejemplo de uso del DynamoUserRepository con DynamoDB Local\n');
    
    // Crear instancia del repositorio
    const userRepository = new DynamoUserRepository();
    
    // 1. Crear un nuevo usuario
    console.log('1️⃣ Creando un nuevo usuario...');
    const newUser = new User('Ana López', 'ana.lopez@example.com');
    const userId = await userRepository.save(newUser);
    console.log(`✅ Usuario creado con ID: ${userId}`);
    
    // 2. Buscar usuario por ID
    console.log('\n2️⃣ Buscando usuario por ID...');
    const foundUser = await userRepository.findById(userId);
    if (foundUser) {
      console.log(`✅ Usuario encontrado: ${foundUser.name} (${foundUser.email})`);
    } else {
      console.log('❌ Usuario no encontrado');
    }
    
    // 3. Buscar usuario por email
    console.log('\n3️⃣ Buscando usuario por email...');
    const userByEmail = await userRepository.findByEmail('ana.lopez@example.com');
    if (userByEmail) {
      console.log(`✅ Usuario encontrado por email: ${userByEmail.name}`);
    } else {
      console.log('❌ Usuario no encontrado por email');
    }
    
    // 4. Actualizar usuario
    console.log('\n4️⃣ Actualizando usuario...');
    const updatedUser = new User('Ana López Actualizada', 'ana.lopez.nueva@example.com');
    await userRepository.update(userId, updatedUser);
    console.log('✅ Usuario actualizado');
    
    // 5. Verificar la actualización
    console.log('\n5️⃣ Verificando actualización...');
    const updatedFoundUser = await userRepository.findById(userId);
    if (updatedFoundUser) {
      console.log(`✅ Usuario actualizado: ${updatedFoundUser.name} (${updatedFoundUser.email})`);
    }
    
    // 6. Crear otro usuario para demostrar listado
    console.log('\n6️⃣ Creando otro usuario...');
    const secondUser = new User('Carlos Ruiz', 'carlos.ruiz@example.com');
    const secondUserId = await userRepository.save(secondUser);
    console.log(`✅ Segundo usuario creado con ID: ${secondUserId}`);
    
    console.log('\n🎉 ¡Ejemplo completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • Usuarios creados: 2`);
    console.log(`   • Operaciones realizadas: Crear, Buscar por ID, Buscar por Email, Actualizar`);
    console.log(`   • Tabla utilizada: Users`);
    console.log(`   • Endpoint: http://localhost:8000`);
    
  } catch (error) {
    console.error('❌ Error en el ejemplo:', error.message);
    
    if (error.code === 'ResourceNotFoundException') {
      console.log('\n💡 Solución: Asegúrate de que la tabla Users esté creada:');
      console.log('   node scripts/create-tables.js');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solución: Asegúrate de que DynamoDB Local esté ejecutándose:');
      console.log('   docker-compose up -d');
    }
  }
}

exampleUsage(); 
