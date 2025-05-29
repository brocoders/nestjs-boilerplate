import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantConfigEntity } from '../../../../tenant-configs/infrastructure/persistence/relational/entities/tenant-config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantConfigSeedService {
  constructor(
    @InjectRepository(TenantConfigEntity)
    private repository: Repository<TenantConfigEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
