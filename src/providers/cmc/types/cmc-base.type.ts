import { ApiFunction } from 'src/common/api-gateway/types/api-gateway.type';

export type EndpointKey = keyof Record<string, ApiFunction>;

export class CmcCategoryInfo {
  /** Path prefix for the API group (e.g. `/cryptocurrency`) */
  path: string;

  /** Human-readable description of what this group provides */
  description: string;

  constructor(path: string, description: string) {
    this.path = path;
    this.description = description;
  }
}

export type CmcStatus = {
  timestamp: string;
  error_code: number; // 0 on success
  error_message: string | null;
  elapsed: number; // ms
  credit_count: number;
  notice?: string | null;
};

export type CmcEnvelope<T = any> = {
  data?: T;
  status: CmcStatus;
};
