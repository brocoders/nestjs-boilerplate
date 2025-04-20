import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantTypeEntity } from 'src/tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantTypesSeedService {
  constructor(
    @InjectRepository(TenantTypeEntity)
    private repository: Repository<TenantTypeEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
