import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsPayableEntity } from '../../../../accounts-payables/infrastructure/persistence/relational/entities/accounts-payable.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsPayableSeedService {
  constructor(
    @InjectRepository(AccountsPayableEntity)
    private repository: Repository<AccountsPayableEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      // await this.repository.save(this.repository.create({}));
    }
  }
}
