import { Inject, Injectable } from '@nestjs/common';

import { FindOptionsWhere, Repository, In, DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { REQUEST } from '@nestjs/core/router/request';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class UsersRelationalRepository implements UserRepository {
  private usersRepository: Repository<UserEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    // Ensure we have a data source even if tenant resolution failed
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.usersRepository = dataSource.getRepository(UserEntity);
  }
  // users-relational.repository.ts
  private applyTenantFilter(
    where: FindOptionsWhere<UserEntity> = {},
  ): FindOptionsWhere<UserEntity> {
    const tenantId = this.request['tenantId'];

    // Only apply tenant filter if tenant exists AND we're using tenant DB
    if (
      tenantId &&
      this.request['tenantDataSource'] !== TenantDataSource.getCoreDataSource()
    ) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }
    return where;
  }

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    // Convert filterOptions to FindOptionsWhere<UserEntity> if present
    const { roles, ...restFilterOptions } = filterOptions || {};
    const baseWhere: FindOptionsWhere<UserEntity> = restFilterOptions;
    const where = this.applyTenantFilter(baseWhere);
    if (roles?.length) {
      where.role = roles.map((role) => ({
        id: Number(role.id),
      }));
    }
    // const entities_ = this.dataSource
    //   .getRepository(UserEntity)
    //   .findOneBy({ id });
    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: this.applyTenantFilter({ id: Number(id) }),
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIds(ids: User['id'][]): Promise<User[]> {
    const entities = await this.usersRepository.find({
      where: this.applyTenantFilter({ id: In(ids) }),
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;
    console.log('this.usersRepository', this.usersRepository);
    const entity = await this.usersRepository.findOne({
      where: this.applyTenantFilter({ email: email }),
    });
    console.log('entity', entity);
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    if (!socialId || !provider) return null;

    const entity = await this.usersRepository.findOne({
      where: this.applyTenantFilter({ socialId, provider }),
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: Number(id) },
      //where: this.applyTenantFilter({ id: Number(id) }),
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
