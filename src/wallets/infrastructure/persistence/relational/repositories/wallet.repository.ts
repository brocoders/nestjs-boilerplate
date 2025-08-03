import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { WalletEntity } from '../entities/wallet.entity';
import { Wallet } from '../../../../domain/wallet';
import { WalletRepository } from '../../wallet.repository';
import { WalletMapper } from '../mappers/wallet.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { User } from '../../../../../users/domain/user';

@Injectable()
export class WalletRelationalRepository implements WalletRepository {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  async create(data: Wallet): Promise<Wallet> {
    const persistenceModel = WalletMapper.toPersistence(data);
    const newEntity = await this.walletRepository.save(
      this.walletRepository.create(persistenceModel),
    );
    return WalletMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Wallet[]> {
    const entities = await this.walletRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return entities.map(WalletMapper.toDomain);
  }

  async findById(
    id: Wallet['id'],
    userId?: User['id'],
  ): Promise<NullableType<Wallet>> {
    const whereClause: any = { id };
    if (userId) whereClause.user = { id: userId };

    const entity = await this.walletRepository.findOne({
      where: whereClause,
    });
    return entity ? WalletMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Wallet['id'][]): Promise<Wallet[]> {
    const entities = await this.walletRepository.find({
      where: { id: In(ids) },
    });
    return entities.map(WalletMapper.toDomain);
  }

  async update(
    id: Wallet['id'],
    payload: DeepPartial<Wallet>,
  ): Promise<NullableType<Wallet>> {
    const existing = await this.walletRepository.findOne({ where: { id } });
    if (!existing) return null;

    const updated = this.walletRepository.merge(
      existing,
      WalletMapper.toPersistence(payload as Wallet),
    );

    const saved = await this.walletRepository.save(updated);
    return WalletMapper.toDomain(saved);
  }

  async remove(id: Wallet['id'], userId?: User['id']): Promise<void> {
    const whereClause: any = { id };
    if (userId) whereClause.user = { id: userId };

    await this.walletRepository.delete(whereClause);
  }

  async findAllByUserId(userId: User['id']): Promise<Wallet[]> {
    const entities = await this.walletRepository.find({
      where: {
        user: {
          id: Number(userId),
        },
      },
      relations: ['user'],
    });

    return entities.map((entity) => WalletMapper.toDomain(entity));
  }

  async filter(
    userId?: User['id'],
    provider?: Wallet['provider'],
    lockupId?: Wallet['lockupId'],
    label?: Wallet['label'],
    active?: Wallet['active'],
  ): Promise<Wallet[]> {
    const whereClause: any = {};
    if (userId) whereClause.user = { id: userId };
    if (provider) whereClause.provider = provider;
    if (lockupId) whereClause.lockupId = lockupId;
    if (label) whereClause.label = label;
    if (typeof active === 'boolean') whereClause.active = active;

    const entities = await this.walletRepository.find({ where: whereClause });
    return entities.map(WalletMapper.toDomain);
  }

  async findActives(userId?: User['id']): Promise<Wallet[]> {
    const whereClause: any = { active: true };
    if (userId) whereClause.user = { id: userId };

    const entities = await this.walletRepository.find({ where: whereClause });
    return entities.map(WalletMapper.toDomain);
  }

  async countAll(userId?: User['id']): Promise<number> {
    const whereClause: any = {};
    if (userId) whereClause.user = { id: userId };

    return this.walletRepository.count({ where: whereClause });
  }

  async countActives(userId?: User['id']): Promise<number> {
    const whereClause: any = { active: true };
    if (userId) whereClause.user = { id: userId };

    return this.walletRepository.count({ where: whereClause });
  }
  async findByLockupId(
    lockupId: Wallet['lockupId'],
  ): Promise<NullableType<Wallet>> {
    const entity = await this.walletRepository.findOne({
      where: { lockupId },
    });

    return entity ? WalletMapper.toDomain(entity) : null;
  }
}
