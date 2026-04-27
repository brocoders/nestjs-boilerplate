import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../../../../domain/currency';
import { CurrencyAbstractRepository } from '../../currency.abstract.repository';
import { CurrencyEntity } from '../entities/currency.entity';
import { CurrencyMapper } from '../mappers/currency.mapper';

@Injectable()
export class CurrencyRelationalRepository implements CurrencyAbstractRepository {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly repo: Repository<CurrencyEntity>,
  ) {}

  async findAll(): Promise<Currency[]> {
    const rows = await this.repo.find({ order: { code: 'ASC' } });
    return rows.map(CurrencyMapper.toDomain);
  }

  async findByCode(code: string): Promise<Currency | null> {
    const row = await this.repo.findOne({ where: { code } });
    return row ? CurrencyMapper.toDomain(row) : null;
  }
}
