import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Vendor incoming orders (e2e)', () => {
  const ts = Date.now();
  // Vendor A
  const vendorAEmail = `vendor-orders-a-${ts}@example.com`;
  const vendorAPassword = 'Pass1234!';
  const vendorAShop = `Vendor Orders Shop A ${ts}`;
  const productASlug = `vendor-orders-tee-a-${ts}`;
  // Vendor B (cross-vendor leak check)
  const vendorBEmail = `vendor-orders-b-${ts}@example.com`;
  const vendorBPassword = 'Pass1234!';
  const vendorBShop = `Vendor Orders Shop B ${ts}`;
  const productBSlug = `vendor-orders-mug-b-${ts}`;
  // Buyer
  const buyerEmail = `vendor-orders-buyer-${ts}@example.com`;
  const buyerPassword = 'Pass1234!';

  let adminAccessToken = '';
  let vendorAToken = '';
  let vendorBToken = '';
  let buyerAccessToken = '';
  let vendorAId = '';
  let vendorBId = '';
  let saRegionId = '';
  const variantAIds: string[] = [];
  const variantBIds: string[] = [];

  let placedOrderId = '';
  let vendorASubOrderId = '';
  let vendorBSubOrderId = '';

  const idemKey = `idem-vorders-${ts}-xxxxxxxxxxxxx`.slice(0, 64);

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
    if (login.status !== 200) {
      return { vendorId, vendorToken: '', variantIds: [] };
    }
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

  it('should set up vendor A and vendor B with products + zones', async () => {
    const a = await setupVendor(
      vendorAEmail,
      vendorAPassword,
      vendorAShop,
      productASlug,
      { en: 'Vendor Orders Tee A' },
      '9900',
    );
    vendorAId = a.vendorId;
    vendorAToken = a.vendorToken;
    variantAIds.push(...a.variantIds);

    const b = await setupVendor(
      vendorBEmail,
      vendorBPassword,
      vendorBShop,
      productBSlug,
      { en: 'Vendor Orders Mug B' },
      '4500',
    );
    vendorBId = b.vendorId;
    vendorBToken = b.vendorToken;
    variantBIds.push(...b.variantIds);
  });

  it('should sign up the buyer and log in', async () => {
    const signup = await request(APP_URL)
      .post('/api/v1/vendor/signup')
      .send({
        email: buyerEmail,
        password: buyerPassword,
        firstName: 'Buy',
        lastName: 'Or',
        name: `Vendor Orders Buyer Shop ${ts}`,
      });
    expect(signup.status).toBe(201);
    const login = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: buyerEmail, password: buyerPassword });
    expect(login.status).toBe(200);
    buyerAccessToken = login.body.token as string;
  });

  it('should add one variant from each vendor to the buyer cart', async () => {
    if (
      !buyerAccessToken ||
      variantAIds.length === 0 ||
      variantBIds.length === 0
    ) {
      throw new Error('preconditions not met');
    }
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
  });

  it('should place a multi-vendor order (1 Order, 2 SubOrders)', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .set('Idempotency-Key', idemKey)
      .send({ address: saAddress, paymentMethod: 'COD' });
    expect(res.status).toBe(201);
    expect(res.body.subOrders).toHaveLength(2);
    placedOrderId = res.body.id as string;

    const subOrders = res.body.subOrders as Array<{
      id: string;
      vendorId: string;
    }>;
    vendorASubOrderId = subOrders.find((s) => s.vendorId === vendorAId)!.id;
    vendorBSubOrderId = subOrders.find((s) => s.vendorId === vendorBId)!.id;
    expect(vendorASubOrderId).toBeTruthy();
    expect(vendorBSubOrderId).toBeTruthy();
    expect(placedOrderId).toBeTruthy();
  });

  it('should reject GET /vendor/orders without auth (401)', async () => {
    const res = await request(APP_URL).get('/api/v1/vendor/orders');
    expect(res.status).toBe(401);
  });

  it('should let vendor A see only their SubOrder via GET /vendor/orders', async () => {
    const res = await request(APP_URL)
      .get('/api/v1/vendor/orders')
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    const ids = (res.body.data as Array<{ id: string; vendorId: string }>).map(
      (r) => r.id,
    );
    expect(ids).toContain(vendorASubOrderId);
    expect(ids).not.toContain(vendorBSubOrderId);
    // Every row must belong to vendor A.
    for (const row of res.body.data as Array<{ vendorId: string }>) {
      expect(row.vendorId).toBe(vendorAId);
    }
  });

  it('should include itemCount + buyer order context in list rows', async () => {
    const res = await request(APP_URL)
      .get('/api/v1/vendor/orders')
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(200);
    const row = (
      res.body.data as Array<{
        id: string;
        itemCount: number;
        order: {
          publicCode: string;
          placedAt: string;
          buyerName: string;
          city: string;
          country: string;
        };
      }>
    ).find((r) => r.id === vendorASubOrderId);
    expect(row).toBeTruthy();
    // 2 of variant A
    expect(row!.itemCount).toBe(2);
    expect(row!.order.publicCode).toMatch(/^ORD-/);
    expect(row!.order.buyerName).toBe('Layla Al-Mansour');
    expect(row!.order.city).toBe('Riyadh');
    expect(row!.order.country).toBe('SA');
  });

  it('should filter by status=AWAITING_CONFIRMATION (returns the row)', async () => {
    const res = await request(APP_URL)
      .get('/api/v1/vendor/orders?status=AWAITING_CONFIRMATION')
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(200);
    const ids = (res.body.data as Array<{ id: string }>).map((r) => r.id);
    expect(ids).toContain(vendorASubOrderId);
  });

  it('should filter by status=DELIVERED and return empty', async () => {
    const res = await request(APP_URL)
      .get('/api/v1/vendor/orders?status=DELIVERED')
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(200);
    const ids = (res.body.data as Array<{ id: string }>).map((r) => r.id);
    expect(ids).not.toContain(vendorASubOrderId);
  });

  it('should reject malformed status filter (422)', async () => {
    const res = await request(APP_URL)
      .get('/api/v1/vendor/orders?status=NOT_A_STATUS')
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(422);
  });

  it('should let vendor A get full detail for their SubOrder', async () => {
    const res = await request(APP_URL)
      .get(`/api/v1/vendor/orders/${vendorASubOrderId}`)
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(vendorASubOrderId);
    expect(res.body.vendorId).toBe(vendorAId);
    expect(res.body.fulfillmentStatus).toBe('AWAITING_CONFIRMATION');
    // 2 * 9900 = 19800 subtotal, 2500 ship, 22300 total
    expect(res.body.subtotalMinor).toBe('19800');
    expect(res.body.shippingMinor).toBe('2500');
    expect(res.body.totalMinor).toBe('22300');
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toMatchObject({
      variantId: variantAIds[0],
      quantity: 2,
      unitPriceSnapshot: '9900',
      currencySnapshot: 'SAR',
    });
    expect(res.body.order.publicCode).toMatch(/^ORD-/);
    expect(res.body.order.currencyCode).toBe('SAR');
    expect(res.body.order.paymentStatus).toBe('PENDING');
    // Full address only on detail endpoint
    expect(res.body.order.addressSnapshot).toMatchObject({
      fullName: 'Layla Al-Mansour',
      city: 'Riyadh',
      country: 'SA',
      street: 'King Fahd Rd, Bldg 14, Apt 3',
      phone: '+966555012345',
    });
  });

  it("should 404 when vendor A asks for vendor B's SubOrder (no leak)", async () => {
    const res = await request(APP_URL)
      .get(`/api/v1/vendor/orders/${vendorBSubOrderId}`)
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(404);
  });

  it("should let vendor B see their own SubOrder, not vendor A's", async () => {
    const list = await request(APP_URL)
      .get('/api/v1/vendor/orders')
      .set('Authorization', `Bearer ${vendorBToken}`);
    expect(list.status).toBe(200);
    const ids = (list.body.data as Array<{ id: string }>).map((r) => r.id);
    expect(ids).toContain(vendorBSubOrderId);
    expect(ids).not.toContain(vendorASubOrderId);

    const detail = await request(APP_URL)
      .get(`/api/v1/vendor/orders/${vendorASubOrderId}`)
      .set('Authorization', `Bearer ${vendorBToken}`);
    expect(detail.status).toBe(404);
  });

  it('should 404 for a non-existent sub-order id', async () => {
    const res = await request(APP_URL)
      .get('/api/v1/vendor/orders/00000000-0000-7000-8000-000000000000')
      .set('Authorization', `Bearer ${vendorAToken}`);
    expect(res.status).toBe(404);
  });
});
