import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditBalanceEntity } from '../../../../credit-balances/infrastructure/persistence/relational/entities/credit-balance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreditBalanceSeedService {
  constructor(
    @InjectRepository(CreditBalanceEntity)
    private repository: Repository<CreditBalanceEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
