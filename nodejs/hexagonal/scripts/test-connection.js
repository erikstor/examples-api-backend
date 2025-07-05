const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Configurar AWS SDK v3 para DynamoDB Local
const client = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local'
  }
});

const dynamodb = client;
const documentClient = DynamoDBDocumentClient.from(client);

async function testConnection() {
  try {
    console.log('🔍 Probando conexión con DynamoDB Local...');
    
    // Listar tablas
    const tables = await dynamodb.send(new ListTablesCommand());
    console.log('✅ Conexión exitosa!');
    console.log('📋 Tablas disponibles:', tables.TableNames);
    
    // Verificar si existe la tabla Users
    if (tables.TableNames.includes('Users')) {
      console.log('✅ Tabla Users encontrada');
      
      // Contar elementos en la tabla
      const countResult = await documentClient.send(new ScanCommand({
        TableName: 'Users',
        Select: 'COUNT'
      }));
      
      console.log(`📊 Número de usuarios en la tabla: ${countResult.Count}`);
      
      // Mostrar algunos usuarios de ejemplo
      const usersResult = await documentClient.send(new ScanCommand({
        TableName: 'Users',
        Limit: 5
      }));
      
      if (usersResult.Items && usersResult.Items.length > 0) {
        console.log('👥 Usuarios de ejemplo:');
        usersResult.Items.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.name} (${user.email})`);
        });
      }
      
    } else {
      console.log('⚠️  Tabla Users no encontrada. Ejecuta primero: node scripts/create-tables.js');
    }
    
  } catch (error) {
    console.error('❌ Error conectando con DynamoDB:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solución:');
      console.log('1. Asegúrate de que DynamoDB Local esté ejecutándose:');
      console.log('   docker-compose up -d');
      console.log('2. Espera unos segundos y vuelve a intentar');
    }
  }
}

testConnection(); 
