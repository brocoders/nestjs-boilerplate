import request from 'supertest';
import path from 'path';
import { APP_URL } from '../utils/constants';

describe('Contracts', () => {
  const app = APP_URL;
  const filePath = path.join(__dirname, '../fixtures/sample.pdf');
  let createdId: string;

  it('should upload contract via POST /contracts/upload', async () => {
    return request(app)
      .post('/api/v1/contracts/upload')
      .attach('file', filePath)
      .field('contractType', 'NDA')
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        createdId = body.id;
      });
  });

  it('should get uploaded contract via GET /contracts/:id', async () => {
    return request(app)
      .get(`/api/v1/contracts/${createdId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(createdId);
      });
  });
});
