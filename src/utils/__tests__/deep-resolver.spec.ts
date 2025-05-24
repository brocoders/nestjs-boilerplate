import deepResolve from '../deep-resolver';

describe('deepResolve', () => {
  it('should resolve nested promises and objects', async () => {
    const input = {
      a: Promise.resolve(1),
      b: [Promise.resolve(2), 3, { c: Promise.resolve(4) }],
    };

    const result = await deepResolve(input);

    expect(result).toEqual({ a: 1, b: [2, 3, { c: 4 }] });
  });

  it('should return primitives directly', async () => {
    expect(await deepResolve(5)).toBe(5);
  });
});
