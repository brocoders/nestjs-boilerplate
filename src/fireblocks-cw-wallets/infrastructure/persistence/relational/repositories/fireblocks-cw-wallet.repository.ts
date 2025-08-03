import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FireblocksCwWalletEntity } from '../entities/fireblocks-cw-wallet.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FireblocksCwWallet } from '../../../../domain/fireblocks-cw-wallet';
import { FireblocksCwWalletRepository } from '../../fireblocks-cw-wallet.repository';
import { FireblocksCwWalletMapper } from '../mappers/fireblocks-cw-wallet.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class FireblocksCwWalletRelationalRepository
  implements FireblocksCwWalletRepository
{
  constructor(
    @InjectRepository(FireblocksCwWalletEntity)
    private readonly fireblocksCwWalletRepository: Repository<FireblocksCwWalletEntity>,
  ) {}

  async create(data: FireblocksCwWallet): Promise<FireblocksCwWallet> {
    const persistenceModel = FireblocksCwWalletMapper.toPersistence(data);
    const newEntity = await this.fireblocksCwWalletRepository.save(
      this.fireblocksCwWalletRepository.create(persistenceModel),
    );
    return FireblocksCwWalletMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FireblocksCwWallet[]> {
    const entities = await this.fireblocksCwWalletRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => FireblocksCwWalletMapper.toDomain(entity));
  }

  async findById(
    id: FireblocksCwWallet['id'],
  ): Promise<NullableType<FireblocksCwWallet>> {
    const entity = await this.fireblocksCwWalletRepository.findOne({
      where: { id },
    });

    return entity ? FireblocksCwWalletMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: FireblocksCwWallet['id'][],
  ): Promise<FireblocksCwWallet[]> {
    const entities = await this.fireblocksCwWalletRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => FireblocksCwWalletMapper.toDomain(entity));
  }

  async update(
    id: FireblocksCwWallet['id'],
    payload: Partial<FireblocksCwWallet>,
  ): Promise<FireblocksCwWallet> {
    const entity = await this.fireblocksCwWalletRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.fireblocksCwWalletRepository.save(
      this.fireblocksCwWalletRepository.create(
        FireblocksCwWalletMapper.toPersistence({
          ...FireblocksCwWalletMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return FireblocksCwWalletMapper.toDomain(updatedEntity);
  }

  async remove(id: FireblocksCwWallet['id']): Promise<void> {
    await this.fireblocksCwWalletRepository.delete(id);
  }
}
