const mongoose = require('mongoose');
const User = require('../../src/models/User');

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create & save user successfully', async () => {
    const validUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 25
    });
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).not.toBe('password123'); // Should be hashed
    expect(savedUser.age).toBe(validUser.age);
    expect(savedUser.isActive).toBe(true);
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ name: 'Test User' });
    let err;
    
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    });
    
    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it('should fail to save user with short password', async () => {
    const userWithShortPassword = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '123'
    });
    
    let err;
    try {
      await userWithShortPassword.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });

  it('should fail to save user with invalid age', async () => {
    const userWithInvalidAge = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 15 // Under 18
    });
    
    let err;
    try {
      await userWithInvalidAge.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.age).toBeDefined();
  });

  it('should compare password correctly', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();
    
    const isMatch = await user.comparePassword('password123');
    const isNotMatch = await user.comparePassword('wrongpassword');
    
    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should return public JSON without password', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 25
    });
    await user.save();
    
    const publicUser = user.toPublicJSON();
    
    expect(publicUser.password).toBeUndefined();
    expect(publicUser.name).toBe(user.name);
    expect(publicUser.email).toBe(user.email);
    expect(publicUser.age).toBe(user.age);
  });
}); 