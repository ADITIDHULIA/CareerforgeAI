import request from 'supertest';
import app from '../src/app';

describe('Health API', () => {
  it('GET /api/health should return 200 OK and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('CareerForge AI Backend');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/non-existent-route should return 404', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('not found');
  });
});
