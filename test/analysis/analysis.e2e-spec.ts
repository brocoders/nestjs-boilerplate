import request from 'supertest';
import { APP_URL } from '../utils/constants';

describe('Analysis', () => {
  const app = APP_URL;
  let createdId: string;

  it('should create contract via POST /analysis/contracts', async () => {
    return request(app)
      .post('/api/v1/analysis/contracts')
      .send({ title: 'Test Contract', type: 'other' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        createdId = body.id;
      });
  });

  it('should get contract via GET /analysis/contracts/:id', async () => {
    return request(app)
      .get(`/api/v1/analysis/contracts/${createdId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(createdId);
      });
  });
});
