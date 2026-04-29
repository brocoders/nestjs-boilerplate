import { ShippingZone } from '../../../../domain/shipping-zone';
import { ShippingZoneEntity } from '../entities/shipping-zone.entity';

export class ShippingZoneMapper {
  static toDomain(entity: ShippingZoneEntity): ShippingZone {
    const d = new ShippingZone();
    d.id = entity.id;
    d.vendorId = entity.vendorId;
    d.name = entity.name;
    d.countryCodes = entity.countryCodes ?? [];
    d.regionCodes = entity.regionCodes ?? [];
    d.costMinorUnits = String(entity.costMinorUnits);
    d.currencyCode = entity.currencyCode;
    d.freeAboveMinorUnits =
      entity.freeAboveMinorUnits === null ||
      entity.freeAboveMinorUnits === undefined
        ? null
        : String(entity.freeAboveMinorUnits);
    d.estDeliveryDaysMin = entity.estDeliveryDaysMin;
    d.estDeliveryDaysMax = entity.estDeliveryDaysMax;
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
