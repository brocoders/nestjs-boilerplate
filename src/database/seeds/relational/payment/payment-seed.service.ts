import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from '../../../../payments/infrastructure/persistence/relational/entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentSeedService {
  constructor(
    @InjectRepository(PaymentEntity)
    private repository: Repository<PaymentEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
