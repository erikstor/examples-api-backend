import { UserService } from '../../src/services/userService';
import { pool } from '../../src/config/database';
import { UserCreate } from '../../src/types';

// Mock the database pool
jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const mockPool = pool as jest.Mocked<typeof pool>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData: UserCreate = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 25
      };

      const mockUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        age: userData.age,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({
        rows: [mockUser],
        rowCount: 1
      } as any);

      const result = await UserService.create(userData);

      expect(result).toEqual(mockUser);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [userData.name, userData.email, expect.any(String), userData.age]
      );
    });

    it('should throw error for duplicate email', async () => {
      const userData: UserCreate = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const duplicateError = new Error('duplicate key value violates unique constraint');
      mockPool.query.mockRejectedValueOnce(duplicateError);

      await expect(UserService.create(userData)).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          age: 25,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'User 2',
          email: 'user2@example.com',
          age: 30,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockPool.query
        .mockResolvedValueOnce({
          rows: [{ count: '2' }]
        } as any)
        .mockResolvedValueOnce({
          rows: mockUsers
        } as any);

      const result = await UserService.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockUsers);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        pages: 1
      });
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({
        rows: [mockUser]
      } as any);

      const result = await UserService.findById(1);

      expect(result).toEqual(mockUser);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
    });

    it('should return null for non-existent user', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: []
      } as any);

      const result = await UserService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        age: 25,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({
        rows: [mockUser]
      } as any);

      const result = await UserService.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 30
      };

      const mockUpdatedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'test@example.com',
        age: 30,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({
        rows: [mockUpdatedUser]
      } as any);

      const result = await UserService.update(1, updateData);

      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error for duplicate email on update', async () => {
      const updateData = {
        email: 'existing@example.com'
      };

      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 2 }]
      } as any);

      await expect(UserService.update(1, updateData)).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('delete', () => {
    it('should soft delete user', async () => {
      const mockDeletedUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({
        rows: [mockDeletedUser]
      } as any);

      const result = await UserService.delete(1);

      expect(result).toEqual(mockDeletedUser);
      expect(result?.is_active).toBe(false);
    });
  });
}); 