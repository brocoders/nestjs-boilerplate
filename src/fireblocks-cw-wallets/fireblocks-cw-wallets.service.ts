import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateFireblocksCwWalletDto } from './dto/create-fireblocks-cw-wallet.dto';
import { UpdateFireblocksCwWalletDto } from './dto/update-fireblocks-cw-wallet.dto';
import { FireblocksCwWalletRepository } from './infrastructure/persistence/fireblocks-cw-wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FireblocksCwWallet } from './domain/fireblocks-cw-wallet';

@Injectable()
export class FireblocksCwWalletsService {
  constructor(
    // Dependencies here
    private readonly fireblocksCwWalletRepository: FireblocksCwWalletRepository,
  ) {}

  async create(createFireblocksCwWalletDto: CreateFireblocksCwWalletDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.fireblocksCwWalletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      assets: createFireblocksCwWalletDto.assets,

      metadata: createFireblocksCwWalletDto.metadata,

      vaultType: createFireblocksCwWalletDto.vaultType,

      autoFuel: createFireblocksCwWalletDto.autoFuel,

      hiddenOnUI: createFireblocksCwWalletDto.hiddenOnUI,

      name: createFireblocksCwWalletDto.name,

      referenceId: createFireblocksCwWalletDto.referenceId,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.fireblocksCwWalletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: FireblocksCwWallet['id']) {
    return this.fireblocksCwWalletRepository.findById(id);
  }

  findByIds(ids: FireblocksCwWallet['id'][]) {
    return this.fireblocksCwWalletRepository.findByIds(ids);
  }

  async update(
    id: FireblocksCwWallet['id'],

    updateFireblocksCwWalletDto: UpdateFireblocksCwWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.fireblocksCwWalletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      assets: updateFireblocksCwWalletDto.assets,

      metadata: updateFireblocksCwWalletDto.metadata,

      vaultType: updateFireblocksCwWalletDto.vaultType,

      autoFuel: updateFireblocksCwWalletDto.autoFuel,

      hiddenOnUI: updateFireblocksCwWalletDto.hiddenOnUI,

      name: updateFireblocksCwWalletDto.name,

      referenceId: updateFireblocksCwWalletDto.referenceId,
    });
  }

  remove(id: FireblocksCwWallet['id']) {
    return this.fireblocksCwWalletRepository.remove(id);
  }
}
