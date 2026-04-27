import { Test } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  it('should return PONG from ping', async () => {
    const fakeClient = { ping: jest.fn().mockResolvedValue('PONG') };
    const moduleRef = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: 'REDIS_CLIENT', useValue: fakeClient },
      ],
    }).compile();

    const svc = moduleRef.get(RedisService);
    await expect(svc.ping()).resolves.toBe('PONG');
    expect(fakeClient.ping).toHaveBeenCalled();
  });

  it('should expose the underlying client via raw()', () => {
    const fakeClient = { ping: jest.fn() };
    const svc = new RedisService(
      fakeClient as unknown as import('ioredis').default,
    );
    expect(svc.raw()).toBe(fakeClient);
  });
});
