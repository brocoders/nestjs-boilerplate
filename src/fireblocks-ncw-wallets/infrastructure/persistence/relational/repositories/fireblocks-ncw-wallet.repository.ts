import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FireblocksNcwWalletEntity } from '../entities/fireblocks-ncw-wallet.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FireblocksNcwWallet } from '../../../../domain/fireblocks-ncw-wallet';
import { FireblocksNcwWalletRepository } from '../../fireblocks-ncw-wallet.repository';
import { FireblocksNcwWalletMapper } from '../mappers/fireblocks-ncw-wallet.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class FireblocksNcwWalletRelationalRepository
  implements FireblocksNcwWalletRepository
{
  constructor(
    @InjectRepository(FireblocksNcwWalletEntity)
    private readonly fireblocksNcwWalletRepository: Repository<FireblocksNcwWalletEntity>,
  ) {}

  async create(data: FireblocksNcwWallet): Promise<FireblocksNcwWallet> {
    const persistenceModel = FireblocksNcwWalletMapper.toPersistence(data);
    const newEntity = await this.fireblocksNcwWalletRepository.save(
      this.fireblocksNcwWalletRepository.create(persistenceModel),
    );
    return FireblocksNcwWalletMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FireblocksNcwWallet[]> {
    const entities = await this.fireblocksNcwWalletRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => FireblocksNcwWalletMapper.toDomain(entity));
  }

  async findById(
    id: FireblocksNcwWallet['id'],
  ): Promise<NullableType<FireblocksNcwWallet>> {
    const entity = await this.fireblocksNcwWalletRepository.findOne({
      where: { id },
    });

    return entity ? FireblocksNcwWalletMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: FireblocksNcwWallet['id'][],
  ): Promise<FireblocksNcwWallet[]> {
    const entities = await this.fireblocksNcwWalletRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => FireblocksNcwWalletMapper.toDomain(entity));
  }

  async update(
    id: FireblocksNcwWallet['id'],
    payload: Partial<FireblocksNcwWallet>,
  ): Promise<FireblocksNcwWallet> {
    const entity = await this.fireblocksNcwWalletRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.fireblocksNcwWalletRepository.save(
      this.fireblocksNcwWalletRepository.create(
        FireblocksNcwWalletMapper.toPersistence({
          ...FireblocksNcwWalletMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return FireblocksNcwWalletMapper.toDomain(updatedEntity);
  }

  async remove(id: FireblocksNcwWallet['id']): Promise<void> {
    await this.fireblocksNcwWalletRepository.delete(id);
  }
}
