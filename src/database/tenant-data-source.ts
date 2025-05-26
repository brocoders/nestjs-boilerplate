import { DataSource, DataSourceOptions } from 'typeorm';
import { TenantConnectionConfig } from './config/database-config.type';
/**
 * Manages database connections for tenants
 * Maintains connection pool for each tenant
 */
export class TenantDataSource {
  private static coreDataSource: DataSource;
  // private static tenantConnections = new Map<string, DataSource>();
  private static instances = new Map<string, DataSource>();

  /**
   * Initialize core database connection
   */
  static async initializeCore(config: DataSourceOptions): Promise<void> {
    this.coreDataSource = new DataSource(config);
    await this.coreDataSource.initialize();
    console.log('Core database connected');
  }

  // static async initializeTenantConnection(
  //   tenantId: string,
  // ): Promise<DataSource> {
  //   if (!tenantId) {
  //     throw new Error('Tenant ID is required');
  //   }

  //   if (this.tenantConnections.has(tenantId)) {
  //     return this.tenantConnections.get(tenantId)!;
  //   }

  //   const tenant = await this.coreDataSource
  //     .getRepository(Tenant)
  //     .findOneBy({ id: tenantId });

  //   if (!tenant) {
  //     throw new Error(`Tenant ${tenantId} not found`);
  //   }

  //   const ds = new DataSource({
  //     type: 'postgres',
  //     ...JSON.parse(tenant.databaseConfig),
  //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  //     migrations: [__dirname + '/migrations/tenant/*{.ts,.js}'],
  //   });

  //   try {
  //     await ds.initialize();
  //     this.tenantConnections.set(tenantId, ds);
  //     return ds;
  //   } catch (error) {
  //     throw new Error(`Failed to initialize tenant database: ${error.message}`);
  //   }
  // }

  /**
   * Initialize or retrieve tenant database connection
   */
  // static async getTenantDataSource(
  //   tenantId: string,
  // ): Promise<DataSource | undefined> {
  //   if (this.tenantConnections.has(tenantId)) {
  //     return this.tenantConnections.get(tenantId);
  //   }

  //   const tenant: any = await this.coreDataSource
  //     .getRepository(Tenant)
  //     .findOneBy({ id: tenantId });
  //   if (!tenant) throw new Error(`Tenant ${tenantId} not found`);

  //   const ds = new DataSource({
  //     type: 'postgres',
  //     ...tenant.databaseConfig,
  //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  //     migrations: [__dirname + '/migrations/tenant/*{.ts,.js}'],
  //   });

  //   await ds.initialize();
  //   this.tenantConnections.set(tenantId, ds);
  //   return ds;
  // }
  static getTenantDataSource(tenantId: string): DataSource {
    const ds = this.instances.get(tenantId);
    if (!ds) throw new Error(`No data source for tenant ${tenantId}`);
    return ds;
  }
  static async initializeTenant(
    config: TenantConnectionConfig,
  ): Promise<DataSource> {
    const ds = new DataSource({
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      schema: config.schema,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/tenant/*{.ts,.js}'],
      logging: false,
    });

    await ds.initialize();
    this.instances.set(config.id, ds);
    return ds;
  }

  /**
   * Get core database connection
   */
  static getCoreDataSource(): DataSource {
    if (!this.coreDataSource) throw new Error('Core database not initialized');
    return this.coreDataSource;
  }
}
