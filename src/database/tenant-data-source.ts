import { DataSource, DataSourceOptions } from 'typeorm';
import { Tenant } from '../tenants/domain/tenant';
/**
 * Manages database connections for tenants
 * Maintains connection pool for each tenant
 */
export class TenantDataSource {
  private static coreDataSource: DataSource;
  private static tenantConnections = new Map<string, DataSource>();

  /**
   * Initialize core database connection
   */
  static async initializeCore(config: DataSourceOptions): Promise<void> {
    this.coreDataSource = new DataSource(config);
    await this.coreDataSource.initialize();
    console.log('Core database connected');
  }

  /**
   * Initialize or retrieve tenant database connection
   */
  static async getTenantDataSource(
    tenantId: string,
  ): Promise<DataSource | undefined> {
    if (this.tenantConnections.has(tenantId)) {
      return this.tenantConnections.get(tenantId);
    }

    const tenant: any = await this.coreDataSource
      .getRepository(Tenant)
      .findOneBy({ id: tenantId });
    if (!tenant) throw new Error(`Tenant ${tenantId} not found`);

    const ds = new DataSource({
      type: 'postgres',
      ...tenant.databaseConfig,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/tenant/*{.ts,.js}'],
    });

    await ds.initialize();
    this.tenantConnections.set(tenantId, ds);
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
