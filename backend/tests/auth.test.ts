import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Authentication API', () => {
  const testUser = {
    name: 'Sarah Connor',
    email: 'sarah.connor@test.com',
    password: 'Password123!',
    targetRole: 'Cybersecurity Analyst',
  };

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, 'another.sarah@test.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully with valid inputs', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('should reject registration if email is already taken', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('already exists');
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bad Email',
        email: 'not-an-email',
        password: 'Password123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.errors).toBeDefined();
    });

    it('should reject registration with password shorter than 6 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Short Pass',
        email: 'short.pass@test.com',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials and return JWT token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'does-not-exist@test.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken = '';

    beforeAll(async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      authToken = loginRes.body.data.token;
    });

    it('should return current user profile when valid Bearer token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.name).toBe(testUser.name);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });

    it('should return 401 when invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-string');

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });
});
