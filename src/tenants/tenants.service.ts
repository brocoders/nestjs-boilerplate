import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './infrastructure/persistence/tenant.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Tenant } from './domain/tenant';

@Injectable()
export class TenantsService {
  constructor(
    // Dependencies here
    private readonly tenantRepository: TenantRepository,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.tenantRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      isActive: createTenantDto.isActive,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.tenantRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Tenant['id']) {
    return this.tenantRepository.findById(id);
  }

  findByIds(ids: Tenant['id'][]) {
    return this.tenantRepository.findByIds(ids);
  }

  async update(
    id: Tenant['id'],

    updateTenantDto: UpdateTenantDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.tenantRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      isActive: updateTenantDto.isActive,
    });
  }

  remove(id: Tenant['id']) {
    return this.tenantRepository.remove(id);
  }
}
