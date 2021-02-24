import * as request from 'supertest';
import {
  APP_URL,
  TESTER_EMAIL,
  TESTER_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
} from '../utils/constants';

describe('Auth user (e2e)', () => {
  const app = APP_URL;
  const mail = `http://${MAIL_HOST}:${MAIL_PORT}`;
  const newUserFirstName = `Tester${Date.now()}`;
  const newUserLastName = `E2E`;
  const newUserEmail = `user.${Date.now()}@example.com`;
  const newUserPassword = `secret`;

  it('Login: /api/v1/auth/login/email (POST)', () => {
    return request(app)
      .post('/api/v1/auth/login/email')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('Login via admin endpoint: /api/v1/auth/admin/login/email (POST)', () => {
    return request(app)
      .post('/api/v1/auth/admin/login/email ')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .expect(422);
  });

  it('Do not allow register user with exists email: /api/v1/auth/register/email (POST)', () => {
    return request(app)
      .post('/api/v1/auth/register/email')
      .send({
        email: TESTER_EMAIL,
        password: TESTER_PASSWORD,
        firstName: 'Tester',
        lastName: 'E2E',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.email).toBeDefined();
      });
  });

  it('Register new user: /api/v1/auth/register/email (POST)', async () => {
    return request(app)
      .post('/api/v1/auth/register/email')
      .send({
        email: newUserEmail,
        password: newUserPassword,
        firstName: newUserFirstName,
        lastName: newUserLastName,
      })
      .expect(201);
  });

  it('Login unconfirmed user: /api/v1/auth/login/email (POST)', () => {
    return request(app)
      .post('/api/v1/auth/login/email')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('Confirm email: /api/v1/auth/confirm/email (POST)', async () => {
    const hash = await request(mail)
      .get('/email')
      .then(({ body }) =>
        body
          .find(
            (letter) =>
              letter.to[0].address === newUserEmail &&
              /.*confirm\-email\/(\w+).*/g.test(letter.text),
          )
          ?.text.replace(/.*confirm\-email\/(\w+).*/g, '$1'),
      );

    return request(app)
      .post('/api/v1/auth/confirm/email')
      .send({
        hash,
      })
      .expect(200);
  });

  it('Login confirmed user: /api/v1/auth/login/email (POST)', () => {
    return request(app)
      .post('/api/v1/auth/login/email')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('New user update profile: /api/v1/auth/me (PATCH)', async () => {
    const newUserNewName = Date.now();
    const newUserNewPassword = 'new-secret';
    const newUserApiToken = await request(app)
      .post('/api/v1/auth/login/email')
      .send({ email: newUserEmail, password: newUserPassword })
      .then(({ body }) => body.token);

    await request(app)
      .patch('/api/v1/auth/me')
      .auth(newUserApiToken, {
        type: 'bearer',
      })
      .send({
        firstName: newUserNewName,
        password: newUserNewPassword,
        oldPassword: newUserPassword,
      });

    await request(app)
      .post('/api/v1/auth/login/email')
      .send({ email: newUserEmail, password: newUserNewPassword })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });

    await request(app)
      .patch('/api/v1/auth/me')
      .auth(newUserApiToken, {
        type: 'bearer',
      })
      .send({ password: newUserPassword, oldPassword: newUserNewPassword });
  });

  it('New user delete profile: /api/v1/auth/me (DELETE)', async () => {
    const newUserApiToken = await request(app)
      .post('/api/v1/auth/login/email')
      .send({ email: newUserEmail, password: newUserPassword })
      .then(({ body }) => body.token);

    await request(app).delete('/api/v1/auth/me').auth(newUserApiToken, {
      type: 'bearer',
    });

    return request(app)
      .post('/api/v1/auth/login/email')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(422);
  });
});
