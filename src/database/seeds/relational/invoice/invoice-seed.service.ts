import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from '../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceSeedService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private repository: Repository<InvoiceEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
