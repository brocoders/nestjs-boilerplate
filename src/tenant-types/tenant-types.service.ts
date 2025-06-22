import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateTenantTypeDto } from './dto/create-tenant-type.dto';
import { UpdateTenantTypeDto } from './dto/update-tenant-type.dto';
import { TenantTypeRepository } from './infrastructure/persistence/tenant-type.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { TenantType } from './domain/tenant-type';
import { TenantTypeCode } from './infrastructure/persistence/relational/entities/tenant-type.entity';
@Injectable()
export class TenantTypesService {
  constructor(
    // Dependencies here
    private readonly tenantTypeRepository: TenantTypeRepository,
  ) {}

  async create(createTenantTypeDto: CreateTenantTypeDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.tenantTypeRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      description: createTenantTypeDto.description,

      code: createTenantTypeDto.code ?? ('' as TenantTypeCode), // Replace '' with an appropriate default value of type TenantTypeCode

      name: createTenantTypeDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.tenantTypeRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: TenantType['id']) {
    return this.tenantTypeRepository.findById(id);
  }

  findByIds(ids: TenantType['id'][]) {
    return this.tenantTypeRepository.findByIds(ids);
  }

  findOneByCode(code: TenantType['code']) {
    return this.tenantTypeRepository.findByCode(code);
  }
  async update(
    id: TenantType['id'],

    updateTenantTypeDto: UpdateTenantTypeDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.tenantTypeRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      description: updateTenantTypeDto.description,

      code: updateTenantTypeDto.code ?? undefined,

      name: updateTenantTypeDto.name,
    });
  }

  remove(id: TenantType['id']) {
    return this.tenantTypeRepository.remove(id);
  }
}
