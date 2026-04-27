import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../../../../domain/region';
import { RegionAbstractRepository } from '../../region.abstract.repository';
import { RegionEntity } from '../entities/region.entity';
import { RegionMapper } from '../mappers/region.mapper';

@Injectable()
export class RegionRelationalRepository implements RegionAbstractRepository {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly repo: Repository<RegionEntity>,
  ) {}

  async findAllEnabled(): Promise<Region[]> {
    const rows = await this.repo.find({
      where: { isEnabled: true },
      order: { code: 'ASC' },
    });
    return rows.map(RegionMapper.toDomain);
  }

  async findByCode(code: string): Promise<Region | null> {
    const row = await this.repo.findOne({ where: { code } });
    return row ? RegionMapper.toDomain(row) : null;
  }

  async findDefault(): Promise<Region | null> {
    const row = await this.repo.findOne({ where: { isDefault: true } });
    return row ? RegionMapper.toDomain(row) : null;
  }
}
