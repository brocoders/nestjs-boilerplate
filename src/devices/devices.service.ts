import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceRepository } from './infrastructure/persistence/device.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Device } from './domain/device';
import { plainToInstance } from 'class-transformer';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { DeviceUserResponseDto } from './dto/device-response.dto';
import { FilterDeviceDto, SortDeviceDto } from './dto/query-device.dto';

@Injectable()
export class DevicesService {
  [x: string]: any;
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    // Do not remove comment below.
    // <creating-property />

    const userObject = await this.userService.findById(createDeviceDto.user.id);
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.deviceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      isActive: createDeviceDto.isActive,

      model: createDeviceDto.model,

      appVersion: createDeviceDto.appVersion,

      osVersion: createDeviceDto.osVersion,

      platform: createDeviceDto.platform,

      deviceToken: createDeviceDto.deviceToken,

      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.deviceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Device['id']) {
    return this.deviceRepository.findById(id);
  }

  findByIds(ids: Device['id'][]) {
    return this.deviceRepository.findByIds(ids);
  }

  async update(
    id: Device['id'],

    updateDeviceDto: UpdateDeviceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let user: User | undefined = undefined;

    if (updateDeviceDto.user) {
      const userObject = await this.userService.findById(
        updateDeviceDto.user.id,
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

    return this.deviceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      isActive: updateDeviceDto.isActive,

      model: updateDeviceDto.model,

      appVersion: updateDeviceDto.appVersion,

      osVersion: updateDeviceDto.osVersion,

      platform: updateDeviceDto.platform,

      deviceToken: updateDeviceDto.deviceToken,

      user,
    });
  }

  remove(id: Device['id']) {
    return this.deviceRepository.remove(id);
  }

  async findByme(
    userJwtPayload: JwtPayloadType,
  ): Promise<DeviceUserResponseDto[]> {
    const devices = await this.deviceRepository.findByUserId(userJwtPayload.id);
    return devices.map((device) =>
      plainToInstance(DeviceUserResponseDto, device),
    );
  }

  async findByUserId(userId: User['id']): Promise<DeviceUserResponseDto[]> {
    const devices = await this.deviceRepository.findByUserId(userId);
    return devices.map((device) =>
      plainToInstance(DeviceUserResponseDto, device),
    );
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterDeviceDto | null;
    sortOptions?: SortDeviceDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Device[]> {
    return this.deviceRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
