import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FxRate } from '../../../../domain/fx-rate';
import { FxRateAbstractRepository } from '../../fx-rate.abstract.repository';
import { FxRateEntity } from '../entities/fx-rate.entity';
import { FxRateMapper } from '../mappers/fx-rate.mapper';
import { uuidv7Generate } from '../../../../../utils/uuid';

@Injectable()
export class FxRateRelationalRepository implements FxRateAbstractRepository {
  constructor(
    @InjectRepository(FxRateEntity)
    private readonly repo: Repository<FxRateEntity>,
  ) {}

  async upsertDaily(record: {
    base: string;
    quote: string;
    rate: string;
    day: string;
    source: string;
  }): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({
        id: uuidv7Generate(),
        baseCurrency: record.base,
        quoteCurrency: record.quote,
        rate: record.rate,
        fetchedDate: record.day,
        source: record.source,
      })
      .orIgnore() // ON CONFLICT DO NOTHING — same-day re-fetch is a no-op
      .execute();
  }

  async findLatest(base: string, quote: string): Promise<FxRate | null> {
    const row = await this.repo.findOne({
      where: { baseCurrency: base, quoteCurrency: quote },
      order: { fetchedDate: 'DESC' },
    });
    return row ? FxRateMapper.toDomain(row) : null;
  }
}
