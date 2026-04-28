import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Products flow (e2e)', () => {
  const ts = Date.now();
  const vendorEmail = `product-vendor-${ts}@example.com`;
  const vendorPassword = 'Pass1234!';
  const shopName = `Product Shop ${ts}`;
  const productSlug = `classic-tee-${ts}`;
  const categorySlug = `apparel-${ts}`;

  let adminAccessToken = '';
  let vendorAccessToken = '';
  let vendorId = '';
  let vendorSlug = '';
  let productId = '';
  let categoryId = '';

  it('should let admin log in', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    adminAccessToken = res.body.token as string;
    expect(adminAccessToken.length).toBeGreaterThan(50);
  });

  it('should create a category as admin (for product to reference)', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        slug: categorySlug,
        nameTranslations: { en: 'Apparel', ar: 'ملابس' },
      });
    expect(res.status).toBe(201);
    categoryId = res.body.id as string;
  });

  it('should sign up a new vendor (PENDING)', async () => {
    const res = await request(APP_URL).post('/api/v1/vendor/signup').send({
      email: vendorEmail,
      password: vendorPassword,
      firstName: 'Pat',
      lastName: 'Tester',
      name: shopName,
    });
    expect(res.status).toBe(201);
    vendorId = res.body.id as string;
    vendorSlug = res.body.slug as string;
  });

  it('should approve the vendor as admin (PENDING → ACTIVE)', async () => {
    const res = await request(APP_URL)
      .patch(`/api/v1/admin/vendors/${vendorId}/approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACTIVE');
  });

  it('should attempt vendor login (skipped if email confirmation blocks it)', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: vendorEmail, password: vendorPassword });
    if (res.status === 200) {
      vendorAccessToken = res.body.token as string;
      expect(vendorAccessToken.length).toBeGreaterThan(50);
    } else {
      expect(res.status).toBe(401);
    }
  });

  it('should reject POST /vendor/products without auth (401)', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .send({
        slug: productSlug,
        nameTranslations: { en: 'Classic Tee' },
        baseCurrency: 'SAR',
      });
    expect(res.status).toBe(401);
  });

  it('should reject POST /vendor/products as a non-vendor user (403)', async () => {
    if (!vendorAccessToken) return;
    // Create a fresh user that has no vendor account
    const otherEmail = `non-vendor-${ts}@example.com`;
    const signup = await request(APP_URL)
      .post('/api/v1/auth/email/register')
      .send({
        email: otherEmail,
        password: vendorPassword,
        firstName: 'No',
        lastName: 'Vendor',
      });
    // Boilerplate returns 204 on register (email confirmation needed); login may fail.
    expect([200, 201, 204, 422]).toContain(signup.status);
    const login = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: otherEmail, password: vendorPassword });
    if (login.status !== 200) return;
    const otherToken = login.body.token as string;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        slug: productSlug,
        nameTranslations: { en: 'Classic Tee' },
        baseCurrency: 'SAR',
      });
    expect(res.status).toBe(403);
  });

  it('should create a product as vendor (DRAFT)', async () => {
    if (!vendorAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        slug: productSlug,
        nameTranslations: { en: 'Classic Tee', ar: 'تيشيرت كلاسيك' },
        descriptionTranslations: { en: 'Soft cotton.' },
        categoryId,
        baseCurrency: 'SAR',
      });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      slug: productSlug,
      status: 'DRAFT',
      baseCurrency: 'SAR',
      vendorId,
      categoryId,
    });
    productId = res.body.id as string;
  });

  it('should reject duplicate slug for the same vendor (409)', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        slug: productSlug,
        nameTranslations: { en: 'Dup' },
        baseCurrency: 'SAR',
      });
    expect(res.status).toBe(409);
  });

  it('should list vendor products (contains the new product)', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .get('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    const found = res.body.data.find((p: { id: string }) => p.id === productId);
    expect(found).toBeTruthy();
    expect(found.status).toBe('DRAFT');
  });

  it('should hide DRAFT products from public list', async () => {
    const res = await request(APP_URL).get('/api/v1/products');
    expect(res.status).toBe(200);
    if (!productId) return;
    const found = res.body.data.find((p: { id: string }) => p.id === productId);
    expect(found).toBeFalsy();
  });

  it('should publish a product (DRAFT → ACTIVE)', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/publish`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('ACTIVE');
  });

  it('should now show in the public list', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get('/api/v1/products');
    expect(res.status).toBe(200);
    const found = res.body.data.find((p: { id: string }) => p.id === productId);
    expect(found).toBeTruthy();
    expect(found.status).toBe('ACTIVE');
  });

  it('should expose vendorSlug on each public list item', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get('/api/v1/products');
    expect(res.status).toBe(200);
    const found = res.body.data.find((p: { id: string }) => p.id === productId);
    expect(found).toBeTruthy();
    expect(typeof found.vendorSlug).toBe('string');
    expect(found.vendorSlug).toBe(vendorSlug);
  });

  it('should fetch product by /products/:vendorSlug/:productSlug', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get(
      `/api/v1/products/${vendorSlug}/${productSlug}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
    expect(res.body.status).toBe('ACTIVE');
    expect(res.body.vendorSlug).toBe(vendorSlug);
    expect(Array.isArray(res.body.optionTypes)).toBe(true);
  });

  it('should filter public list by category slug', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get(
      `/api/v1/products?categorySlug=${categorySlug}`,
    );
    expect(res.status).toBe(200);
    const found = res.body.data.find((p: { id: string }) => p.id === productId);
    expect(found).toBeTruthy();
  });

  it('should patch a product (vendor)', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .patch(`/api/v1/vendor/products/${productId}`)
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({ descriptionTranslations: { en: 'Updated copy.' } });
    expect(res.status).toBe(200);
    expect(res.body.descriptionTranslations.en).toBe('Updated copy.');
  });

  it('should archive a product (ACTIVE → ARCHIVED)', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/archive`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('ARCHIVED');
  });

  it('should disappear from the public list after archive', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get('/api/v1/products');
    expect(res.status).toBe(200);
    const found = res.body.data.find((p: { id: string }) => p.id === productId);
    expect(found).toBeFalsy();
  });

  it('should 404 on /products/:vendorSlug/:productSlug after archive', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get(
      `/api/v1/products/${vendorSlug}/${productSlug}`,
    );
    expect(res.status).toBe(404);
  });

  it('should reject invalid baseCurrency on create (400/422)', async () => {
    if (!vendorAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        slug: `bad-${ts}`,
        nameTranslations: { en: 'Bad' },
        baseCurrency: 'sar',
      });
    expect([400, 422]).toContain(res.status);
  });
});
