import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsReceivableEntity } from '../../../../accounts-receivables/infrastructure/persistence/relational/entities/accounts-receivable.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsReceivableSeedService {
  constructor(
    @InjectRepository(AccountsReceivableEntity)
    private repository: Repository<AccountsReceivableEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
