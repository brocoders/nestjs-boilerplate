import { FindOptionsWhere } from 'typeorm';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Onboarding } from '../../domain/onboarding';

export abstract class OnboardingRepository {
  abstract create(
    data: Omit<Onboarding, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Onboarding>;
  abstract findOne(
    where: FindOptionsWhere<Onboarding>,
  ): Promise<NullableType<Onboarding>>;

  abstract find({
    where,
    order,
  }: {
    where?: FindOptionsWhere<Onboarding>;
    order?: { [key in keyof Onboarding]?: 'ASC' | 'DESC' };
  }): Promise<Onboarding[]>;
  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Onboarding[]>;

  abstract findById(id: Onboarding['id']): Promise<NullableType<Onboarding>>;

  abstract findByIds(ids: Onboarding['id'][]): Promise<Onboarding[]>;

  abstract update(
    id: Onboarding['id'],
    payload: DeepPartial<Onboarding>,
  ): Promise<Onboarding | null>;

  abstract remove(id: Onboarding['id']): Promise<void>;
}
