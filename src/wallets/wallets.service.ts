import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from './infrastructure/persistence/wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Wallet } from './domain/wallet';

@Injectable()
export class WalletsService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    // Do not remove comment below.
    // <creating-property />

    const userObject = await this.userService.findById(createWalletDto.user.id);
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.walletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      active: createWalletDto.active,

      label: createWalletDto.label,

      provider: createWalletDto.provider,

      lockupId: createWalletDto.lockupId,

      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.walletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Wallet['id']) {
    return this.walletRepository.findById(id);
  }

  findByIds(ids: Wallet['id'][]) {
    return this.walletRepository.findByIds(ids);
  }

  async update(
    id: Wallet['id'],

    updateWalletDto: UpdateWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let user: User | undefined = undefined;

    if (updateWalletDto.user) {
      const userObject = await this.userService.findById(
        updateWalletDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    }

    return this.walletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      active: updateWalletDto.active,

      label: updateWalletDto.label,

      provider: updateWalletDto.provider,

      lockupId: updateWalletDto.lockupId,

      user,
    });
  }

  remove(id: Wallet['id']) {
    return this.walletRepository.remove(id);
  }
}
