const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { waitUntilTableExists } = require('@aws-sdk/client-dynamodb');

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

async function createUsersTable() {
  const tableParams = {
    TableName: 'Users',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' } // Clave primaria
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    console.log('Creando tabla Users...');
    await dynamodb.send(new CreateTableCommand(tableParams));
    console.log('✅ Tabla Users creada exitosamente');
    
    // Esperar a que la tabla esté activa
    console.log('Esperando a que la tabla esté activa...');
    await waitUntilTableExists(
      { client: dynamodb },
      { TableName: 'Users' }
    );
    console.log('✅ Tabla Users está activa y lista para usar');
    
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  La tabla Users ya existe');
    } else {
      console.error('❌ Error creando la tabla Users:', error);
      throw error;
    }
  }
}

async function insertSampleData() {
  const sampleUsers = [
    {
      id: 'user_1',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'user_2',
      name: 'María García',
      email: 'maria.garcia@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    console.log('Insertando datos de ejemplo...');
    
    for (const user of sampleUsers) {
      await documentClient.send(new PutCommand({
        TableName: 'Users',
        Item: user
      }));
      console.log(`✅ Usuario insertado: ${user.name} (${user.email})`);
    }
    
    console.log('✅ Datos de ejemplo insertados correctamente');
    
  } catch (error) {
    console.error('❌ Error insertando datos de ejemplo:', error);
  }
}

async function main() {
  try {
    await createUsersTable();
    await insertSampleData();
    console.log('\n🎉 Configuración completada exitosamente!');
    console.log('📊 Puedes acceder a DynamoDB Admin en: http://localhost:8001');
    console.log('🔗 Endpoint de DynamoDB Local: http://localhost:8000');
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
    process.exit(1);
  }
}

main();
