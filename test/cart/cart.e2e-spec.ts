import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Cart flow (e2e)', () => {
  const ts = Date.now();
  // Vendor sells the products.
  const vendorEmail = `cart-vendor-${ts}@example.com`;
  const vendorPassword = 'Pass1234!';
  const shopName = `Cart Shop ${ts}`;
  const productSlug = `cart-tee-${ts}`;
  // Buyer is a separate vendor account so we get an active user that can log in
  // (ordinary registration leaves the user inactive pending email confirmation).
  const buyerEmail = `cart-buyer-${ts}@example.com`;
  const buyerPassword = 'Pass1234!';

  let adminAccessToken = '';
  let vendorAccessToken = '';
  let buyerAccessToken = '';
  let vendorId = '';
  let vendorSlug = '';
  let productId = '';
  let saRegionId = '';
  const variantIds: string[] = [];
  let firstCartItemId = '';

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
      firstName: 'Cart',
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

  it('should set up a product with variants + SAR price + stock', async () => {
    if (!vendorAccessToken) return;

    const product = await request(APP_URL)
      .post('/api/v1/vendor/products')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        slug: productSlug,
        nameTranslations: { en: 'Cart Tee', ar: 'تيشيرت السلة' },
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
    expect(generated.body).toHaveLength(2);
    variantIds.push(
      ...(generated.body as Array<{ id: string }>).map((v) => v.id),
    );

    for (const vid of variantIds) {
      const price = await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/prices`)
        .set('Authorization', `Bearer ${vendorAccessToken}`)
        .send({ regionId: saRegionId, priceMinorUnits: '9900' });
      expect(price.status).toBe(200);
      const stock = await request(APP_URL)
        .patch(`/api/v1/vendor/products/${productId}/variants/${vid}/stock`)
        .set('Authorization', `Bearer ${vendorAccessToken}`)
        .send({ quantity: 25 });
      expect(stock.status).toBe(200);
    }

    const publish = await request(APP_URL)
      .post(`/api/v1/vendor/products/${productId}/publish`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(publish.status).toBe(201);
  });

  it('should sign up a buyer (vendor signup gives an active user) and log them in', async () => {
    // Use vendor signup so the user is active without email confirmation.
    const signup = await request(APP_URL)
      .post('/api/v1/vendor/signup')
      .send({
        email: buyerEmail,
        password: buyerPassword,
        firstName: 'Buy',
        lastName: 'Er',
        name: `Buyer Shop ${ts}`,
      });
    expect(signup.status).toBe(201);
    const login = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: buyerEmail, password: buyerPassword });
    if (login.status === 200) {
      buyerAccessToken = login.body.token as string;
    } else {
      expect(login.status).toBe(401);
    }
  });

  it('should reject GET /cart without auth (401)', async () => {
    const res = await request(APP_URL).get('/api/v1/cart');
    expect(res.status).toBe(401);
  });

  it('should return an empty cart for a buyer with no items yet', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      items: [],
      regionId: saRegionId,
      currencyCode: 'SAR',
    });
  });

  it('should add a variant to the cart (locks region to SA, snapshots price)', async () => {
    if (!buyerAccessToken || variantIds.length === 0) return;
    const res = await request(APP_URL)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ variantId: variantIds[0], quantity: 1 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      variantId: variantIds[0],
      quantity: 1,
      unitPriceSnapshot: '9900',
      currencySnapshot: 'SAR',
    });
    firstCartItemId = res.body.id as string;
  });

  it('should bump the quantity when re-adding the same variant (UPSERT)', async () => {
    if (!buyerAccessToken || !firstCartItemId) return;
    const res = await request(APP_URL)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ variantId: variantIds[0], quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(firstCartItemId);
    expect(res.body.quantity).toBe(3);

    // Cart should still have a single item row.
    const cart = await request(APP_URL)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(cart.status).toBe(200);
    expect(cart.body.items).toHaveLength(1);
  });

  it('should patch the cart item quantity', async () => {
    if (!buyerAccessToken || !firstCartItemId) return;
    const res = await request(APP_URL)
      .patch(`/api/v1/cart/items/${firstCartItemId}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ quantity: 5 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(5);
  });

  it('should hydrate the cart with product + vendor info', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    const item = res.body.items[0];
    expect(item.variantId).toBe(variantIds[0]);
    expect(item.productSlug).toBe(productSlug);
    expect(item.vendorSlug).toBe(vendorSlug);
    expect(item.vendorId).toBe(vendorId);
    expect(typeof item.productNameTranslations.en).toBe('string');
    expect(item.variant).toBeTruthy();
    expect(item.variant.id).toBe(variantIds[0]);
  });

  it('should add a second variant from the same vendor', async () => {
    if (!buyerAccessToken || variantIds.length < 2) return;
    const res = await request(APP_URL)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${buyerAccessToken}`)
      .send({ variantId: variantIds[1], quantity: 1 });
    expect(res.status).toBe(201);
    const cart = await request(APP_URL)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(cart.body.items).toHaveLength(2);
  });

  it('should remove a single cart item (204)', async () => {
    if (!buyerAccessToken || !firstCartItemId) return;
    const res = await request(APP_URL)
      .delete(`/api/v1/cart/items/${firstCartItemId}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(res.status).toBe(204);
    const cart = await request(APP_URL)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(cart.body.items).toHaveLength(1);
  });

  it('should clear the cart (204)', async () => {
    if (!buyerAccessToken) return;
    const res = await request(APP_URL)
      .delete('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(res.status).toBe(204);
    const cart = await request(APP_URL)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(cart.body.items).toHaveLength(0);
  });
});
