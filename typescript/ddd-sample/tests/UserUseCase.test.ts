import { User } from '../src/domain/entities/User';
import { GetUserUseCaseImpl } from '../src/application/useCases/UserUseCases';
import { InMemoryUserRepository } from '../src/infrastructure/repositories/InMemoryUserRepository';
import { UserNotFoundError } from '../src/domain/exceptions/UserExceptions';

describe('GetUserUseCase', () => {
  let getUserUseCase: GetUserUseCaseImpl;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userRepository.initializeWithSampleData();
    getUserUseCase = new GetUserUseCaseImpl(userRepository);
  });

  describe('execute', () => {
    it('debería retornar un usuario cuando existe', async () => {
      // Arrange
      const userId = '1';

      // Act
      const user = await getUserUseCase.execute(userId);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(userId);
      expect(user.email).toBe('juan@example.com');
      expect(user.name).toBe('Juan Pérez');
    });

    it('debería lanzar UserNotFoundError cuando el usuario no existe', async () => {
      // Arrange
      const userId = '999';

      // Act & Assert
      await expect(getUserUseCase.execute(userId)).rejects.toThrow(UserNotFoundError);
    });

    it('debería lanzar InvalidUserDataError cuando el ID está vacío', async () => {
      // Arrange
      const userId = '';

      // Act & Assert
      await expect(getUserUseCase.execute(userId)).rejects.toThrow('El ID del usuario es requerido');
    });
  });
});

describe('User Entity', () => {
  describe('create', () => {
    it('debería crear un usuario válido', () => {
      // Arrange & Act
      const user = User.create('1', 'test@example.com', 'Test User');

      // Assert
      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('debería lanzar error con datos inválidos', () => {
      // Act & Assert
      expect(() => User.create('', 'test@example.com', 'Test User')).toThrow();
      expect(() => User.create('1', '', 'Test User')).toThrow();
      expect(() => User.create('1', 'test@example.com', '')).toThrow();
      expect(() => User.create('1', 'invalid-email', 'Test User')).toThrow();
    });
  });

  describe('changeName', () => {
    it('debería cambiar el nombre del usuario', () => {
      // Arrange
      const user = User.create('1', 'test@example.com', 'Test User');

      // Act
      const updatedUser = user.changeName('New Name');

      // Assert
      expect(updatedUser.name).toBe('New Name');
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
    });

    it('debería lanzar error con nombre vacío', () => {
      // Arrange
      const user = User.create('1', 'test@example.com', 'Test User');

      // Act & Assert
      expect(() => user.changeName('')).toThrow();
      expect(() => user.changeName('   ')).toThrow();
    });
  });
});
