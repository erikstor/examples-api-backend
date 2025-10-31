/**
 * Script para ejecutar la Lambda localmente (útil para debugging)
 */

import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './presentation/handler';
import * as dotenv from 'dotenv';

dotenv.config();

// Mock de Context
const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'user-handler-local',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:000000000000:function:user-handler-local',
  memoryLimitInMB: '128',
  awsRequestId: 'local-request-id',
  logGroupName: '/aws/lambda/user-handler-local',
  logStreamName: 'local-stream',
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

async function testGetUser() {
  console.log('\n=== Test: GET /user/{id} ===');
  
  const event: APIGatewayProxyEvent = {
    httpMethod: 'GET',
    path: '/user/123e4567-e89b-12d3-a456-426614174000',
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
    body: null,
    isBase64Encoded: false,
  };

  const result = await handler(event, mockContext);
  console.log('Response:', JSON.stringify(JSON.parse(result.body), null, 2));
}

async function testCreateUser() {
  console.log('\n=== Test: POST /user (Create) ===');
  
  const event: APIGatewayProxyEvent = {
    httpMethod: 'POST',
    path: '/user',
    headers: { 'Content-Type': 'application/json' },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
    body: JSON.stringify({
      email: 'test@example.com',
      name: 'Test User',
      age: 30,
    }),
    isBase64Encoded: false,
  };

  const result = await handler(event, mockContext);
  console.log('Response:', JSON.stringify(JSON.parse(result.body), null, 2));
  return JSON.parse(result.body);
}

async function testGetOrCreateUser() {
  console.log('\n=== Test: POST /user (Get or Create) ===');
  
  const event: APIGatewayProxyEvent = {
    httpMethod: 'POST',
    path: '/user',
    headers: { 'Content-Type': 'application/json' },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
    body: JSON.stringify({
      email: 'existing@example.com',
      name: 'Existing User',
      age: 25,
    }),
    isBase64Encoded: false,
  };

  // Primera llamada - debería crear
  console.log('\nFirst call (should create):');
  let result = await handler(event, mockContext);
  console.log('Response:', JSON.stringify(JSON.parse(result.body), null, 2));

  // Segunda llamada - debería obtener el existente
  console.log('\nSecond call (should get existing):');
  result = await handler(event, mockContext);
  console.log('Response:', JSON.stringify(JSON.parse(result.body), null, 2));
}

async function testApiInfo() {
  console.log('\n=== Test: GET / (API Info) ===');
  
  const event: APIGatewayProxyEvent = {
    httpMethod: 'GET',
    path: '/',
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
    body: null,
    isBase64Encoded: false,
  };

  const result = await handler(event, mockContext);
  console.log('Response:', JSON.stringify(JSON.parse(result.body), null, 2));
}

// Ejecutar tests
async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 Testing Lambda Handler Locally');
  console.log('='.repeat(60));
  console.log(`Endpoint: ${process.env.AWS_ENDPOINT}`);
  console.log(`Table: ${process.env.DYNAMODB_TABLE_NAME}`);
  console.log('='.repeat(60));

  try {
    await testApiInfo();
    await testCreateUser();
    await testGetOrCreateUser();
    await testGetUser();
    
    console.log('\n='.repeat(60));
    console.log('✅ All tests completed successfully');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();

