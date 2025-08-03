import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { WalletEntity } from '../entities/wallet.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Wallet } from '../../../../domain/wallet';
import { WalletRepository } from '../../wallet.repository';
import { WalletMapper } from '../mappers/wallet.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

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

    return entities.map((entity) => WalletMapper.toDomain(entity));
  }

  async findById(id: Wallet['id']): Promise<NullableType<Wallet>> {
    const entity = await this.walletRepository.findOne({
      where: { id },
    });

    return entity ? WalletMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Wallet['id'][]): Promise<Wallet[]> {
    const entities = await this.walletRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => WalletMapper.toDomain(entity));
  }

  async update(id: Wallet['id'], payload: Partial<Wallet>): Promise<Wallet> {
    const entity = await this.walletRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.walletRepository.save(
      this.walletRepository.create(
        WalletMapper.toPersistence({
          ...WalletMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return WalletMapper.toDomain(updatedEntity);
  }

  async remove(id: Wallet['id']): Promise<void> {
    await this.walletRepository.delete(id);
  }
}
