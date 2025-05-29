import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorBillEntity } from '../../../../vendor-bills/infrastructure/persistence/relational/entities/vendor-bill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendorBillSeedService {
  constructor(
    @InjectRepository(VendorBillEntity)
    private repository: Repository<VendorBillEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
