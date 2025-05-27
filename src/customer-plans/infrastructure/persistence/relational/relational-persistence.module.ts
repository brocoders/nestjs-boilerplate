import { Module } from '@nestjs/common';
import { CustomerPlanRepository } from '../customer-plan.repository';
import { CustomerPlanRelationalRepository } from './repositories/customer-plan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPlanEntity } from './entities/customer-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerPlanEntity])],
  providers: [
    {
      provide: CustomerPlanRepository,
      useClass: CustomerPlanRelationalRepository,
    },
  ],
  exports: [CustomerPlanRepository],
})
export class RelationalCustomerPlanPersistenceModule {}
