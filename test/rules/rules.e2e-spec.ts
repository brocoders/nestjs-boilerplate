import request from 'supertest';
import { APP_URL } from '../utils/constants';

describe('Rules', () => {
  const app = APP_URL;
  let createdId: string;

  const data = {
    name: `Rule ${Date.now()}`,
    similarityThreshold: 5,
  };

  it('should create rule via POST /rules', async () => {
    return request(app)
      .post('/api/v1/rules')
      .send(data)
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        createdId = body.id;
      });
  });

  it('should get rule via GET /rules/:id', async () => {
    return request(app)
      .get(`/api/v1/rules/${createdId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(createdId);
      });
  });

  it('should list rules via GET /rules', async () => {
    return request(app)
      .get('/api/v1/rules')
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('should update rule via PATCH /rules/:id', async () => {
    return request(app)
      .patch(`/api/v1/rules/${createdId}`)
      .send({ name: data.name + 'u' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe(data.name + 'u');
      });
  });

  it('should delete rule via DELETE /rules/:id', async () => {
    return request(app).delete(`/api/v1/rules/${createdId}`).expect(200);
  });
});
