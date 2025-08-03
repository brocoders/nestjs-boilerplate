import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateFireblocksNcwWalletDto } from './dto/create-fireblocks-ncw-wallet.dto';
import { UpdateFireblocksNcwWalletDto } from './dto/update-fireblocks-ncw-wallet.dto';
import { FireblocksNcwWalletRepository } from './infrastructure/persistence/fireblocks-ncw-wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FireblocksNcwWallet } from './domain/fireblocks-ncw-wallet';

@Injectable()
export class FireblocksNcwWalletsService {
  constructor(
    // Dependencies here
    private readonly fireblocksNcwWalletRepository: FireblocksNcwWalletRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createFireblocksNcwWalletDto: CreateFireblocksNcwWalletDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.fireblocksNcwWalletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.fireblocksNcwWalletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: FireblocksNcwWallet['id']) {
    return this.fireblocksNcwWalletRepository.findById(id);
  }

  findByIds(ids: FireblocksNcwWallet['id'][]) {
    return this.fireblocksNcwWalletRepository.findByIds(ids);
  }

  async update(
    id: FireblocksNcwWallet['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFireblocksNcwWalletDto: UpdateFireblocksNcwWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.fireblocksNcwWalletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: FireblocksNcwWallet['id']) {
    return this.fireblocksNcwWalletRepository.remove(id);
  }
}
