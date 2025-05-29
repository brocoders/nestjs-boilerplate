import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { InvoiceSeedService } from './invoice-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  providers: [InvoiceSeedService],
  exports: [InvoiceSeedService],
})
export class InvoiceSeedModule {}
