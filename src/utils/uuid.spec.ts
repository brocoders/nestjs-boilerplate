import { uuidv7Generate } from './uuid';

describe('uuidv7Generate', () => {
  it('should return a valid v7 UUID', () => {
    const id = uuidv7Generate();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('should return time-ordered IDs', async () => {
    const a = uuidv7Generate();
    await new Promise((r) => setTimeout(r, 5));
    const b = uuidv7Generate();
    expect(a < b).toBe(true);
  });
});
