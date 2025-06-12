import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CreatePassphraseDto,
  CreatePassphraseUserDto,
} from './dto/create-passphrase.dto';
import { UpdatePassphraseDto } from './dto/update-passphrase.dto';
import { PassphraseRepository } from './infrastructure/persistence/passphrase.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Passphrase } from './domain/passphrase';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { PassphraseUserResponseDto } from './dto/passphrase-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  FilterPassphraseDto,
  SortPassphraseDto,
} from './dto/query-passphrase.dto';

@Injectable()
export class PassphrasesService {
  constructor(
    private readonly userService: UsersService,
    private readonly passphraseRepository: PassphraseRepository,
  ) {}

  async create(createPassphraseDto: CreatePassphraseDto) {
    // <creating-property />

    const userObject = await this.userService.findById(
      createPassphraseDto.user.id,
    );
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }

    return this.passphraseRepository.create({
      // <creating-property-payload />
      location: createPassphraseDto.location,
      user: userObject,
    });
  }

  async createByUser(
    createPassphraseUserDto: CreatePassphraseUserDto,
    userJwtPayload: JwtPayloadType,
  ) {
    // <creating-property-by-user />

    const userObject = await this.userService.findById(userJwtPayload.id);
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'UserNotExists',
        },
      });
    }

    return this.passphraseRepository.create({
      // <creating-property-payload-by-user />
      location: createPassphraseUserDto.location,
      user: userObject,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.passphraseRepository.findAllWithPagination({
      paginationOptions,
    });
  }

  findById(id: Passphrase['id']) {
    return this.passphraseRepository.findById(id);
  }

  findByIds(ids: Passphrase['id'][]) {
    return this.passphraseRepository.findByIds(ids);
  }

  async update(id: Passphrase['id'], updatePassphraseDto: UpdatePassphraseDto) {
    // <updating-property />

    let user: User | undefined = undefined;

    if (updatePassphraseDto.user) {
      const userObject = await this.userService.findById(
        updatePassphraseDto.user.id,
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

    return this.passphraseRepository.update(id, {
      // <updating-property-payload />
      location: updatePassphraseDto.location,
      user,
    });
  }

  remove(id: Passphrase['id']) {
    return this.passphraseRepository.remove(id);
  }

  async findByMe(
    userJwtPayload: JwtPayloadType,
  ): Promise<PassphraseUserResponseDto[]> {
    const passphrases = await this.passphraseRepository.findByUserId(
      userJwtPayload.id,
    );
    return passphrases.map((passphrase) =>
      plainToInstance(PassphraseUserResponseDto, passphrase),
    );
  }

  async findByUserId(userId: User['id']): Promise<PassphraseUserResponseDto[]> {
    const passphrases = await this.passphraseRepository.findByUserId(userId);
    return passphrases.map((passphrase) =>
      plainToInstance(PassphraseUserResponseDto, passphrase),
    );
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPassphraseDto | null;
    sortOptions?: SortPassphraseDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Passphrase[]> {
    return this.passphraseRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
