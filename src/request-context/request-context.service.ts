import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export type RequestContext = {
  regionCode: string;
  localeCode: string;
};

@Injectable()
export class RequestContextService {
  private readonly als = new AsyncLocalStorage<RequestContext>();

  run<T>(ctx: RequestContext, fn: () => T): T {
    return this.als.run(ctx, fn);
  }

  getCurrent(): RequestContext | undefined {
    return this.als.getStore();
  }
}
