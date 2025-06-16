import { DataSource, DataSourceOptions } from 'typeorm';
import { TenantEntity } from '../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { TenantConnectionConfig } from './config/database-config.type';
import { TypeOrmConfigService } from './typeorm-config.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

/**
 * Manages database connections for tenants
 * Supports:
 * - Separate databases
 * - Separate schemas
 * - Row-based tenancy
 */
export class TenantDataSource {
  private static coreDataSource: DataSource;
  private static tenantConnections = new Map<string, DataSource>();

  /**
   * Initialize core database connection (for tenant metadata)
   */
  // static async initializeCore(config: DataSourceOptions): Promise<void> {
  //   console.log(
  //     `Initializing core database with config:`, // ${JSON.stringify(config)}
  //   );
  //   this.coreDataSource = new DataSource(config);
  //   await this.coreDataSource.initialize();
  //   console.log('Core database connected');
  // }
  static async initializeCore(
    configService: ConfigService<AllConfigType>,
  ): Promise<void> {
    const typeOrmConfigService = new TypeOrmConfigService(configService);
    const options: any = typeOrmConfigService.createTypeOrmOptions();

    this.coreDataSource = new DataSource({
      ...options,
      synchronize: false, // avoid auto sync in prod
    });

    await this.coreDataSource.initialize();
    console.log('Core database connected');
  }

  /**
   * Get tenant-specific data source
   * Creates new connection if doesn't exist
   */
  static async getTenantDataSource(tenantId: string): Promise<DataSource> {
    console.log(`Fetching tenant data source for tenant: ${tenantId}`);
    // Return existing connection if available
    if (this.tenantConnections.has(tenantId)) {
      return this.tenantConnections.get(tenantId)!;
    }

    // Fetch tenant config from core database
    const tenant = await this.coreDataSource
      .getRepository(TenantEntity)
      .findOne({
        where: { id: tenantId },
        relations: ['databaseConfig'],
      });
    // if (!tenant || !tenant.databaseConfig) {
    //   throw new Error(`Tenant ${tenantId} configuration not found`);
    // }

    let ds: DataSource;

    if (tenant?.databaseConfig) {
      // Create new tenant-specific connection
      ds = await this.initializeTenant(tenantId, {
        ...tenant.databaseConfig,
        type: 'postgres',
      });
      console.log(`Using tenant database for tenant: ${tenantId}`);
    } else {
      // Fallback to core with tenant context
      ds = this.coreDataSource;
      console.log(`Using core database for tenant: ${tenantId}`);
    }

    this.tenantConnections.set(tenantId, ds);
    return ds;
  }

  /**
   * Initialize tenant database connection based on config
   */
  private static async initializeTenant(
    tenantId: string,
    config: TenantConnectionConfig,
  ): Promise<DataSource> {
    console.log(`Initializing tenant database for: ${tenantId}`);
    const connectionOptions: DataSourceOptions = {
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      schema: config.schema || 'public',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/tenant/*{.ts,.js}'],
      logging: false,
      extra: {
        // Set application_name for connection identification
        application_name: `tenant_${tenantId}`,
      },
    };

    const ds = new DataSource(connectionOptions);
    await ds.initialize();
    console.log(`Tenant database connected: ${tenantId}`);
    return ds;
  }

  /**
   * Get core database connection (for tenant metadata)
   */
  static getCoreDataSource(): DataSource {
    console.log('Fetching core database connection');
    if (!this.coreDataSource) {
      throw new Error('Core database not initialized');
    }
    return this.coreDataSource;
  }
}
