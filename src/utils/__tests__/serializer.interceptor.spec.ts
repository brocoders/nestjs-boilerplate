import { ResolvePromisesInterceptor } from '../serializer.interceptor';
import { of, lastValueFrom } from 'rxjs';

class DummyHandler {
  handle() {
    return of(Promise.resolve({ a: 1 }));
  }
}

describe('ResolvePromisesInterceptor', () => {
  it('should resolve nested promises in response', async () => {
    const interceptor = new ResolvePromisesInterceptor();
    const result = await lastValueFrom(
      interceptor.intercept({} as any, new DummyHandler() as any),
    );
    expect(result).toEqual({ a: 1 });
  });
});
