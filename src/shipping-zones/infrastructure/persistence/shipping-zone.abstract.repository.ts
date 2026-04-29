import { ShippingZone } from '../../domain/shipping-zone';

export interface CreateShippingZoneInput {
  id: string;
  vendorId: string;
  name: string;
  countryCodes: string[];
  regionCodes: string[];
  costMinorUnits: string;
  currencyCode: string;
  freeAboveMinorUnits: string | null;
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

export abstract class ShippingZoneAbstractRepository {
  abstract findById(id: string): Promise<ShippingZone | null>;
  abstract findByVendor(vendorId: string): Promise<ShippingZone[]>;
  abstract create(input: CreateShippingZoneInput): Promise<ShippingZone>;
  abstract update(
    id: string,
    patch: UpdateShippingZoneInput,
  ): Promise<ShippingZone>;
  abstract delete(id: string): Promise<void>;
  abstract findCandidatesForVendor(
    vendorId: string,
    countryCode: string,
  ): Promise<ShippingZone[]>;
}
