import { KycDetails } from '../../../../domain/kyc-details';
import { KycDetailsSchemaClass } from '../entities/kyc-details.schema';

export class KycDetailsMapper {
  public static toDomain(raw: KycDetailsSchemaClass): KycDetails {
    const domainEntity = new KycDetails();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: KycDetails): KycDetailsSchemaClass {
    const persistenceSchema = new KycDetailsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
