import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { uuidv7Generate } from '../utils/uuid';
import { Vendor, VendorStatus } from '../vendors/domain/vendor';
import { VendorsService } from '../vendors/vendors.service';
import { ShippingZone } from './domain/shipping-zone';
import { ShippingZoneAbstractRepository } from './infrastructure/persistence/shipping-zone.abstract.repository';

export interface CreateShippingZoneInput {
  name: string;
  countryCodes: string[];
  regionCodes?: string[];
  costMinorUnits: string;
  currencyCode: string;
  freeAboveMinorUnits?: string | null;
  estDeliveryDaysMin: number;
  estDeliveryDaysMax: number;
}

export interface UpdateShippingZoneInput {
  name?: string;
  countryCodes?: string[];
  regionCodes?: string[];
  costMinorUnits?: string;
  currencyCode?: string;
  freeAboveMinorUnits?: string | null;
  estDeliveryDaysMin?: number;
  estDeliveryDaysMax?: number;
}

@Injectable()
export class ShippingZonesService {
  constructor(
    private readonly repo: ShippingZoneAbstractRepository,
    private readonly vendors: VendorsService,
  ) {}

  async getCallingActiveVendor(userId: number): Promise<Vendor> {
    const v = await this.vendors.getByUserId(userId);
    if (!v) {
      throw new ForbiddenException('You do not have a vendor account');
    }
    if (v.status !== VendorStatus.ACTIVE) {
      throw new ForbiddenException('Your vendor account is not active');
    }
    return v;
  }

  listMine(vendorId: string): Promise<ShippingZone[]> {
    return this.repo.findByVendor(vendorId);
  }

  async create(
    vendorId: string,
    dto: CreateShippingZoneInput,
  ): Promise<ShippingZone> {
    if (dto.estDeliveryDaysMin > dto.estDeliveryDaysMax) {
      throw new UnprocessableEntityException(
        'estDeliveryDaysMin must be ≤ estDeliveryDaysMax',
      );
    }
    return this.repo.create({
      id: uuidv7Generate(),
      vendorId,
      name: dto.name,
      countryCodes: dto.countryCodes,
      regionCodes: dto.regionCodes ?? [],
      costMinorUnits: dto.costMinorUnits,
      currencyCode: dto.currencyCode,
      freeAboveMinorUnits: dto.freeAboveMinorUnits ?? null,
      estDeliveryDaysMin: dto.estDeliveryDaysMin,
      estDeliveryDaysMax: dto.estDeliveryDaysMax,
    });
  }

  async update(
    vendorId: string,
    zoneId: string,
    dto: UpdateShippingZoneInput,
  ): Promise<ShippingZone> {
    const existing = await this.getMineById(vendorId, zoneId);
    const merged = {
      estDeliveryDaysMin: dto.estDeliveryDaysMin ?? existing.estDeliveryDaysMin,
      estDeliveryDaysMax: dto.estDeliveryDaysMax ?? existing.estDeliveryDaysMax,
    };
    if (merged.estDeliveryDaysMin > merged.estDeliveryDaysMax) {
      throw new UnprocessableEntityException(
        'estDeliveryDaysMin must be ≤ estDeliveryDaysMax',
      );
    }
    return this.repo.update(zoneId, dto);
  }

  async delete(vendorId: string, zoneId: string): Promise<void> {
    await this.getMineById(vendorId, zoneId);
    await this.repo.delete(zoneId);
  }

  async getMineById(vendorId: string, zoneId: string): Promise<ShippingZone> {
    const zone = await this.repo.findById(zoneId);
    if (!zone) throw new NotFoundException('Shipping zone not found');
    if (zone.vendorId !== vendorId) {
      throw new ForbiddenException('You do not own this shipping zone');
    }
    return zone;
  }

  /**
   * Resolve the most-specific zone for a vendor + destination.
   * Region match wins over country-only match. Within the same specificity
   * we prefer the cheapest cost (deterministic tiebreak).
   */
  async resolveForVendor(
    vendorId: string,
    countryCode: string,
    regionCode?: string | null,
  ): Promise<ShippingZone | null> {
    const candidates = await this.repo.findCandidatesForVendor(
      vendorId,
      countryCode,
    );
    if (candidates.length === 0) return null;

    const regionMatches = regionCode
      ? candidates.filter((z) => z.regionCodes.includes(regionCode))
      : [];
    const countryOnly = candidates.filter((z) => z.regionCodes.length === 0);

    const pool = regionMatches.length > 0 ? regionMatches : countryOnly;
    if (pool.length === 0) return null;

    return [...pool].sort((a, b) =>
      this.compareBigintStrings(a.costMinorUnits, b.costMinorUnits),
    )[0];
  }

  private compareBigintStrings(a: string, b: string): number {
    if (a.length !== b.length) return a.length - b.length;
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
