import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '../notifications/domain/notification';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import { CreateDeviceDto, CreateDeviceUserDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceRepository } from './infrastructure/persistence/device.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Device } from './domain/device';
import { plainToInstance } from 'class-transformer';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { DeviceUserResponseDto } from './dto/device-response.dto';
import { FilterDeviceDto, SortDeviceDto } from './dto/query-device.dto';
import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class DevicesService {
  [x: string]: any;
  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationService: NotificationsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    // Do not remove comment below.
    // <creating-property />
    let notifications: Notification[] | null | undefined = undefined;

    if (createDeviceDto.notifications) {
      const notificationsObjects = await this.notificationService.findByIds(
        createDeviceDto.notifications.map((entity) => entity.id),
      );
      if (
        notificationsObjects.length !== createDeviceDto.notifications.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            notifications: 'notExists',
          },
        });
      }
      notifications = notificationsObjects;
    } else if (createDeviceDto.notifications === null) {
      notifications = null;
    }

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
      notifications,

      isActive: createDeviceDto.isActive,

      model: createDeviceDto.model,

      appVersion: createDeviceDto.appVersion,

      osVersion: createDeviceDto.osVersion,

      platform: createDeviceDto.platform,

      deviceToken: createDeviceDto.deviceToken,

      user,
    });
  }

  async createByUser(
    createDeviceUserDto: CreateDeviceUserDto,
    userJwtPayload: JwtPayloadType,
  ) {
    // Do not remove comment below.
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
    const user = userObject;

    return this.deviceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload-by-user />
      isActive: createDeviceUserDto.isActive,
      model: createDeviceUserDto.model,
      appVersion: createDeviceUserDto.appVersion,
      osVersion: createDeviceUserDto.osVersion,
      platform: createDeviceUserDto.platform,
      deviceToken: createDeviceUserDto.deviceToken,
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
    let notifications: Notification[] | null | undefined = undefined;

    if (updateDeviceDto.notifications) {
      const notificationsObjects = await this.notificationService.findByIds(
        updateDeviceDto.notifications.map((entity) => entity.id),
      );
      if (
        notificationsObjects.length !== updateDeviceDto.notifications.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            notifications: 'notExists',
          },
        });
      }
      notifications = notificationsObjects;
    } else if (updateDeviceDto.notifications === null) {
      notifications = null;
    }

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
      notifications,

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
