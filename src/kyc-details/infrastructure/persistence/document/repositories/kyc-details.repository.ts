import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KycDetailsSchemaClass } from '../entities/kyc-details.schema';
import { KycDetailsRepository } from '../../kyc-details.repository';
import { KycDetails } from '../../../../domain/kyc-details';
import { KycDetailsMapper } from '../mappers/kyc-details.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class KycDetailsDocumentRepository implements KycDetailsRepository {
  constructor(
    @InjectModel(KycDetailsSchemaClass.name)
    private readonly kycDetailsModel: Model<KycDetailsSchemaClass>,
  ) {}

  async create(data: KycDetails): Promise<KycDetails> {
    const persistenceModel = KycDetailsMapper.toPersistence(data);
    const createdEntity = new this.kycDetailsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return KycDetailsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<KycDetails[]> {
    const entityObjects = await this.kycDetailsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      KycDetailsMapper.toDomain(entityObject),
    );
  }

  async findById(id: KycDetails['id']): Promise<NullableType<KycDetails>> {
    const entityObject = await this.kycDetailsModel.findById(id);
    return entityObject ? KycDetailsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: KycDetails['id'][]): Promise<KycDetails[]> {
    const entityObjects = await this.kycDetailsModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      KycDetailsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: KycDetails['id'],
    payload: Partial<KycDetails>,
  ): Promise<NullableType<KycDetails>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.kycDetailsModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.kycDetailsModel.findOneAndUpdate(
      filter,
      KycDetailsMapper.toPersistence({
        ...KycDetailsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? KycDetailsMapper.toDomain(entityObject) : null;
  }

  async remove(id: KycDetails['id']): Promise<void> {
    await this.kycDetailsModel.deleteOne({ _id: id });
  }
}
