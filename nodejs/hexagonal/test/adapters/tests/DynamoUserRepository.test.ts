

/// <reference types="jest" />
import { DynamoUserRepository } from '../../../src/adapters/repository/DynamoUserRepository';
import { User } from '../../../src/domain/model/User';

// Mock de AWS SDK
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
      query: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({ Items: [] }) }),
      get: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({ Item: null }) }),
      update: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
      delete: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) })
    }))
  }
}));

describe('DynamoUserRepository', () => {
  let repository: DynamoUserRepository;
  const mockTableName = 'test-users-table';

  beforeEach(() => {
    repository = new DynamoUserRepository(mockTableName);
  });

  it('should save a user successfully', async () => {
    const user = new User('Juan Pérez', 'juan@example.com');
    const userId = await repository.save(user);
    
    expect(userId).toBeDefined();
    expect(typeof userId).toBe('string');
    expect(userId.startsWith('user_')).toBe(true);
  });

  it('should find user by email when exists', async () => {
    const mockUser = { name: 'Juan Pérez', email: 'juan@example.com' };
    const mockDynamoClient = require('aws-sdk').DynamoDB.DocumentClient;
    const mockQuery = mockDynamoClient.mock.results[0].value.query;
    
    mockQuery.mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [mockUser]
      })
    });

    const result = await repository.findByEmail('juan@example.com');
    
    expect(result).toBeInstanceOf(User);
    expect(result?.name).toBe('Juan Pérez');
    expect(result?.email).toBe('juan@example.com');
  });

  it('should return null when user not found by email', async () => {
    const result = await repository.findByEmail('nonexistent@example.com');
    expect(result).toBeNull();
  });

  it('should find user by id when exists', async () => {
    const mockUser = { name: 'Juan Pérez', email: 'juan@example.com' };
    const mockDynamoClient = require('aws-sdk').DynamoDB.DocumentClient;
    const mockGet = mockDynamoClient.mock.results[0].value.get;
    
    mockGet.mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Item: mockUser
      })
    });

    const result = await repository.findById('user_123');
    
    expect(result).toBeInstanceOf(User);
    expect(result?.name).toBe('Juan Pérez');
    expect(result?.email).toBe('juan@example.com');
  });

  it('should return null when user not found by id', async () => {
    const result = await repository.findById('nonexistent-id');
    expect(result).toBeNull();
  });
}); 
