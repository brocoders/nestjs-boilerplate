import request from 'supertest';
import { APP_URL } from './utils/constants';

describe('RequestContext (e2e)', () => {
  const app = APP_URL;

  it('should fall back to default region when X-Region absent', async () => {
    const res = await request(app)
      .get('/api/v1/regions')
      .set('Accept-Language', 'en');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should accept X-Region: EG and Accept-Language: ar', async () => {
    const res = await request(app)
      .get('/api/v1/regions')
      .set('X-Region', 'EG')
      .set('Accept-Language', 'ar');
    expect(res.status).toBe(200);
  });

  it('should ignore invalid X-Region (falls back to default)', async () => {
    const res = await request(app).get('/api/v1/regions').set('X-Region', 'XX');
    expect(res.status).toBe(200);
  });

  it('should ignore unknown Accept-Language (falls back to default)', async () => {
    const res = await request(app)
      .get('/api/v1/regions')
      .set('Accept-Language', 'fr');
    expect(res.status).toBe(200);
  });
});
