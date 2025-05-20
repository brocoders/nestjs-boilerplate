import request from 'supertest';
import { APP_URL } from '../utils/constants';

describe('Templates', () => {
  const app = APP_URL;
  let createdId: string;

  const templateData = {
    name: `Clause ${Date.now()}`,
    type: 'general',
    content: 'Sample clause content',
    jurisdiction: 'us',
  };

  it('should create template via POST /templates', async () => {
    return request(app)
      .post('/api/v1/templates')
      .send(templateData)
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBe(templateData.name);
        createdId = body.id;
      });
  });

  it('should get all templates via GET /templates', async () => {
    return request(app)
      .get('/api/v1/templates')
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.find((t: any) => t.id === createdId)).toBeDefined();
      });
  });

  it('should get one template via GET /templates/:id', async () => {
    return request(app)
      .get(`/api/v1/templates/${createdId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(createdId);
        expect(body.name).toBe(templateData.name);
      });
  });

  it('should update template via PATCH /templates/:id', async () => {
    const updatedName = `${templateData.name}-updated`;
    return request(app)
      .patch(`/api/v1/templates/${createdId}`)
      .send({ name: updatedName })
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(createdId);
        expect(body.name).toBe(updatedName);
      });
  });

  it('should delete template via DELETE /templates/:id', async () => {
    return request(app).delete(`/api/v1/templates/${createdId}`).expect(200);
  });

  it('should return 404 for deleted template via GET /templates/:id', async () => {
    return request(app).get(`/api/v1/templates/${createdId}`).expect(404);
  });
});
