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
    // Ingest a contract to ensure test data exists
    const ingestRes = await request(app)
      .post('/api/v1/hybrid/ingest')
      .send(ingestData)
      .expect(201);
    expect(ingestRes.body).toHaveProperty('clauseCount');
    expect(typeof ingestRes.body.clauseCount).toBe('number');

    // Now search for clauses
    const res = await request(app)
      .get('/api/v1/hybrid/search')
      .query({ q: 'test' })
      .expect(200);

    // Assert response structure
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const clause = res.body[0];
      expect(clause).toHaveProperty('id');
      expect(clause).toHaveProperty('title');
      expect(clause).toHaveProperty('clauseType');
      expect(clause).toHaveProperty('text');
      expect(clause).toHaveProperty('riskScore');
      // Optional fields
      expect(clause).toHaveProperty('riskJustification');
      // entities, amounts, dates, legalReferences are optional arrays
      if ('entities' in clause)
        expect(Array.isArray(clause.entities)).toBe(true);
      if ('amounts' in clause) expect(Array.isArray(clause.amounts)).toBe(true);
      if ('dates' in clause) expect(Array.isArray(clause.dates)).toBe(true);
      if ('legalReferences' in clause)
        expect(Array.isArray(clause.legalReferences)).toBe(true);
    }
  });

  it('should return 422 for invalid contract data during ingestion', async () => {
    // Missing required fields: contractId, sources, contractType
    const invalidData = { title: 'Incomplete Contract' };
    const res = await request(app)
      .post('/api/v1/hybrid/ingest')
      .send(invalidData)
      .expect(422);
    expect(res.body).toHaveProperty('status', 422);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('contractId');
    expect(res.body.errors).toHaveProperty('sources');
    expect(res.body.errors).toHaveProperty('contractType');
  });

  it('should return 422 for empty search query', async () => {
    const res = await request(app)
      .get('/api/v1/hybrid/search')
      .query({ q: '' })
      .expect(422);
    expect(res.body).toHaveProperty('status', 422);
    expect(res.body).toHaveProperty('errors');
  });
});
