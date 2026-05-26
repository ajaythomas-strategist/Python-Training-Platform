// backend/__tests__/user.module1.test.js
/**
 * Module 1 – User & Authentication Management tests
 * ------------------------------------------------
 * - Model: password hashing & timestamps
 * - Validation: Joi schemas
 * - Service: register & login flow
 * - Route: end‑to‑end API (SuperTest)
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import bcrypt from 'bcryptjs';

// Import the pieces you want to test
import User from '../models/User.js';
import * as authService from '../services/auth.service.js';
import * as authValidation from '../validations/auth.validation.js';

// If you have an Express app entry‑point that exports the app instance:
import app from '../server.js';

let mongo;

// ------------------------------------------------------------------
// Global setup / teardown (starts an in‑memory MongoDB)
// ------------------------------------------------------------------
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('🔹 User Model', () => {
  test('hashes password on save', async () => {
    const plain = 'mySecret123';
    const user = await User.create({
      name: 'Alice',
      email: 'alice@example.com',
      role: 'Student',
      passwordHash: plain,
    });

    expect(user.passwordHash).not.toBe(plain);
    const match = await bcrypt.compare(plain, user.passwordHash);
    expect(match).toBe(true);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });
});

describe('🔹 Validation Schemas', () => {
  test('register schema accepts a correct payload', () => {
    const payload = {
      name: 'John',
      email: 'john@example.com',
      password: 'StrongPass!1',
      role: 'Student',
    };
    const { error } = authValidation.registerSchema.validate(payload);
    expect(error).toBeUndefined();
  });

  test('login schema rejects missing password', () => {
    const payload = { email: 'john@example.com' };
    const { error } = authValidation.loginSchema.validate(payload);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/password/);
  });
});

describe('🔹 Auth Service', () => {
  test('register creates a user and returns token+user', async () => {
    const data = {
      name: 'Emma',
      email: 'emma@example.com',
      password: 'Pass123!',
      role: 'Student',
    };
    const result = await authService.register(data);
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe(data.email);
  });

  test('login works with correct credentials', async () => {
    const creds = { email: 'emma@example.com', password: 'Pass123!' };
    const result = await authService.login(creds);
    expect(result).toHaveProperty('token');
  });

  test('login fails with wrong password', async () => {
    const badCreds = { email: 'emma@example.com', password: 'WrongPwd' };
    await expect(authService.login(badCreds)).rejects.toThrow(/Invalid credentials/);
  });
});

describe('🔹 API End‑to‑End (SuperTest)', () => {
  test('POST /api/auth/register → 201 & token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sam',
        email: 'sam@example.com',
        password: 'MyPass!23',
        role: 'Student',
      })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('sam@example.com');
  });

  test('POST /api/auth/login → token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sam@example.com', password: 'MyPass!23' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
  });

  test('GET /api/auth/me requires auth', async () => {
    // login first to get a JWT
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sam@example.com', password: 'MyPass!23' });

    const token = login.body.token;

    await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});