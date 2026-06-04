import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../database/prisma.service';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserPrismaMapper } from '../mappers/user.mapper';

const includeUserRelations = {
  photo: true,
  role: true,
  status: true,
} satisfies Prisma.UserInclude;

@Injectable()
export class UsersPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User> {
    const entity = await this.prisma.user.create({
      data: this.toCreateData(data),
      include: includeUserRelations,
    });

    return UserPrismaMapper.toDomain(entity);
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

    const entities = await this.prisma.user.findMany({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      orderBy: this.toOrderBy(sortOptions),
      include: includeUserRelations,
    });

    return entities.map((user) => UserPrismaMapper.toDomain(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.prisma.user.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: includeUserRelations,
    });

    return entity ? UserPrismaMapper.toDomain(entity) : null;
  }

  async findByIds(ids: User['id'][]): Promise<User[]> {
    const entities = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids.map((id) => Number(id)),
        },
        deletedAt: null,
      },
      include: includeUserRelations,
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
      include: includeUserRelations,
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
      include: includeUserRelations,
    });

    return entity ? UserPrismaMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.prisma.user.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: includeUserRelations,
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.prisma.user.update({
      where: {
        id: entity.id,
      },
      data: this.toUpdateData(payload),
      include: includeUserRelations,
    });

    return UserPrismaMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private toCreateData(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Prisma.UserCreateInput {
    return {
      email: data.email,
      password: data.password,
      provider: data.provider,
      socialId: data.socialId,
      firstName: this.toNullableString(data.firstName),
      lastName: this.toNullableString(data.lastName),
      photo: data.photo
        ? {
            connect: {
              id: data.photo.id,
            },
          }
        : undefined,
      role: data.role
        ? {
            connect: {
              id: Number(data.role.id),
            },
          }
        : undefined,
      status: data.status
        ? {
            connect: {
              id: Number(data.status.id),
            },
          }
        : undefined,
    };
  }

  private toUpdateData(payload: Partial<User>): Prisma.UserUpdateInput {
    const data: Prisma.UserUpdateInput = {};

    if (payload.email !== undefined) data.email = payload.email;
    if (payload.password !== undefined) data.password = payload.password;
    if (payload.provider !== undefined) data.provider = payload.provider;
    if (payload.socialId !== undefined) data.socialId = payload.socialId;
    if (payload.firstName !== undefined) {
      data.firstName = this.toNullableString(payload.firstName);
    }
    if (payload.lastName !== undefined) {
      data.lastName = this.toNullableString(payload.lastName);
    }
    if (payload.deletedAt !== undefined) data.deletedAt = payload.deletedAt;

    if (payload.photo !== undefined) {
      data.photo = payload.photo
        ? {
            connect: {
              id: payload.photo.id,
            },
          }
        : {
            disconnect: true,
          };
    }

    if (payload.role !== undefined) {
      data.role = payload.role
        ? {
            connect: {
              id: Number(payload.role.id),
            },
          }
        : {
            disconnect: true,
          };
    }

    if (payload.status !== undefined) {
      data.status = payload.status
        ? {
            connect: {
              id: Number(payload.status.id),
            },
          }
        : {
            disconnect: true,
          };
    }

    return data;
  }

  private toOrderBy(
    sortOptions?: SortUserDto[] | null,
  ): Prisma.UserOrderByWithRelationInput[] | undefined {
    return sortOptions?.map((sort) => ({
      [sort.orderBy]: sort.order.toLowerCase() === 'desc' ? 'desc' : 'asc',
    }));
  }

  private toNullableString(value: unknown): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    return String(value);
  }
}
