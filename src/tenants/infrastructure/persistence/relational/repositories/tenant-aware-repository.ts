// import { DataSource, EntityTarget } from 'typeorm';

// export class TenantAwareRepository<Entity extends { tenantId: string }> {
//   constructor(
//     protected readonly dataSource: DataSource,
//     protected readonly entityClass: EntityTarget<Entity>,
//   ) {}

//   async findAll(tenantId: string): Promise<Entity[]> {
//     return this.dataSource.manager.find(this.entityClass, {
//       where: { tenantId },
//     });
//   }

//   async createForTenant(
//     tenantId: string,
//     data: Omit<Entity, 'tenantId'>,
//   ): Promise<Entity> {
//     const entity = this.dataSource.manager.create(this.entityClass, {
//       ...data,
//       tenantId,
//     });
//     return this.dataSource.manager.save(entity);
//   }
// }
