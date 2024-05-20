import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../../controllers/userController';
import User from '../../models/userModel';

// Mock the User model methods
jest.mock('../../models/userModel');

const app = express();
app.use(bodyParser.json());
app.get('/users', getAllUsers);
app.get('/users/:userId', getUserById);
app.post('/users', createUser);
app.patch('/users/:userId', updateUser);
app.delete('/users/:userId', deleteUser);

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users should return all users', async () => {
    const mockUsers = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
    User.getAllUsers.mockResolvedValue(mockUsers);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  test('GET /users/:userId should return a user by id', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    User.getUserById.mockResolvedValue(mockUser);

    const response = await request(app).get('/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  test('POST /users should create a new user', async () => {
    const mockUser = { name: 'Jane Doe', email: 'jane@example.com', password: 'password123' };
    User.createUser.mockResolvedValue(1); // Mock userId

    const response = await request(app).post('/users').send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User created successfully', userId: 1 });
  });

  test('PATCH /users/:userId should update a user', async () => {
    const mockUser = { name: 'Jane Doe', email: 'jane_updated@example.com', password: 'password123' };
    User.updateUser.mockResolvedValue(1); // Mock rowsAffected

    const response = await request(app).patch('/users/1').send(mockUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User updated successfully', rowsAffected: 1 });
  });

  test('DELETE /users/:userId should delete a user', async () => {
    User.deleteUser.mockResolvedValue(1); // Mock rowsAffected

    const response = await request(app).delete('/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted successfully', rowsAffected: 1 });
  });
});
