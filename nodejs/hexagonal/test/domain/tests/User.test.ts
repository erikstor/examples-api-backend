import { validate } from 'class-validator';
import { User } from '../../../src/domain/model/User';

describe('User Model', () => {
  it('should create a valid user', () => {
    const user = new User('Juan Pérez', 'juan@example.com');
    expect(user.name).toBe('Juan Pérez');
    expect(user.email).toBe('juan@example.com');
  });

  it('should validate a correct user', async () => {
    const user = new User('Juan Pérez', 'juan@example.com');
    const errors = await validate(user);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty name', async () => {
    const user = new User('', 'juan@example.com');
    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('should fail validation with invalid email', async () => {
    const user = new User('Juan Pérez', 'invalid-email');
    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail validation with name too short', async () => {
    const user = new User('J', 'juan@example.com');
    const errors = await validate(user);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });
}); 
