import { Module } from '@nestjs/common';
import { DiscountRepository } from '../discount.repository';
import { DiscountRelationalRepository } from './repositories/discount.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  providers: [
    {
      provide: DiscountRepository,
      useClass: DiscountRelationalRepository,
    },
  ],
  exports: [DiscountRepository],
})
export class RelationalDiscountPersistenceModule {}
