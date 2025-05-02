import { Expose } from 'class-transformer';

export class BaseResponse<T = any> {
  @Expose()
  statusCode: number;

  @Expose()
  data: T;

  @Expose({ groups: ['admin'] })
  headers?: Record<string, any>;

  constructor(statusCode: number, data: T, headers?: Record<string, any>) {
    this.statusCode = statusCode;
    this.data = data;
    this.headers = headers;
  }
}
