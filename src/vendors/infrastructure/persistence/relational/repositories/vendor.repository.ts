import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, VendorStatus } from '../../../../domain/vendor';
import {
  FindAllOptions,
  FindAllResult,
  VendorAbstractRepository,
} from '../../vendor.abstract.repository';
import { VendorEntity } from '../entities/vendor.entity';
import { VendorMapper } from '../mappers/vendor.mapper';

@Injectable()
export class VendorRelationalRepository implements VendorAbstractRepository {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly repo: Repository<VendorEntity>,
  ) {}

  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const { status, page, limit } = options;
    const [rows, total] = await this.repo.findAndCount({
      where: status ? { status } : undefined,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: rows.map(VendorMapper.toDomain), total };
  }

  async findById(id: string): Promise<Vendor | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? VendorMapper.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Vendor | null> {
    const row = await this.repo.findOne({ where: { slug } });
    return row ? VendorMapper.toDomain(row) : null;
  }

  async findByUserId(userId: number): Promise<Vendor | null> {
    const row = await this.repo.findOne({ where: { userId } });
    return row ? VendorMapper.toDomain(row) : null;
  }

  async create(
    input: Omit<Vendor, 'createdAt' | 'updatedAt'>,
  ): Promise<Vendor> {
    const entity = this.repo.create(input);
    const saved = await this.repo.save(entity);
    return VendorMapper.toDomain(saved);
  }

  async update(id: string, patch: Partial<Vendor>): Promise<Vendor> {
    await this.repo.update({ id }, patch);
    const row = await this.repo.findOneOrFail({ where: { id } });
    return VendorMapper.toDomain(row);
  }

  async setStatus(id: string, status: VendorStatus): Promise<Vendor> {
    return this.update(id, { status });
  }
}
