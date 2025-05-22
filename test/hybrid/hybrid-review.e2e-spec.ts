import request from 'supertest';
import { APP_URL } from '../utils/constants';

describe('Hybrid Review', () => {
  const app = APP_URL;
  const ingestData = {
    contractId: `c${Date.now()}`,
    title: 'Test Contract',
    sources: ['test'],
    contractType: 'NDA',
  };

  it('should ingest contract via POST /hybrid/ingest', async () => {
    return request(app)
      .post('/api/v1/hybrid/ingest')
      .send(ingestData)
      .expect(201);
  });

  it('should search clauses via GET /hybrid/search', async () => {
    return request(app)
      .get('/api/v1/hybrid/search')
      .query({ q: 'test' })
      .expect(200);
  });
});
