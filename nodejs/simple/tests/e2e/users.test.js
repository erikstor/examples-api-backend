const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Users Endpoints', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

    // Create test user and get auth token
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
    testUser = registerResponse.body.user;
  });

  describe('GET /api/users', () => {
    it('should get all users with pagination', async () => {
      // Create additional users
      const user2 = new User({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123'
      });
      await user2.save();

      const user3 = new User({
        name: 'User 3',
        email: 'user3@example.com',
        password: 'password123'
      });
      await user3.save();

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.users).toHaveLength(3);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(3);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.error).toBe('Token de acceso requerido');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(testUser._id);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const newUserData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        age: 30
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUserData)
        .expect(201);

      expect(response.body.message).toBe('Usuario creado exitosamente');
      expect(response.body.user.name).toBe(newUserData.name);
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should fail to create user with existing email', async () => {
      const newUserData = {
        name: 'New User',
        email: 'test@example.com', // Same email as test user
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUserData)
        .expect(400);

      expect(response.body.error).toBe('El email ya está registrado');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 35
      };

      const response = await request(app)
        .put(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Usuario actualizado exitosamente');
      expect(response.body.user.name).toBe(updateData.name);
      expect(response.body.user.age).toBe(updateData.age);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should soft delete user', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Usuario eliminado exitosamente');
      expect(response.body.user.isActive).toBe(false);

      // Verify user is not returned in GET all users
      const getResponse = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.users).toHaveLength(0);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });
}); 