import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceRepository } from './infrastructure/persistence/device.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Device } from './domain/device';

@Injectable()
export class DevicesService {
  constructor(
    // Dependencies here
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createDeviceDto: CreateDeviceDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.deviceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDeviceDto: UpdateDeviceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.deviceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Device['id']) {
    return this.deviceRepository.remove(id);
  }
}
