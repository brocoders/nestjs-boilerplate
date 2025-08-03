import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateWalletDto, CreateWalletUserDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from './infrastructure/persistence/wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Wallet } from './domain/wallet';
import { TypeMessage } from '../utils/types/message.type';
import { NullableType } from '../utils/types/nullable.type';
import { WalletDto } from './dto/wallet.dto';
import { RoleEnum } from '../roles/roles.enum';
import {
  GroupPlainToInstance,
  GroupPlainToInstances,
} from '../utils/transformers/class.transformer';

@Injectable()
export class WalletsService {
  constructor(
    private readonly userService: UsersService,
    private readonly walletRepository: WalletRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<WalletDto> {
    const userObject = await this.userService.findById(createWalletDto.user.id);
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { user: 'UserNotExist' },
      });
    }

    const wallet = await this.walletRepository.create({
      active: createWalletDto.active,
      label: createWalletDto.label,
      provider: createWalletDto.provider,
      lockupId: createWalletDto.lockupId,
      user: userObject,
    });

    return GroupPlainToInstance(WalletDto, wallet, [RoleEnum.admin]);
  }

  async createByMe(
    createWalletUserDto: CreateWalletUserDto,
    userId: User['id'],
  ): Promise<WalletDto> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { user: 'UserNotExist' },
      });
    }

    const created = await this.walletRepository.create({
      user,
      active: createWalletUserDto.active,
      label: createWalletUserDto.label,
      provider: createWalletUserDto.provider,
      lockupId: createWalletUserDto.lockupId,
    });

    return GroupPlainToInstance(WalletDto, created, [RoleEnum.user]);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WalletDto[]> {
    const result = await this.walletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
    return GroupPlainToInstances(WalletDto, result, [RoleEnum.admin]);
  }

  async findById(id: Wallet['id']): Promise<NullableType<WalletDto>> {
    const result = await this.walletRepository.findById(id);
    return result
      ? GroupPlainToInstance(WalletDto, result, [RoleEnum.admin])
      : null;
  }

  async findByIds(ids: Wallet['id'][]): Promise<WalletDto[]> {
    const result = await this.walletRepository.findByIds(ids);
    return GroupPlainToInstances(WalletDto, result, [RoleEnum.admin]);
  }

  async findByLockupId(
    lockupId: Wallet['lockupId'],
  ): Promise<NullableType<WalletDto>> {
    const result = await this.walletRepository.findByLockupId(lockupId);
    return result
      ? GroupPlainToInstance(WalletDto, result, [RoleEnum.admin])
      : null;
  }

  async update(
    id: Wallet['id'],
    updateWalletDto: UpdateWalletDto,
  ): Promise<NullableType<WalletDto>> {
    let user: User | undefined = undefined;

    if (updateWalletDto.user) {
      const userObject = await this.userService.findById(
        updateWalletDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: TypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
          errors: { user: 'UserNotExist' },
        });
      }
      user = userObject;
    }

    const updated = await this.walletRepository.update(id, {
      active: updateWalletDto.active,
      label: updateWalletDto.label,
      provider: updateWalletDto.provider,
      lockupId: updateWalletDto.lockupId,
      user,
    });

    return updated
      ? GroupPlainToInstance(WalletDto, updated, [RoleEnum.admin])
      : null;
  }

  async remove(id: Wallet['id'], userId?: User['id']): Promise<void> {
    await this.walletRepository.remove(id, userId);
  }

  async findAllByUserId(userId: User['id']): Promise<WalletDto[]> {
    const result = await this.walletRepository.findAllByUserId(userId);
    return GroupPlainToInstances(WalletDto, result, [RoleEnum.user]);
  }

  async findByMe(
    id: Wallet['id'],
    userId: User['id'],
  ): Promise<NullableType<WalletDto>> {
    const result = await this.walletRepository.findById(id, userId);
    return result
      ? GroupPlainToInstance(WalletDto, result, [RoleEnum.user])
      : null;
  }

  async filter(
    userId?: User['id'],
    provider?: Wallet['provider'],
    lockupId?: Wallet['lockupId'],
    label?: Wallet['label'],
    active?: Wallet['active'],
  ): Promise<WalletDto[]> {
    const result = await this.walletRepository.filter(
      userId,
      provider,
      lockupId,
      label,
      active,
    );
    return GroupPlainToInstances(WalletDto, result, [RoleEnum.admin]);
  }

  async findActives(userId?: User['id']): Promise<WalletDto[]> {
    const result = await this.walletRepository.findActives(userId);
    return GroupPlainToInstances(WalletDto, result, [
      RoleEnum.user,
      RoleEnum.admin,
    ]);
  }

  async countAll(userId?: User['id']): Promise<number> {
    return this.walletRepository.countAll(userId);
  }

  async countActives(userId?: User['id']): Promise<number> {
    return this.walletRepository.countActives(userId);
  }
}
