import request from 'supertest';
import { APP_URL } from '../utils/constants';

const app = APP_URL;
const baseUrl = '/api/v1/analysis/contracts';

// Helper to create a contract
async function createContract(overrides = {}) {
  const contractData = {
    title: `Test Contract ${Date.now()}`,
    type: 'other',
    ...overrides,
  };
  const res = await request(app).post(baseUrl).send(contractData);
  return res;
}

describe('Analysis Contracts', () => {
  let createdIds: string[] = [];

  afterEach(async () => {
    // Cleanup all created contracts
    for (const id of createdIds) {
      await request(app).delete(`${baseUrl}/${id}`);
    }
    createdIds = [];
  });

  it('should create contract via POST /analysis/contracts', async () => {
    const res = await createContract();
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdIds.push(res.body.id);
  });

  it('should get contract via GET /analysis/contracts/:id', async () => {
    const resCreate = await createContract();
    expect(resCreate.status).toBe(201);
    const id = resCreate.body.id;
    createdIds.push(id);

    const resGet = await request(app).get(`${baseUrl}/${id}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body.id).toBe(id);
  });

  it('should delete contract via DELETE /analysis/contracts/:id', async () => {
    const resCreate = await createContract();
    expect(resCreate.status).toBe(201);
    const id = resCreate.body.id;

    const resDelete = await request(app).delete(`${baseUrl}/${id}`);
    expect(resDelete.status).toBe(200);

    // Should return 404 after deletion
    const resGet = await request(app).get(`${baseUrl}/${id}`);
    expect(resGet.status).toBe(404);
  });

  it('should return 404 for non-existent contract via GET', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`${baseUrl}/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('should return 404 for non-existent contract via DELETE', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).delete(`${baseUrl}/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('should fail to create contract with missing required fields', async () => {
    const res = await request(app).post(baseUrl).send({ type: 'other' }); // missing title
    expect(res.status).toBe(400);
  });

  it('should fail to create contract with invalid type', async () => {
    const res = await request(app).post(baseUrl).send({ title: 'Invalid Type', type: 'not-a-type' });
    expect(res.status).toBe(400);
  });

  it('should fail to get contract with invalid id format', async () => {
    const res = await request(app).get(`${baseUrl}/not-a-uuid`);
    // Could be 400 or 404 depending on validation, accept either
    expect([400, 404]).toContain(res.status);
  });

  it('should fail to delete contract with invalid id format', async () => {
    const res = await request(app).delete(`${baseUrl}/not-a-uuid`);
    expect([400, 404]).toContain(res.status);
  });
});
