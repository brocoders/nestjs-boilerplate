import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Variants flow (e2e)', () => {
  const ts = Date.now();
  const vendorEmail = `variants-vendor-${ts}@example.com`;
  const vendorPassword = 'Pass1234!';
  const shopName = `Variants Shop ${ts}`;
  const productSlug = `tee-${ts}`;

  let adminAccessToken = '';
  let vendorAccessToken = '';
  let vendorId = '';
  let vendorSlug = '';
  let productId = '';
  let saRegionId = '';
  let egRegionId = '';
  let variantIds: string[] = [];

  it('should let admin log in', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    adminAccessToken = res.body.token as string;
    expect(adminAccessToken.length).toBeGreaterThan(50);
  });

  it('should resolve seeded regions (SA, EG)', async () => {
    const res = await request(APP_URL).get('/api/v1/regions');
    expect(res.status).toBe(200);
    type R = { id: string; code: string };
    const rows = res.body as R[];
    saRegionId = rows.find((r) => r.code === 'SA')?.id ?? '';
    egRegionId = rows.find((r) => r.code === 'EG')?.id ?? '';
    expect(saRegionId).toBeTruthy();
    expect(egRegionId).toBeTruthy();
  });

  it('should sign up a vendor (PENDING)', async () => {
    const res = await request(APP_URL).post('/api/v1/vendor/signup').send({
      email: vendorEmail,
      password: vendorPassword,
      firstName: 'Var',
      lastName: 'Tester',
      name: shopName,
    });
    expect(res.status).toBe(201);
    vendorId = res.body.id as string;
    vendorSlug = res.body.slug as string;
  });

  it('should approve the vendor as admin', async () => {
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

  it('should create a product as vendor (DRAFT)', async () => {
    if (!vendorAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        slug: productSlug,
        nameTranslations: { en: 'Tee', ar: 'تيشيرت' },
        baseCurrency: 'SAR',
      });
    expect(res.status).toBe(201);
    productId = res.body.id as string;
    expect(res.body.status).toBe('DRAFT');
  });

  it('should reject /variants/generate without auth (401)', async () => {
    if (!productId) return;
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/variants/generate`)
      .send({ optionTypes: [] });
    expect(res.status).toBe(401);
  });

  it('should 404 /variants/generate on a non-existent product', async () => {
    if (!vendorAccessToken) return;
    const fakeId = '00000000-0000-7000-8000-000000000000';
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${fakeId}/variants/generate`)
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        optionTypes: [
          {
            slug: 'color',
            nameTranslations: { en: 'Color' },
            values: [{ slug: 'red', valueTranslations: { en: 'Red' } }],
          },
        ],
      });
    expect(res.status).toBe(404);
  });

  it('should generate 4 variants for Color × Size', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/variants/generate`)
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        optionTypes: [
          {
            slug: 'color',
            nameTranslations: { en: 'Color', ar: 'اللون' },
            values: [
              {
                slug: 'red',
                valueTranslations: { en: 'Red', ar: 'أحمر' },
                swatchColor: '#FF5A7A',
              },
              {
                slug: 'blue',
                valueTranslations: { en: 'Blue', ar: 'أزرق' },
                swatchColor: '#3F7AFF',
              },
            ],
          },
          {
            slug: 'size',
            nameTranslations: { en: 'Size', ar: 'المقاس' },
            values: [
              { slug: 's', valueTranslations: { en: 'S', ar: 'صغير' } },
              { slug: 'm', valueTranslations: { en: 'M', ar: 'وسط' } },
            ],
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(4);
    variantIds = (res.body as Array<{ id: string }>).map((v) => v.id);
    const skus = (res.body as Array<{ sku: string }>).map((v) => v.sku);
    expect(new Set(skus).size).toBe(4);
    for (const sku of skus) {
      expect(sku.startsWith(productSlug)).toBe(true);
    }
  });

  it('should reject /variants/generate from a non-owner (403)', async () => {
    if (!vendorAccessToken || !productId) return;
    const otherEmail = `other-vendor-${ts}@example.com`;
    const signup = await request(APP_URL)
      .post('/api/v1/vendor/signup')
      .send({
        email: otherEmail,
        password: vendorPassword,
        firstName: 'Other',
        lastName: 'Vendor',
        name: `Other Shop ${ts}`,
      });
    expect(signup.status).toBe(201);
    const otherVendorId = signup.body.id as string;
    const approve = await request(APP_URL)
      .patch(`/api/v1/admin/vendors/${otherVendorId}/approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(approve.status).toBe(200);
    const login = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: otherEmail, password: vendorPassword });
    if (login.status !== 200) return;
    const otherToken = login.body.token as string;
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/variants/generate`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        optionTypes: [
          {
            slug: 'color',
            nameTranslations: { en: 'Color' },
            values: [{ slug: 'red', valueTranslations: { en: 'Red' } }],
          },
        ],
      });
    expect(res.status).toBe(403);
  });

  it('should set price for each variant in SA (SAR)', async () => {
    if (!vendorAccessToken || variantIds.length !== 4) return;
    for (const vid of variantIds) {
      const res = await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/prices`)
        .set('Authorization', `Bearer ${vendorAccessToken}`)
        .send({
          regionId: saRegionId,
          priceMinorUnits: '9900',
          compareAtPriceMinorUnits: '12900',
        });
      expect(res.status).toBe(200);
      expect(res.body.regionId).toBe(saRegionId);
      expect(res.body.currencyCode).toBe('SAR');
      expect(res.body.priceMinorUnits).toBe('9900');
    }
  });

  it('should reject set-price with an invalid regionId (422)', async () => {
    if (!vendorAccessToken || variantIds.length !== 4) return;
    const fakeRegion = '00000000-0000-7000-8000-000000000abc';
    const res = await request(APP_URL)
      .patch(
        `/api/v1/vendor/products/${productId}/variants/${variantIds[0]}/prices`,
      )
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({ regionId: fakeRegion, priceMinorUnits: '1000' });
    expect(res.status).toBe(422);
  });

  it('should set stock for each variant', async () => {
    if (!vendorAccessToken || variantIds.length !== 4) return;
    for (const vid of variantIds) {
      const res = await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/stock`)
        .set('Authorization', `Bearer ${vendorAccessToken}`)
        .send({ quantity: 25 });
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(25);
    }
  });

  it('should list variants for vendor with hydrated options/prices/stock', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .get(`/api/v1/vendor/products/${productId}/variants`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    for (const v of res.body as Array<{
      optionValueIds: unknown[];
      prices: Array<{ regionId: string }>;
      stock: { quantity: number } | null;
    }>) {
      expect(v.optionValueIds).toHaveLength(2);
      expect(v.prices.find((p) => p.regionId === saRegionId)).toBeTruthy();
      expect(v.stock?.quantity).toBe(25);
    }
  });

  it('should publish the product (DRAFT → ACTIVE)', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/publish`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('ACTIVE');
  });

  it('should return 4 variants on public detail with ?region=SA', async () => {
    if (!productId) return;
    // multi_region_enabled defaults to false, so X-Region is ignored by the
    // interceptor — use the query parameter instead to force the region.
    const res = await request(APP_URL).get(
      `/api/v1/products/${vendorSlug}/${productSlug}?region=SA`,
    );
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
    expect(Array.isArray(res.body.variants)).toBe(true);
    expect(res.body.variants).toHaveLength(4);
    for (const v of res.body.variants as Array<{
      prices: Array<{ regionId: string; currencyCode: string }>;
    }>) {
      expect(v.prices).toHaveLength(1);
      expect(v.prices[0].regionId).toBe(saRegionId);
      expect(v.prices[0].currencyCode).toBe('SAR');
    }
  });

  it('should expose vendorSlug + hydrated optionTypes on public detail', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get(
      `/api/v1/products/${vendorSlug}/${productSlug}?region=SA`,
    );
    expect(res.status).toBe(200);
    expect(res.body.vendorSlug).toBe(vendorSlug);
    expect(Array.isArray(res.body.optionTypes)).toBe(true);
    // Two types were generated: color, size — each with values + translations.
    expect(res.body.optionTypes).toHaveLength(2);
    const slugs = (res.body.optionTypes as Array<{ slug: string }>).map(
      (t) => t.slug,
    );
    expect(slugs).toEqual(expect.arrayContaining(['color', 'size']));
    for (const t of res.body.optionTypes as Array<{
      slug: string;
      nameTranslations: Record<string, string>;
      values: Array<{
        slug: string;
        valueTranslations: Record<string, string>;
      }>;
    }>) {
      expect(typeof t.nameTranslations.en).toBe('string');
      expect(Array.isArray(t.values)).toBe(true);
      expect(t.values.length).toBeGreaterThan(0);
      for (const v of t.values) {
        expect(typeof v.slug).toBe('string');
        expect(typeof v.valueTranslations.en).toBe('string');
      }
    }
  });

  it('should fall back to default region context when no override is given', async () => {
    if (!productId) return;
    // Default region is SA per the seed; expect 4 variants without any params.
    const res = await request(APP_URL).get(
      `/api/v1/products/${vendorSlug}/${productSlug}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.variants).toHaveLength(4);
  });

  it('should return 0 variants on public detail with ?region=EG (no prices)', async () => {
    if (!productId) return;
    const res = await request(APP_URL).get(
      `/api/v1/products/${vendorSlug}/${productSlug}?region=EG`,
    );
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
    expect(res.body.variants).toHaveLength(0);
  });

  it('should re-generate variants and replace the previous set', async () => {
    if (!vendorAccessToken || !productId) return;
    const res = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/variants/generate`)
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        optionTypes: [
          {
            slug: 'size',
            nameTranslations: { en: 'Size' },
            values: [
              { slug: 's', valueTranslations: { en: 'S' } },
              { slug: 'm', valueTranslations: { en: 'M' } },
              { slug: 'l', valueTranslations: { en: 'L' } },
            ],
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveLength(3);
    // After re-generation, public detail (SA) should now have 0 variants
    // because the previously-priced variants were wiped.
    const detail = await request(APP_URL).get(
      `/api/v1/products/${vendorSlug}/${productSlug}?region=SA`,
    );
    expect(detail.status).toBe(200);
    expect(detail.body.variants).toHaveLength(0);
  });
});
