import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Region } from './domain/region';
import { RegionAbstractRepository } from './infrastructure/persistence/region.abstract.repository';

@Injectable()
export class RegionsService {
  constructor(private readonly repo: RegionAbstractRepository) {}

  listEnabled(): Promise<Region[]> {
    return this.repo.findAllEnabled();
  }

  findByCode(code: string): Promise<Region | null> {
    return this.repo.findByCode(code);
  }

  findById(id: string): Promise<Region | null> {
    return this.repo.findById(id);
  }

  async getDefault(): Promise<Region> {
    const r = await this.repo.findDefault();
    if (!r)
      throw new InternalServerErrorException('No default region configured');
    return r;
  }
}
