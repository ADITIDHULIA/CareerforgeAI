import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';
import { TextExtractorService } from '../src/services/textExtractor.service';
import fs from 'fs';
import path from 'path';

describe('Resume API', () => {
  let authToken = '';
  let otherAuthToken = '';
  let userId = '';
  let otherUserId = '';
  let createdResumeId = '';

  const dummyPdfPath = path.resolve(__dirname, 'dummy-test.pdf');
  const dummyTxtPath = path.resolve(__dirname, 'dummy-test.txt');

  beforeAll(async () => {
    // Spy on text extraction to provide reliable text for test runs
    jest.spyOn(TextExtractorService, 'extractText').mockResolvedValue(
      'Alex Johnson Software Developer experienced in React, Node.js, TypeScript, and PostgreSQL database systems.'
    );

    fs.writeFileSync(dummyPdfPath, 'Dummy PDF content buffer');
    fs.writeFileSync(dummyTxtPath, 'This is a plain text file that should be rejected.');

    // Register User 1
    const user1Res = await request(app).post('/api/auth/register').send({
      name: 'Resume Test User',
      email: 'resume.user1@test.com',
      password: 'Password123!',
    });
    authToken = user1Res.body.data.token;
    userId = user1Res.body.data.user.id;

    // Register User 2
    const user2Res = await request(app).post('/api/auth/register').send({
      name: 'Resume Other User',
      email: 'resume.user2@test.com',
      password: 'Password123!',
    });
    otherAuthToken = user2Res.body.data.token;
    otherUserId = user2Res.body.data.user.id;
  });

  afterAll(async () => {
    // Clean up temporary files
    if (fs.existsSync(dummyPdfPath)) fs.unlinkSync(dummyPdfPath);
    if (fs.existsSync(dummyTxtPath)) fs.unlinkSync(dummyTxtPath);

    // Clean up test data
    await prisma.resume.deleteMany({
      where: { userId: { in: [userId, otherUserId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [userId, otherUserId] } },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/resumes (Upload)', () => {
    it('should reject requests without authorization token', async () => {
      const res = await request(app)
        .post('/api/resumes');

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Authentication required');
    });

    it('should reject file types other than PDF or DOCX', async () => {
      const res = await request(app)
        .post('/api/resumes')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('resume', dummyTxtPath);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Only PDF (.pdf) and Word documents (.docx) are allowed');
    });

    it('should accept and process a valid PDF resume', async () => {
      const res = await request(app)
        .post('/api/resumes')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('resume', dummyPdfPath);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.resume.id).toBeDefined();
      expect(res.body.resume.fileName).toBe('dummy-test.pdf');
      expect(res.body.resume.parsedText).toBeDefined();

      createdResumeId = res.body.resume.id;
    });
  });

  describe('GET /api/resumes', () => {
    it('should list all resumes owned by the authenticated user', async () => {
      const res = await request(app)
        .get('/api/resumes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.resumes)).toBe(true);
      expect(res.body.resumes.length).toBeGreaterThan(0);
      expect(res.body.resumes[0].id).toBe(createdResumeId);
    });

    it('should not show resumes from other users', async () => {
      const res = await request(app)
        .get('/api/resumes')
        .set('Authorization', `Bearer ${otherAuthToken}`);

      expect(res.status).toBe(200);
      expect(res.body.resumes.length).toBe(0);
    });
  });

  describe('GET /api/resumes/:id', () => {
    it('should retrieve a resume by ID for the owner', async () => {
      const res = await request(app)
        .get(`/api/resumes/${createdResumeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.resume.id).toBe(createdResumeId);
    });

    it('should return 403 Forbidden when another user attempts to retrieve the resume', async () => {
      const res = await request(app)
        .get(`/api/resumes/${createdResumeId}`)
        .set('Authorization', `Bearer ${otherAuthToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
  });

  describe('DELETE /api/resumes/:id', () => {
    it('should prevent unauthorized user from deleting another user resume', async () => {
      const res = await request(app)
        .delete(`/api/resumes/${createdResumeId}`)
        .set('Authorization', `Bearer ${otherAuthToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow the owner to delete their resume', async () => {
      const res = await request(app)
        .delete(`/api/resumes/${createdResumeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');

      // Verify deletion from database
      const check = await prisma.resume.findUnique({
        where: { id: createdResumeId },
      });
      expect(check).toBeNull();
    });
  });
});
