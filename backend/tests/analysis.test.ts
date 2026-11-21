import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Analysis and Dashboard API', () => {
  let user1Token = '';
  let user1Id = '';
  let user2Token = '';
  let user2Id = '';
  let user1ResumeId = '';
  let createdReportId = '';

  beforeAll(async () => {
    // 1. Create User 1
    const u1 = await request(app).post('/api/auth/register').send({
      name: 'Analysis User One',
      email: 'analysis.user1@test.com',
      password: 'Password123!',
    });
    user1Token = u1.body.data.token;
    user1Id = u1.body.data.user.id;

    // 2. Create User 2
    const u2 = await request(app).post('/api/auth/register').send({
      name: 'Analysis User Two',
      email: 'analysis.user2@test.com',
      password: 'Password123!',
    });
    user2Token = u2.body.data.token;
    user2Id = u2.body.data.user.id;

    // 3. Create a resume for User 1 directly via Prisma
    const resume = await prisma.resume.create({
      data: {
        userId: user1Id,
        fileName: 'Test_Resume.pdf',
        fileUrl: 'test-resume.pdf',
        fileSize: 1024,
        fileType: 'pdf',
        parsedText: 'Experienced Software Engineer with strong skills in TypeScript, React, and Node.js.',
        extractedSkills: ['TypeScript', 'React', 'Node.js'],
      },
    });
    user1ResumeId = resume.id;
  });

  afterAll(async () => {
    await prisma.analysisReport.deleteMany({
      where: { userId: { in: [user1Id, user2Id] } },
    });
    await prisma.resume.deleteMany({
      where: { userId: { in: [user1Id, user2Id] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [user1Id, user2Id] } },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/analyses (Create Analysis)', () => {
    it('should validate job description minimum length', async () => {
      const res = await request(app)
        .post('/api/analyses')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          resumeId: user1ResumeId,
          jobTitle: 'Developer',
          jobDescription: 'Too short', // Under 30 characters
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.errors).toBeDefined();
    });

    it('should reject analysis request if resumeId is not a valid UUID', async () => {
      const res = await request(app)
        .post('/api/analyses')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          resumeId: 'not-a-valid-uuid',
          jobTitle: 'Full Stack Engineer',
          jobDescription: 'Looking for a skilled full stack engineer to build robust web services.',
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should reject analysis if the user does not own the resume (Access Control)', async () => {
      const res = await request(app)
        .post('/api/analyses')
        .set('Authorization', `Bearer ${user2Token}`) // User 2 trying to analyze User 1's resume
        .send({
          resumeId: user1ResumeId,
          jobTitle: 'Backend Engineer',
          jobDescription: 'Need a senior backend engineer proficient in Node.js, Express, and databases.',
        });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Access denied');
    });

    it('should perform AI analysis and save report for owner (Mocked Gemini API)', async () => {
      const res = await request(app)
        .post('/api/analyses')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          resumeId: user1ResumeId,
          jobTitle: 'Full Stack Engineer',
          company: 'Acme Corp',
          jobDescription:
            'We are seeking a Full Stack Engineer with strong knowledge of TypeScript, React, and Node.js to build cloud solutions.',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.report).toBeDefined();
      expect(res.body.report.matchScore).toBe(82);
      expect(res.body.report.jobTitle).toBe('Full Stack Engineer');
      expect(res.body.report.company).toBe('Acme Corp');
      expect(res.body.report.matchingSkills).toContain('TypeScript');
      expect(res.body.report.interviewQuestions.technical.length).toBeGreaterThan(0);
      expect(res.body.report.learningPriorities.length).toBeGreaterThan(0);

      createdReportId = res.body.report.id;
    });
  });

  describe('GET /api/analyses and /api/analyses/:id', () => {
    it('should list all reports belonging to the user', async () => {
      const res = await request(app)
        .get('/api/analyses')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.reports)).toBe(true);
      expect(res.body.reports.length).toBe(1);
      expect(res.body.reports[0].id).toBe(createdReportId);
    });

    it('should retrieve a single report by ID for the owner', async () => {
      const res = await request(app)
        .get(`/api/analyses/${createdReportId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.report.id).toBe(createdReportId);
    });

    it('should deny access when another user attempts to retrieve the report', async () => {
      const res = await request(app)
        .get(`/api/analyses/${createdReportId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return aggregated metrics for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.stats.totalAnalyses).toBe(1);
      expect(res.body.stats.averageScore).toBe(82);
      expect(res.body.stats.totalResumes).toBe(1);
      expect(Array.isArray(res.body.stats.topMissingSkills)).toBe(true);
      expect(Array.isArray(res.body.stats.recentAnalyses)).toBe(true);
    });
  });

  describe('DELETE /api/analyses/:id', () => {
    it('should prevent unauthorized deletion by another user', async () => {
      const res = await request(app)
        .delete(`/api/analyses/${createdReportId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
    });

    it('should delete the analysis report when requested by owner', async () => {
      const res = await request(app)
        .delete(`/api/analyses/${createdReportId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');

      // Verify deletion
      const check = await prisma.analysisReport.findUnique({
        where: { id: createdReportId },
      });
      expect(check).toBeNull();
    });
  });
});
