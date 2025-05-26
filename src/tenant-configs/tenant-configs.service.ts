import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateTenantConfigDto } from './dto/create-tenant-config.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { TenantConfigRepository } from './infrastructure/persistence/tenant-config.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { TenantConfig } from './domain/tenant-config';

@Injectable()
export class TenantConfigsService {
  constructor(
    // Dependencies here
    private readonly tenantConfigRepository: TenantConfigRepository,
  ) {}

  async create(createTenantConfigDto: CreateTenantConfigDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.tenantConfigRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      value: createTenantConfigDto.value,

      key: createTenantConfigDto.key,

      tenantId: createTenantConfigDto.tenantId,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.tenantConfigRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: TenantConfig['id']) {
    return this.tenantConfigRepository.findById(id);
  }

  findByIds(ids: TenantConfig['id'][]) {
    return this.tenantConfigRepository.findByIds(ids);
  }

  async update(
    id: TenantConfig['id'],

    updateTenantConfigDto: UpdateTenantConfigDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.tenantConfigRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      value: updateTenantConfigDto.value,

      key: updateTenantConfigDto.key,

      tenantId: updateTenantConfigDto.tenantId,
    });
  }

  remove(id: TenantConfig['id']) {
    return this.tenantConfigRepository.remove(id);
  }
}
