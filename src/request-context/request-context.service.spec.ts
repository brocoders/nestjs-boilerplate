import { RequestContextService } from './request-context.service';

describe('RequestContextService', () => {
  let svc: RequestContextService;

  beforeEach(() => {
    svc = new RequestContextService();
  });

  it('should return undefined outside a context', () => {
    expect(svc.getCurrent()).toBeUndefined();
  });

  it('should expose the value inside run()', () => {
    svc.run({ regionCode: 'EG', localeCode: 'ar' }, () => {
      expect(svc.getCurrent()).toEqual({ regionCode: 'EG', localeCode: 'ar' });
    });
  });

  it('should isolate concurrent contexts', async () => {
    const results: string[] = [];
    await Promise.all([
      new Promise<void>((resolve) =>
        svc.run({ regionCode: 'SA', localeCode: 'ar' }, () => {
          setTimeout(() => {
            results.push(svc.getCurrent()!.regionCode);
            resolve();
          }, 10);
        }),
      ),
      new Promise<void>((resolve) =>
        svc.run({ regionCode: 'EG', localeCode: 'en' }, () => {
          setTimeout(() => {
            results.push(svc.getCurrent()!.regionCode);
            resolve();
          }, 5);
        }),
      ),
    ]);
    expect(results.sort()).toEqual(['EG', 'SA']);
  });
});
