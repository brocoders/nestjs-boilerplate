import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KycDetailsEntity } from 'src/kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KycDetailSeedService {
  constructor(
    @InjectRepository(KycDetailsEntity)
    private repository: Repository<KycDetailsEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
