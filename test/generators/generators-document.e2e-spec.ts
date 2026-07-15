import { describe, expect, it, beforeAll } from '@jest/globals';
import request from 'supertest';

import { APP_URL } from '../utils/constants';
import { loginAsAdmin, type AdminSession } from './helpers/auth';
import { buildArticlePayload } from './helpers/payloads-document';

describe('Generators — document CRUD on /api/v1/articles', () => {
  let session: AdminSession;
  let tagId: string | number;
  let articleId: string | number;

  beforeAll(async () => {
    session = await loginAsAdmin();

    const tagResponse = await request(APP_URL)
      .post('/api/v1/tags')
      .auth(session.token, { type: 'bearer' })
      .send({ name: `e2e-tag-${Date.now()}` });

    expect(tagResponse.status).toBe(201);
    tagId = tagResponse.body.id;
  });

  it('should create an article with all primitive and reference fields', async () => {
    const payload = buildArticlePayload({
      adminId: session.adminId,
      tagId,
      titleSuffix: String(Date.now()),
    });

    const response = await request(APP_URL)
      .post('/api/v1/articles')
      .auth(session.token, { type: 'bearer' })
      .send({
        ...payload,
        internalNote: 'should be stripped because isAddToDto=false',
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe(payload.title);
    expect(response.body.internalNote).toBeUndefined();

    articleId = response.body.id;
  });

  it('should fetch the created article with mongoose-autopopulated relations', async () => {
    const response = await request(APP_URL)
      .get(`/api/v1/articles/${articleId}`)
      .auth(session.token, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(articleId);
    expect(response.body.author?.id).toBeDefined();
    expect(Array.isArray(response.body.tags)).toBe(true);

    const editor = response.body.editor;
    expect(editor?.id ?? editor).toBeTruthy();
    expect(editor?.email).toBeUndefined();
  });

  it('should partially update an article with PATCH', async () => {
    const response = await request(APP_URL)
      .patch(`/api/v1/articles/${articleId}`)
      .auth(session.token, { type: 'bearer' })
      .send({ title: 'updated title' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('updated title');
  });

  it('should delete an article', async () => {
    const deleteResponse = await request(APP_URL)
      .delete(`/api/v1/articles/${articleId}`)
      .auth(session.token, { type: 'bearer' });

    expect([200, 204]).toContain(deleteResponse.status);
  });
});
