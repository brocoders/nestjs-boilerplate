import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Categories flow (e2e)', () => {
  const ts = Date.now();
  const slug = `test-category-${ts}`;
  let adminAccessToken = '';
  let categoryId = '';

  it('should let admin log in', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    adminAccessToken = res.body.token as string;
    expect(adminAccessToken.length).toBeGreaterThan(50);
  });

  it('should reject /admin/categories without auth', async () => {
    const res = await request(APP_URL).get('/api/v1/admin/categories');
    expect(res.status).toBe(401);
  });

  it('should reject create without admin token', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/admin/categories')
      .send({ slug, nameTranslations: { en: 'X' } });
    expect(res.status).toBe(401);
  });

  it('should create a category as admin', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        slug,
        nameTranslations: { en: 'Test Category', ar: 'فئة الاختبار' },
        icon: 'solar:bag-bold-duotone',
        position: 1,
      });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      slug,
      isActive: true,
      position: 1,
    });
    expect(res.body.nameTranslations).toEqual({
      en: 'Test Category',
      ar: 'فئة الاختبار',
    });
    categoryId = res.body.id as string;
  });

  it('should reject duplicate slug', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ slug, nameTranslations: { en: 'Dup' } });
    expect(res.status).toBe(409);
  });

  it('should reject invalid slug format', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ slug: 'BAD SLUG!', nameTranslations: { en: 'X' } });
    expect([400, 422]).toContain(res.status);
  });

  it('should reject empty nameTranslations', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ slug: `${slug}-empty`, nameTranslations: {} });
    expect([400, 422]).toContain(res.status);
  });

  it('should fetch the category from the public list (active)', async () => {
    const res = await request(APP_URL).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((c: { id: string }) => c.id === categoryId);
    expect(found).toBeTruthy();
    expect(found.slug).toBe(slug);
  });

  it('should fetch the category by slug (public)', async () => {
    const res = await request(APP_URL).get(`/api/v1/categories/${slug}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(categoryId);
    expect(res.body.nameTranslations.en).toBe('Test Category');
  });

  it('should 404 on unknown slug', async () => {
    const res = await request(APP_URL).get(
      `/api/v1/categories/no-such-slug-${ts}`,
    );
    expect(res.status).toBe(404);
  });

  it('should patch the category', async () => {
    const res = await request(APP_URL)
      .patch(`/api/v1/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ position: 7, isActive: false });
    expect(res.status).toBe(200);
    expect(res.body.position).toBe(7);
    expect(res.body.isActive).toBe(false);
  });

  it('should hide inactive categories from public list', async () => {
    const res = await request(APP_URL).get('/api/v1/categories');
    expect(res.status).toBe(200);
    const found = res.body.find((c: { id: string }) => c.id === categoryId);
    expect(found).toBeFalsy();
  });

  it('should still show inactive categories in admin list', async () => {
    const res = await request(APP_URL)
      .get('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.status).toBe(200);
    const found = res.body.find((c: { id: string }) => c.id === categoryId);
    expect(found).toBeTruthy();
    expect(found.isActive).toBe(false);
  });

  it('should delete the category', async () => {
    const res = await request(APP_URL)
      .delete(`/api/v1/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.status).toBe(204);
  });

  it('should 404 on patch after delete', async () => {
    const res = await request(APP_URL)
      .patch(`/api/v1/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ position: 1 });
    expect(res.status).toBe(404);
  });
});
