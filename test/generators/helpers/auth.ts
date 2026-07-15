import request from 'supertest';

import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../../utils/constants';

export interface AdminSession {
  token: string;
  adminId: string | number;
}

export async function loginAsAdmin(): Promise<AdminSession> {
  const response = await request(APP_URL)
    .post('/api/v1/auth/email/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

  if (response.status !== 200) {
    throw new Error(
      `Admin login failed: HTTP ${response.status} ${JSON.stringify(response.body)}`,
    );
  }

  return {
    token: response.body.token,
    adminId: response.body.user.id,
  };
}
