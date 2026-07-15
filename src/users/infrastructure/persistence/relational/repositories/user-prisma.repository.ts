import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../database/prisma.service';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserPrismaMapper } from '../mappers/user-prisma.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserPrismaMapper.toPersistence(data);

    const newEntity = await this.prisma.user.create({
      data: persistenceModel,
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    return UserPrismaMapper.toDomain(newEntity);
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
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (filterOptions?.roles?.length) {
      where.roleId = {
        in: filterOptions.roles.map((role) => Number(role.id)),
      };
    }

    const orderBy: Prisma.UserOrderByWithRelationInput[] =
      sortOptions?.map((sort) => ({
        [sort.orderBy]: sort.order,
      })) ?? [];

    const entities = await this.prisma.user.findMany({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      orderBy,
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    return entities.map((user) => UserPrismaMapper.toDomain(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.prisma.user.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    return entity ? UserPrismaMapper.toDomain(entity) : null;
  }

  async findByIds(ids: User['id'][]): Promise<User[]> {
    const entities = await this.prisma.user.findMany({
      where: {
        id: { in: ids.map((id) => Number(id)) },
        deletedAt: null,
      },
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    return entities.map((user) => UserPrismaMapper.toDomain(user));
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const entity = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    return entity ? UserPrismaMapper.toDomain(entity) : null;
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    if (!socialId || !provider) return null;

    const entity = await this.prisma.user.findFirst({
      where: {
        socialId,
        provider,
        deletedAt: null,
      },
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    return entity ? UserPrismaMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.prisma.user.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const domainEntity = UserPrismaMapper.toDomain(entity);
    const updatedData = UserPrismaMapper.toPersistence({
      ...domainEntity,
      ...payload,
    });

    const updatedEntity = await this.prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
      include: {
        role: true,
        status: true,
        photo: true,
      },
    });

    return UserPrismaMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.prisma.user.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }
}
