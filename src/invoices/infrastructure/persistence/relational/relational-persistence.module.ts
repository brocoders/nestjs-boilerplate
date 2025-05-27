import { Module } from '@nestjs/common';
import { InvoiceRepository } from '../invoice.repository';
import { InvoiceRelationalRepository } from './repositories/invoice.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  providers: [
    {
      provide: InvoiceRepository,
      useClass: InvoiceRelationalRepository,
    },
  ],
  exports: [InvoiceRepository],
})
export class RelationalInvoicePersistenceModule {}
