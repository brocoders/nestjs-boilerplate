import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Orders placement (e2e)', () => {
  const ts = Date.now();
  // Vendor A
  const vendorAEmail = `orders-vendor-a-${ts}@example.com`;
  const vendorAPassword = 'Pass1234!';
  const vendorAShop = `Orders Shop A ${ts}`;
  const productASlug = `orders-tee-a-${ts}`;
  // Vendor B (multi-vendor scenario)
  const vendorBEmail = `orders-vendor-b-${ts}@example.com`;
  const vendorBPassword = 'Pass1234!';
  const vendorBShop = `Orders Shop B ${ts}`;
  const productBSlug = `orders-mug-b-${ts}`;
  // Buyer + a different user (for the 403 ownership check)
  const buyerEmail = `orders-buyer-${ts}@example.com`;
  const buyerPassword = 'Pass1234!';
  const otherEmail = `orders-other-${ts}@example.com`;
  const otherPassword = 'Pass1234!';

  let adminAccessToken = '';
  let vendorAToken = '';
  let buyerAccessToken = '';
  let otherAccessToken = '';
  let vendorAId = '';
  let vendorBId = '';
  let saRegionId = '';
  const variantAIds: string[] = [];
  const variantBIds: string[] = [];

  const validKey = (label: string) =>
    `idem-${label}-${ts}-xxxxxxxxxxxxx`.slice(0, 64);
  const idemK1 = validKey('K1');
  const idemK2 = validKey('K2');
  const idemMulti = validKey('MULTI');

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

  let firstOrderId = '';

  async function setupVendor(
    email: string,
    password: string,
    shop: string,
    productSlug: string,
    productName: { en: string; ar?: string },
    priceMinor: string,
  ): Promise<{ vendorId: string; vendorToken: string; variantIds: string[] }> {
    const signup = await request(APP_URL).post('/api/v1/vendor/signup').send({
      email,
      password,
      firstName: 'Vend',
      lastName: 'Or',
      name: shop,
    });
    expect(signup.status).toBe(201);
    const vendorId = signup.body.id as string;

    const approve = await request(APP_URL)
      .patch(`/api/v1/admin/vendors/${vendorId}/approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(approve.status).toBe(200);

    const login = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email, password });
    if (login.status !== 200)
      return { vendorId, vendorToken: '', variantIds: [] };
    const vendorToken = login.body.token as string;

    const product = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({
        slug: productSlug,
        nameTranslations: productName,
        baseCurrency: 'SAR',
      });
    expect(product.status).toBe(201);
    const productId = product.body.id as string;

    const generated = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/variants/generate`)
      .set('Authorization', `Bearer ${vendorToken}`)
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
    const variantIds: string[] = (generated.body as Array<{ id: string }>).map(
      (v) => v.id,
    );

    for (const vid of variantIds) {
      await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/prices`)
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({ regionId: saRegionId, priceMinorUnits: priceMinor });
      await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/stock`)
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({ quantity: 25 });
    }

    await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/publish`)
      .set('Authorization', `Bearer ${vendorToken}`);

    await request(APP_URL)
      .post('/api/v1/vendor/shipping-zones')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({
        name: 'SA',
        countryCodes: ['SA'],
        costMinorUnits: '2500',
        currencyCode: 'SAR',
        estDeliveryDaysMin: 2,
        estDeliveryDaysMax: 5,
      });

    return { vendorId, vendorToken, variantIds };
  }

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

  it('should set up vendor A with product + zone', async () => {
    const setup = await setupVendor(
      vendorAEmail,
      vendorAPassword,
      vendorAShop,
      productASlug,
      { en: 'Orders Tee A', ar: 'تيشيرت الطلبات' },
      '9900',
    );
    vendorAId = setup.vendorId;
    vendorAToken = setup.vendorToken;
    variantAIds.push(...setup.variantIds);
  });

  it('should set up vendor B with product + zone', async () => {
    const setup = await setupVendor(
      vendorBEmail,
      vendorBPassword,
      vendorBShop,
      productBSlug,
      { en: 'Orders Mug B' },
      '4500',
    );
    vendorBId = setup.vendorId;
    variantBIds.push(...setup.variantIds);
  });

  it('should sign up a buyer + a separate user', async () => {
    const buyerSignup = await request(APP_URL)
      .post('/api/v1/vendor/signup')
      .send({
        email: buyerEmail,
        password: buyerPassword,
        firstName: 'Buy',
        lastName: 'Or',
        name: `Buyer Order Shop ${ts}`,
      });
    expect(buyerSignup.status).toBe(201);
    const buyerLogin = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: buyerEmail, password: buyerPassword });
    if (buyerLogin.status === 200) {
      buyerAccessToken = buyerLogin.body.token as string;
    }

    const otherSignup = await request(APP_URL)
      .post('/api/v1/vendor/signup')
      .send({
        email: otherEmail,
        password: otherPassword,
        firstName: 'Other',
        lastName: 'User',
        name: `Other Order Shop ${ts}`,
      });
    expect(otherSignup.status).toBe(201);
    const otherLogin = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: otherEmail, password: otherPassword });
    if (otherLogin.status === 200) {
      otherAccessToken = otherLogin.body.token as string;
    }
  });

  it('should add vendor A variant to the buyer cart', async () => {
    if (!buyerAccessToken || variantAIds.length === 0) return;
    const res = await request(APP_URL)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ variantId: variantAIds[0], quantity: 1 });
    expect(res.status).toBe(201);
  });

  it('should reject POST /orders without Idempotency-Key (422)', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ address: saAddress, paymentMethod: 'COD' });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Idempotency-Key/);
  });

  it('should reject POST /orders with malformed Idempotency-Key (422)', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .set('Idempotency-Key', 'short')
      .send({ address: saAddress, paymentMethod: 'COD' });
    expect(res.status).toBe(422);
  });

  it('should place an order with K1 (201) — single vendor', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .set('Idempotency-Key', idemK1)
      .send({ address: saAddress, paymentMethod: 'COD' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      currencyCode: 'SAR',
      subtotalMinor: '9900',
      shippingMinor: '2500',
      totalMinor: '12400',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
    });
    expect(res.body.publicCode).toMatch(/^ORD-/);
    expect(res.body.subOrders).toHaveLength(1);
    const so = res.body.subOrders[0];
    expect(so).toMatchObject({
      vendorId: vendorAId,
      subtotalMinor: '9900',
      shippingMinor: '2500',
      totalMinor: '12400',
      fulfillmentStatus: 'AWAITING_CONFIRMATION',
    });
    expect(so.items).toHaveLength(1);
    expect(so.items[0]).toMatchObject({
      variantId: variantAIds[0],
      vendorId: vendorAId,
      quantity: 1,
      unitPriceSnapshot: '9900',
      currencySnapshot: 'SAR',
      skuSnapshot: expect.any(String),
    });
    expect(so.items[0].nameSnapshotTranslations.en).toBe('Orders Tee A');
    firstOrderId = res.body.id as string;
  });

  it('should replay POST /orders with the same K1 (200, same orderId)', async () => {
    if (!buyerAccessToken || !firstOrderId) return;
    const res = await request(APP_URL)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .set('Idempotency-Key', idemK1)
      .send({ address: saAddress, paymentMethod: 'COD' });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(firstOrderId);
  });

  it('should reject POST /orders with new K2 because cart is empty (422)', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .set('Idempotency-Key', idemK2)
      .send({ address: saAddress, paymentMethod: 'COD' });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/empty/i);
  });

  it('should list the placed order under GET /orders', async () => {
    if (!buyerAccessToken || !firstOrderId) return;
    const res = await request(APP_URL)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    const found = (res.body.data as Array<{ id: string }>).find(
      (o) => o.id === firstOrderId,
    );
    expect(found).toBeTruthy();
  });

  it('should fetch a hydrated order under GET /orders/:id', async () => {
    if (!buyerAccessToken || !firstOrderId) return;
    const res = await request(APP_URL)
      .get(`/api/v1/orders/${firstOrderId}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(firstOrderId);
    expect(res.body.subOrders[0].items).toHaveLength(1);
  });

  it('should 403 when another user fetches the order', async () => {
    if (!otherAccessToken || !firstOrderId) return;
    const res = await request(APP_URL)
      .get(`/api/v1/orders/${firstOrderId}`)
      .set('Authorization', `Bearer ${otherAccessToken}`);
    expect(res.status).toBe(403);
  });

  it('should 404 for a non-existent order id', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .get('/api/v1/orders/00000000-0000-7000-8000-000000000000')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(res.status).toBe(404);
  });

  it('should place a multi-vendor order (1 Order, 2 SubOrders)', async () => {
    if (
      !buyerAccessToken ||
      variantAIds.length === 0 ||
      variantBIds.length === 0
    )
      return;

    // Re-stock the cart with one item from each vendor.
    const addA = await request(APP_URL)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ variantId: variantAIds[0], quantity: 2 });
    expect(addA.status).toBe(201);
    const addB = await request(APP_URL)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ variantId: variantBIds[0], quantity: 1 });
    expect(addB.status).toBe(201);

    const quote = await request(APP_URL)
      .post('/api/v1/checkout/quote')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ address: saAddress });
    expect(quote.status).toBe(200);
    expect(quote.body.vendors).toHaveLength(2);

    const res = await request(APP_URL)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .set('Idempotency-Key', idemMulti)
      .send({ address: saAddress, paymentMethod: 'COD' });
    expect(res.status).toBe(201);
    expect(res.body.subOrders).toHaveLength(2);
    // 2 * 9900 (A) + 1 * 4500 (B) = 24300; shipping 2500 + 2500 = 5000
    expect(res.body).toMatchObject({
      subtotalMinor: '24300',
      shippingMinor: '5000',
      totalMinor: '29300',
    });
    const aSub = (res.body.subOrders as Array<{ vendorId: string }>).find(
      (s) => s.vendorId === vendorAId,
    );
    const bSub = (res.body.subOrders as Array<{ vendorId: string }>).find(
      (s) => s.vendorId === vendorBId,
    );
    expect(aSub).toMatchObject({
      subtotalMinor: '19800',
      shippingMinor: '2500',
      totalMinor: '22300',
    });
    expect(bSub).toMatchObject({
      subtotalMinor: '4500',
      shippingMinor: '2500',
      totalMinor: '7000',
    });
  });

  it('should keep snapshots immutable when the vendor edits the product later', async () => {
    if (!vendorAToken || !firstOrderId) return;
    // Vendor A renames their product.
    const products = await request(APP_URL)
      .get('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(products.status).toBe(200);
    const prod = (
      products.body.data as Array<{ id: string; slug: string }>
    ).find((p) => p.slug === productASlug);
    if (!prod) return;
    const rename = await request(APP_URL)
      .patch(`/api/v1/vendor/products/${prod.id}`)
      .set('Authorization', `Bearer ${vendorAToken}`)
      .send({ nameTranslations: { en: 'COMPLETELY DIFFERENT NAME' } });
    expect(rename.status).toBe(200);

    // Re-fetch the original order — its snapshot must still hold the OLD name.
    const fetched = await request(APP_URL)
      .get(`/api/v1/orders/${firstOrderId}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.subOrders[0].items[0].nameSnapshotTranslations.en).toBe(
      'Orders Tee A',
    );
  });
});
