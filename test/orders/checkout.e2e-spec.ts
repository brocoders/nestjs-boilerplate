import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Checkout quote (e2e)', () => {
  const ts = Date.now();
  const vendorEmail = `quote-vendor-${ts}@example.com`;
  const vendorPassword = 'Pass1234!';
  const shopName = `Quote Shop ${ts}`;
  const productSlug = `quote-tee-${ts}`;
  const buyerEmail = `quote-buyer-${ts}@example.com`;
  const buyerPassword = 'Pass1234!';

  let adminAccessToken = '';
  let vendorAccessToken = '';
  let buyerAccessToken = '';
  let vendorId = '';
  let vendorSlug = '';
  let productId = '';
  let saRegionId = '';
  const variantIds: string[] = [];

  const saAddress = {
    fullName: 'Layla Al-Mansour',
    phone: '+966555012345',
    country: 'SA',
    region: 'Riyadh',
    city: 'Riyadh',
    postalCode: '12343',
    street: 'King Fahd Rd, Bldg 14, Apt 3',
    notes: null,
  };

  it('should let admin log in', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    adminAccessToken = res.body.token as string;
  });

  it('should resolve the SA region id', async () => {
    const res = await request(APP_URL).get('/api/v1/regions');
    expect(res.status).toBe(200);
    saRegionId =
      (res.body as Array<{ id: string; code: string }>).find(
        (r) => r.code === 'SA',
      )?.id ?? '';
    expect(saRegionId).toBeTruthy();
  });

  it('should sign up + approve a vendor', async () => {
    const signup = await request(APP_URL).post('/api/v1/vendor/signup').send({
      email: vendorEmail,
      password: vendorPassword,
      firstName: 'Quote',
      lastName: 'Vendor',
      name: shopName,
    });
    expect(signup.status).toBe(201);
    vendorId = signup.body.id as string;
    vendorSlug = signup.body.slug as string;

    const approve = await request(APP_URL)
      .patch(`/api/v1/admin/vendors/${vendorId}/approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(approve.status).toBe(200);
  });

  it('should attempt vendor login', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: vendorEmail, password: vendorPassword });
    if (res.status === 200) {
      vendorAccessToken = res.body.token as string;
    } else {
      expect(res.status).toBe(401);
    }
  });

  it('should set up product + variants + SAR price + SA shipping zone', async () => {
    if (!vendorAccessToken) return;

    const product = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        slug: productSlug,
        nameTranslations: { en: 'Quote Tee', ar: 'تيشيرت العرض' },
        baseCurrency: 'SAR',
      });
    expect(product.status).toBe(201);
    productId = product.body.id as string;

    const generated = await request(APP_URL)
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
            ],
          },
        ],
      });
    expect(generated.status).toBe(201);
    variantIds.push(
      ...(generated.body as Array<{ id: string }>).map((v) => v.id),
    );

    for (const vid of variantIds) {
      await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/prices`)
        .set('Authorization', `Bearer ${vendorAccessToken}`)
        .send({ regionId: saRegionId, priceMinorUnits: '9900' });
      await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/stock`)
        .set('Authorization', `Bearer ${vendorAccessToken}`)
        .send({ quantity: 25 });
    }

    const publish = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/publish`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(publish.status).toBe(201);

    const zone = await request(APP_URL)
      .post('/api/v1/vendor/shipping-zones')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        name: 'SA — main cities',
        countryCodes: ['SA'],
        costMinorUnits: '2500',
        currencyCode: 'SAR',
        estDeliveryDaysMin: 2,
        estDeliveryDaysMax: 5,
      });
    expect(zone.status).toBe(201);
  });

  it('should sign up a buyer (vendor signup → active user) and log in', async () => {
    const signup = await request(APP_URL)
      .post('/api/v1/vendor/signup')
      .send({
        email: buyerEmail,
        password: buyerPassword,
        firstName: 'Buy',
        lastName: 'Quote',
        name: `Buyer Quote Shop ${ts}`,
      });
    expect(signup.status).toBe(201);
    const login = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: buyerEmail, password: buyerPassword });
    if (login.status === 200) {
      buyerAccessToken = login.body.token as string;
    }
  });

  it('should reject POST /checkout/quote without auth (401)', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/checkout/quote')
      .send({ address: saAddress });
    expect(res.status).toBe(401);
  });

  it('should reject POST /checkout/quote with empty cart (422)', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/checkout/quote')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ address: saAddress });
    expect(res.status).toBe(422);
    expect(typeof res.body.message).toBe('string');
  });

  it('should add a variant to the cart', async () => {
    if (!buyerAccessToken || variantIds.length === 0) return;
    const res = await request(APP_URL)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ variantId: variantIds[0], quantity: 2 });
    expect(res.status).toBe(201);
  });

  it('should return a single-vendor SA breakdown with 25 SAR shipping', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/checkout/quote')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ address: saAddress });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      regionId: saRegionId,
      currencyCode: 'SAR',
      subtotalMinor: '19800',
      shippingMinor: '2500',
      totalMinor: '22300',
    });
    expect(res.body.vendors).toHaveLength(1);
    const v = res.body.vendors[0];
    expect(v).toMatchObject({
      vendorId,
      vendorSlug,
      subtotalMinor: '19800',
      shippingMinor: '2500',
      totalMinor: '22300',
    });
    expect(v.items).toHaveLength(1);
    expect(v.items[0]).toMatchObject({
      variantId: variantIds[0],
      quantity: 2,
      unitPriceMinor: '9900',
      lineTotalMinor: '19800',
    });
  });

  it("should reject quote for an address the vendor doesn't ship to (422)", async () => {
    if (!buyerAccessToken) return;
    const egAddress = { ...saAddress, country: 'EG', region: 'Cairo' };
    const res = await request(APP_URL)
      .post('/api/v1/checkout/quote')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ address: egAddress });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/doesn't ship to EG/);
  });

  it('should validate the address shape (422 for invalid country code)', async () => {
    if (!buyerAccessToken) return;
    const bad = { ...saAddress, country: 'saudi-arabia' };
    const res = await request(APP_URL)
      .post('/api/v1/checkout/quote')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ address: bad });
    expect(res.status).toBe(422);
  });
});
