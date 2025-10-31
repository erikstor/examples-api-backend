import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import { dynamoDbClient, TABLE_NAME } from '../src/config/dynamodb';
import * as dotenv from 'dotenv';

dotenv.config();

async function tableExists(tableName: string): Promise<boolean> {
  try {
    const command = new DescribeTableCommand({ TableName: tableName });
    await dynamoDbClient.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

async function deleteTable(tableName: string): Promise<void> {
  try {
    console.log(`🗑️  Deleting existing table: ${tableName}...`);
    const command = new DeleteTableCommand({ TableName: tableName });
    await dynamoDbClient.send(command);
    
    // Esperar a que la tabla se elimine
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`✅ Table ${tableName} deleted successfully`);
  } catch (error) {
    console.error(`❌ Error deleting table:`, error);
    throw error;
  }
}

async function createUsersTable(): Promise<void> {
  try {
    console.log(`📝 Creating table: ${TABLE_NAME}...`);

    const command = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST', // On-demand pricing
      // Para LocalStack, también puedes usar:
      // ProvisionedThroughput: {
      //   ReadCapacityUnits: 5,
      //   WriteCapacityUnits: 5,
      // },
    });

    const response = await dynamoDbClient.send(command);
    console.log(`✅ Table ${TABLE_NAME} created successfully`);
    console.log(`   Table ARN: ${response.TableDescription?.TableArn}`);
    console.log(`   Table Status: ${response.TableDescription?.TableStatus}`);
  } catch (error) {
    console.error(`❌ Error creating table:`, error);
    throw error;
  }
}

async function listTables(): Promise<void> {
  try {
    const command = new ListTablesCommand({});
    const response = await dynamoDbClient.send(command);
    
    console.log('\n📋 Existing tables:');
    if (response.TableNames && response.TableNames.length > 0) {
      response.TableNames.forEach(table => console.log(`   - ${table}`));
    } else {
      console.log('   (no tables found)');
    }
  } catch (error) {
    console.error('❌ Error listing tables:', error);
  }
}

async function initDatabase(): Promise<void> {
  console.log('='.repeat(60));
  console.log('🚀 Initializing DynamoDB with LocalStack');
  console.log('='.repeat(60));
  console.log(`📍 Endpoint: ${process.env.AWS_ENDPOINT}`);
  console.log(`📍 Region: ${process.env.AWS_REGION}`);
  console.log(`📍 Table Name: ${TABLE_NAME}`);
  console.log('='.repeat(60));

  try {
    // Verificar si la tabla ya existe
    const exists = await tableExists(TABLE_NAME);
    
    if (exists) {
      console.log(`⚠️  Table ${TABLE_NAME} already exists`);
      const shouldRecreate = process.argv.includes('--force');
      
      if (shouldRecreate) {
        await deleteTable(TABLE_NAME);
        await createUsersTable();
      } else {
        console.log('   Use --force flag to recreate the table');
      }
    } else {
      await createUsersTable();
    }

    // Listar todas las tablas
    await listTables();

    console.log('\n='.repeat(60));
    console.log('✅ Database initialization completed successfully');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Ejecutar la inicialización
initDatabase();

