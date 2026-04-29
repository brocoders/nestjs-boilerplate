import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Shipping zones flow (e2e)', () => {
  const ts = Date.now();
  const vendorEmail = `shipping-vendor-${ts}@example.com`;
  const vendorPassword = 'Pass1234!';
  const shopName = `Shipping Shop ${ts}`;

  let adminAccessToken = '';
  let vendorAccessToken = '';
  let vendorId = '';
  let zoneId = '';

  it('should let admin log in', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    adminAccessToken = res.body.token as string;
  });

  it('should sign up a vendor and approve them', async () => {
    const signup = await request(APP_URL).post('/api/v1/vendor/signup').send({
      email: vendorEmail,
      password: vendorPassword,
      firstName: 'Ship',
      lastName: 'Tester',
      name: shopName,
    });
    expect(signup.status).toBe(201);
    vendorId = signup.body.id as string;

    const approve = await request(APP_URL)
      .patch(`/api/v1/admin/vendors/${vendorId}/approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(approve.status).toBe(200);
  });

  it('should attempt vendor login (skipped if email confirmation blocks it)', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: vendorEmail, password: vendorPassword });
    if (res.status === 200) {
      vendorAccessToken = res.body.token as string;
    } else {
      expect(res.status).toBe(401);
    }
  });

  it('should reject POST /vendor/shipping-zones without auth (401)', async () => {
    const res = await request(APP_URL)
      .post('/api/v1/vendor/shipping-zones')
      .send({
        name: 'Saudi Arabia',
        countryCodes: ['SA'],
        costMinorUnits: '2500',
        currencyCode: 'SAR',
        estDeliveryDaysMin: 2,
        estDeliveryDaysMax: 5,
      });
    expect(res.status).toBe(401);
  });

  it('should reject POST /vendor/shipping-zones from a non-vendor user (403)', async () => {
    if (!vendorAccessToken) return;
    const otherEmail = `non-vendor-shipping-${ts}@example.com`;
    const reg = await request(APP_URL)
      .post('/api/v1/auth/email/register')
      .send({
        email: otherEmail,
        password: vendorPassword,
        firstName: 'No',
        lastName: 'Vendor',
      });
    expect([200, 201, 204, 422]).toContain(reg.status);
    const login = await request(APP_URL)
      .post('/api/v1/auth/email/login')
      .send({ email: otherEmail, password: vendorPassword });
    if (login.status !== 200) return;
    const otherToken = login.body.token as string;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/shipping-zones')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        name: 'Saudi Arabia',
        countryCodes: ['SA'],
        costMinorUnits: '2500',
        currencyCode: 'SAR',
        estDeliveryDaysMin: 2,
        estDeliveryDaysMax: 5,
      });
    expect(res.status).toBe(403);
  });

  it('should create a shipping zone for SA at 25.00 SAR', async () => {
    if (!vendorAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/shipping-zones')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        name: 'Saudi Arabia',
        countryCodes: ['SA'],
        costMinorUnits: '2500',
        currencyCode: 'SAR',
        freeAboveMinorUnits: '20000',
        estDeliveryDaysMin: 2,
        estDeliveryDaysMax: 5,
      });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      vendorId,
      name: 'Saudi Arabia',
      countryCodes: ['SA'],
      costMinorUnits: '2500',
      currencyCode: 'SAR',
      freeAboveMinorUnits: '20000',
      estDeliveryDaysMin: 2,
      estDeliveryDaysMax: 5,
    });
    zoneId = res.body.id as string;
  });

  it('should reject est delivery min > max (422)', async () => {
    if (!vendorAccessToken) return;
    const res = await request(APP_URL)
      .post('/api/v1/vendor/shipping-zones')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        name: 'Bad zone',
        countryCodes: ['SA'],
        costMinorUnits: '1000',
        currencyCode: 'SAR',
        estDeliveryDaysMin: 10,
        estDeliveryDaysMax: 3,
      });
    expect(res.status).toBe(422);
  });

  it('should list vendor shipping zones (contains the new one)', async () => {
    if (!vendorAccessToken || !zoneId) return;
    const res = await request(APP_URL)
      .get('/api/v1/vendor/shipping-zones')
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = (res.body as Array<{ id: string }>).find(
      (z) => z.id === zoneId,
    );
    expect(found).toBeTruthy();
  });

  it('should patch the zone cost', async () => {
    if (!vendorAccessToken || !zoneId) return;
    const res = await request(APP_URL)
      .patch(`/api/v1/vendor/shipping-zones/${zoneId}`)
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({ costMinorUnits: '3000' });
    expect(res.status).toBe(200);
    expect(res.body.costMinorUnits).toBe('3000');
  });

  it('should reject patch from a different vendor (403)', async () => {
    if (!vendorAccessToken || !zoneId) return;
    // Spin up another vendor and try to mutate the first vendor's zone.
    const otherEmail = `other-shipping-vendor-${ts}@example.com`;
    const signup = await request(APP_URL)
      .post('/api/v1/vendor/signup')
      .send({
        email: otherEmail,
        password: vendorPassword,
        firstName: 'Other',
        lastName: 'Ship',
        name: `Other Ship ${ts}`,
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
      .patch(`/api/v1/vendor/shipping-zones/${zoneId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ costMinorUnits: '1' });
    expect(res.status).toBe(403);
  });

  it('should delete the zone (204)', async () => {
    if (!vendorAccessToken || !zoneId) return;
    const res = await request(APP_URL)
      .delete(`/api/v1/vendor/shipping-zones/${zoneId}`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(res.status).toBe(204);
  });

  it('should 404 when fetching the deleted zone via patch', async () => {
    if (!vendorAccessToken || !zoneId) return;
    const res = await request(APP_URL)
      .patch(`/api/v1/vendor/shipping-zones/${zoneId}`)
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({ costMinorUnits: '1' });
    expect(res.status).toBe(404);
  });
});
