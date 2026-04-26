import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locale } from '../../../../domain/locale';
import { LocaleAbstractRepository } from '../../locale.abstract.repository';
import { LocaleEntity } from '../entities/locale.entity';
import { LocaleMapper } from '../mappers/locale.mapper';

@Injectable()
export class LocaleRelationalRepository implements LocaleAbstractRepository {
  constructor(
    @InjectRepository(LocaleEntity)
    private readonly repo: Repository<LocaleEntity>,
  ) {}

  async findAllEnabled(): Promise<Locale[]> {
    const rows = await this.repo.find({
      where: { isEnabled: true },
      order: { code: 'ASC' },
    });
    return rows.map(LocaleMapper.toDomain);
  }

  async findByCode(code: string): Promise<Locale | null> {
    const row = await this.repo.findOne({ where: { code } });
    return row ? LocaleMapper.toDomain(row) : null;
  }

  async findById(id: string): Promise<Locale | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? LocaleMapper.toDomain(row) : null;
  }
}
