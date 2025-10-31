
/**
 * Script para probar la Lambda usando AWS SDK
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import * as dotenv from 'dotenv';

dotenv.config();

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
});

const FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME || 'user-handler';

interface LambdaResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

async function invokeLambda(payload: any): Promise<LambdaResponse> {
  const command = new InvokeCommand({
    FunctionName: FUNCTION_NAME,
    Payload: JSON.stringify(payload),
  });

  const response = await lambdaClient.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.Payload));
  
  return result;
}

async function testApiInfo() {
  console.log('\n=== Test: GET / (API Info) ===');
  
  const payload = {
    httpMethod: 'GET',
    path: '/',
    headers: {},
    body: null,
  };

  const response = await invokeLambda(payload);
  console.log('Status:', response.statusCode);
  console.log('Body:', JSON.parse(response.body));
}

async function testCreateUser() {
  console.log('\n=== Test: POST /user (Create User) ===');
  
  const payload = {
    httpMethod: 'POST',
    path: '/user',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      age: 25,
    }),
  };

  const response = await invokeLambda(payload);
  console.log('Status:', response.statusCode);
  console.log('Body:', JSON.parse(response.body));
  
  return JSON.parse(response.body);
}

async function testGetUser(userId: string) {
  console.log('\n=== Test: GET /user/{id} ===');
  
  const payload = {
    httpMethod: 'GET',
    path: `/user/${userId}`,
    headers: {},
    body: null,
  };

  const response = await invokeLambda(payload);
  console.log('Status:', response.statusCode);
  console.log('Body:', JSON.parse(response.body));
}

async function testGetOrCreateUser() {
  console.log('\n=== Test: POST /user (Get or Create) ===');
  
  const email = 'constant@example.com';
  
  const payload = {
    httpMethod: 'POST',
    path: '/user',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      name: 'Constant User',
      age: 35,
    }),
  };

  // Primera llamada - debería crear
  console.log('\nFirst call (should create):');
  let response = await invokeLambda(payload);
  console.log('Status:', response.statusCode);
  console.log('Body:', JSON.parse(response.body));

  // Segunda llamada - debería obtener el existente
  console.log('\nSecond call (should get existing):');
  response = await invokeLambda(payload);
  console.log('Status:', response.statusCode);
  console.log('Body:', JSON.parse(response.body));
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 Testing Lambda Function');
  console.log('='.repeat(60));
  console.log(`Function: ${FUNCTION_NAME}`);
  console.log(`Endpoint: ${process.env.AWS_ENDPOINT}`);
  console.log('='.repeat(60));

  try {
    await testApiInfo();
    
    const createResult = await testCreateUser();
    const userId = createResult.user?.id;
    
    if (userId) {
      await testGetUser(userId);
    }
    
    await testGetOrCreateUser();
    
    console.log('\n='.repeat(60));
    console.log('✅ All tests completed successfully');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();

