import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_SETTINGS, SettingsShape } from '../../../../domain/setting';
import { SettingAbstractRepository } from '../../setting.abstract.repository';
import { SettingEntity } from '../entities/setting.entity';
import { SettingMapper } from '../mappers/setting.mapper';

const SINGLETON_ID = 1;

@Injectable()
export class SettingRelationalRepository implements SettingAbstractRepository {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly repo: Repository<SettingEntity>,
  ) {}

  async get(): Promise<SettingsShape> {
    const row = await this.repo.findOne({ where: { id: SINGLETON_ID } });
    return SettingMapper.toShape(row);
  }

  async update(patch: Partial<SettingsShape>): Promise<SettingsShape> {
    const row = await this.repo.findOne({ where: { id: SINGLETON_ID } });
    const next: SettingsShape = row
      ? { ...DEFAULT_SETTINGS, ...row.values, ...patch }
      : { ...DEFAULT_SETTINGS, ...patch };
    if (row) {
      row.values = next;
      await this.repo.save(row);
    } else {
      await this.repo.save(
        this.repo.create({ id: SINGLETON_ID, values: next }),
      );
    }
    return next;
  }
}
