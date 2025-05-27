import { CreditBalance } from '../../../../domain/credit-balance';
import { CreditBalanceEntity } from '../entities/credit-balance.entity';

export class CreditBalanceMapper {
  static toDomain(raw: CreditBalanceEntity): CreditBalance {
    const domainEntity = new CreditBalance();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: CreditBalance): CreditBalanceEntity {
    const persistenceEntity = new CreditBalanceEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
