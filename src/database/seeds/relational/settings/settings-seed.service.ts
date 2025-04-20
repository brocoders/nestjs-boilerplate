import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsEntity } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsSeedService {
  constructor(
    @InjectRepository(SettingsEntity)
    private repository: Repository<SettingsEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
