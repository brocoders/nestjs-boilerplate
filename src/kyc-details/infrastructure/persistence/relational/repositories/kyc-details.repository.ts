import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { KycDetailsEntity } from '../entities/kyc-details.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { KycDetails } from '../../../../domain/kyc-details';
import { KycDetailsRepository } from '../../kyc-details.repository';
import { KycDetailsMapper } from '../mappers/kyc-details.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class KycDetailsRelationalRepository implements KycDetailsRepository {
  constructor(
    @InjectRepository(KycDetailsEntity)
    private readonly kycDetailsRepository: Repository<KycDetailsEntity>,
  ) {}

  async create(data: KycDetails): Promise<KycDetails> {
    const persistenceModel = KycDetailsMapper.toPersistence(data);
    const newEntity = await this.kycDetailsRepository.save(
      this.kycDetailsRepository.create(persistenceModel),
    );
    return KycDetailsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<KycDetails[]> {
    const entities = await this.kycDetailsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => KycDetailsMapper.toDomain(entity));
  }

  async findById(id: KycDetails['id']): Promise<NullableType<KycDetails>> {
    const entity = await this.kycDetailsRepository.findOne({
      where: { id },
    });

    return entity ? KycDetailsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: KycDetails['id'][]): Promise<KycDetails[]> {
    const entities = await this.kycDetailsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => KycDetailsMapper.toDomain(entity));
  }

  async update(
    id: KycDetails['id'],
    payload: Partial<KycDetails>,
  ): Promise<KycDetails> {
    const entity = await this.kycDetailsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.kycDetailsRepository.save(
      this.kycDetailsRepository.create(
        KycDetailsMapper.toPersistence({
          ...KycDetailsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return KycDetailsMapper.toDomain(updatedEntity);
  }

  async remove(id: KycDetails['id']): Promise<void> {
    await this.kycDetailsRepository.delete(id);
  }
}
