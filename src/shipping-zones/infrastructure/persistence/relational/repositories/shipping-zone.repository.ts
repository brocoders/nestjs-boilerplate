import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingZone } from '../../../../domain/shipping-zone';
import {
  CreateShippingZoneInput,
  ShippingZoneAbstractRepository,
  UpdateShippingZoneInput,
} from '../../shipping-zone.abstract.repository';
import { ShippingZoneEntity } from '../entities/shipping-zone.entity';
import { ShippingZoneMapper } from '../mappers/shipping-zone.mapper';

@Injectable()
export class ShippingZoneRelationalRepository implements ShippingZoneAbstractRepository {
  constructor(
    @InjectRepository(ShippingZoneEntity)
    private readonly repo: Repository<ShippingZoneEntity>,
  ) {}

  async findById(id: string): Promise<ShippingZone | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? ShippingZoneMapper.toDomain(row) : null;
  }

  async findByVendor(vendorId: string): Promise<ShippingZone[]> {
    const rows = await this.repo.find({
      where: { vendorId },
      order: { createdAt: 'ASC' },
    });
    return rows.map(ShippingZoneMapper.toDomain);
  }

  async create(input: CreateShippingZoneInput): Promise<ShippingZone> {
    const entity = this.repo.create(input);
    const saved = await this.repo.save(entity);
    return ShippingZoneMapper.toDomain(saved);
  }

  async update(
    id: string,
    patch: UpdateShippingZoneInput,
  ): Promise<ShippingZone> {
    await this.repo.update({ id }, patch);
    const row = await this.repo.findOneOrFail({ where: { id } });
    return ShippingZoneMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async findCandidatesForVendor(
    vendorId: string,
    countryCode: string,
  ): Promise<ShippingZone[]> {
    // Pull every zone for this vendor that lists the country, regardless of
    // region restriction. Caller picks the most specific match.
    const rows = await this.repo
      .createQueryBuilder('z')
      .where('z.vendor_id = :vendorId', { vendorId })
      .andWhere(':country = ANY(z.country_codes)', { country: countryCode })
      .getMany();
    return rows.map(ShippingZoneMapper.toDomain);
  }
}
