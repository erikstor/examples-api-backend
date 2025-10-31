import { DependencyContainer } from './infrastructure/container/DependencyContainer';

// Punto de entrada de la aplicación
async function main() {
  console.log('🚀 Iniciando aplicación con DDD y Arquitectura Hexagonal...\n');

  try {
    // Configurar dependencias
    // Cambiar a true para usar DatabaseUserRepository, false para InMemoryUserRepository
    const useDatabase = process.env.USE_DATABASE === 'true';
    
    const container = new DependencyContainer(useDatabase);
    const app = container.getApp();

    // Configurar puerto
    const port = process.env.PORT || 3000;

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`✅ Servidor ejecutándose en http://localhost:${port}`);
      console.log(`📊 Repositorio: ${useDatabase ? 'DatabaseUserRepository' : 'InMemoryUserRepository'}`);
      console.log('\n📋 Endpoints disponibles:');
      console.log('  GET  /                    - Información de la API');
      console.log('  GET  /health              - Estado del servidor');
      console.log('  GET  /api/users           - Listar todos los usuarios');
      console.log('  GET  /api/users/:id       - Obtener usuario por ID');
      console.log('  POST /api/users           - Crear nuevo usuario');
      console.log('\n🔧 Ejemplos de uso:');
      console.log(`  curl http://localhost:${port}/api/users`);
      console.log(`  curl http://localhost:${port}/api/users/1`);
      console.log(`  curl -X POST http://localhost:${port}/api/users -H "Content-Type: application/json" -d '{"id":"6","email":"nuevo@example.com","name":"Nuevo Usuario"}'`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando aplicación...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Cerrando aplicación...');
  process.exit(0);
});

// Iniciar la aplicación
main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
