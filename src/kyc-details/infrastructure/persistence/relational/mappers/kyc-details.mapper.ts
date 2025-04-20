import { KycDetails } from '../../../../domain/kyc-details';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import {
  KycDetailsEntity,
  KycStatus,
  KycSubjectType,
} from '../entities/kyc-details.entity';

export class KycDetailsMapper {
  static toDomain(raw: KycDetailsEntity): KycDetails {
    const domainEntity = new KycDetails();
    domainEntity.verifiedBy = raw.verifiedBy;

    domainEntity.verifiedAt = raw.verifiedAt;

    domainEntity.submittedAt = raw.submittedAt;

    domainEntity.status = raw.status;

    domainEntity.documentData = raw.documentData
      ? typeof raw.documentData === 'string'
        ? JSON.parse(raw.documentData)
        : raw.documentData
      : undefined;

    domainEntity.documentNumber = raw.documentNumber;

    domainEntity.documentType = raw.documentType;

    domainEntity.subjectType = raw.subjectType;

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: KycDetails): KycDetailsEntity {
    const persistenceEntity = new KycDetailsEntity();
    persistenceEntity.verifiedBy = domainEntity.verifiedBy;

    persistenceEntity.verifiedAt = domainEntity.verifiedAt;

    persistenceEntity.submittedAt = domainEntity.submittedAt;

    persistenceEntity.status =
      (domainEntity.status as KycStatus) ?? KycStatus.PENDING;

    persistenceEntity.documentData = domainEntity.documentData
      ? JSON.parse(
          typeof domainEntity.documentData === 'string'
            ? domainEntity.documentData
            : '{}',
        )
      : { frontUrl: undefined, backUrl: undefined, expiryDate: undefined };

    persistenceEntity.documentNumber = domainEntity.documentNumber;

    persistenceEntity.documentType = domainEntity.documentType;

    persistenceEntity.subjectType =
      (domainEntity.subjectType as KycSubjectType) ?? KycSubjectType.USER;

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
