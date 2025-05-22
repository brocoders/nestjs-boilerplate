import request from 'supertest';
import { APP_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/constants';

describe('Standard Clauses', () => {
  const app = APP_URL;
  let token: string;
  let createdId: number;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ body }) => {
        token = body.token;
      });
  });

  it('should create clause via POST /standard-clauses', async () => {
    return request(app)
      .post('/api/v1/standard-clauses')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test Clause',
        type: 'general',
        contractType: 'other',
        text: 'sample',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        createdId = body.id;
      });
  });

  it('should get clause via GET /standard-clauses/:id', async () => {
    return request(app)
      .get(`/api/v1/standard-clauses/${createdId}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(createdId);
      });
  });
});
