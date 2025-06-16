// export type DatabaseConfig = {
//   isDocumentDatabase: boolean;
//   url?: string;
//   type?: string;
//   host?: string;
//   port?: number;
//   password?: string;
//   name?: string;
//   username?: string;
//   synchronize?: boolean;
//   maxConnections: number;
//   sslEnabled?: boolean;
//   rejectUnauthorized?: boolean;
//   ca?: string;
//   key?: string;
//   cert?: string;
// };

import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

export type DatabaseConfig = {
  isMultiTenant: boolean;
  core: DataSourceOptions;
  tenantPrefix: string;
  tenantConfig: {
    type: 'database' | 'schema';
    defaultHost: string;
    defaultPort: number;
    defaultUsername: string;
    defaultPassword: string;
  };
  isDocumentDatabase: boolean;
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};

export type TenantConnectionConfig = {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema?: string;
};
