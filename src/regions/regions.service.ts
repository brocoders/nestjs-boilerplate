import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RegionRepository } from './infrastructure/persistence/region.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Region } from './domain/region';

@Injectable()
export class RegionsService {
  constructor(
    @Inject(forwardRef(() => TenantsService))
    private readonly tenantService: TenantsService,

    // Dependencies here
    private readonly regionRepository: RegionRepository,
  ) {}

  async create(createRegionDto: CreateRegionDto) {
    // Do not remove comment below.
    // <creating-property />

    const tenantObject = await this.tenantService.findById(
      createRegionDto.tenant.id,
    );
    if (!tenantObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          tenant: 'notExists',
        },
      });
    }
    const tenant = tenantObject;

    return this.regionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      zipCodes: createRegionDto.zipCodes,

      operatingHours: createRegionDto.operatingHours,

      serviceTypes: createRegionDto.serviceTypes,

      centroidLon: createRegionDto.centroidLon,

      centroidLat: createRegionDto.centroidLat,

      boundary: createRegionDto.boundary,

      name: createRegionDto.name,

      tenant,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.regionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Region['id']) {
    return this.regionRepository.findById(id);
  }

  findByIds(ids: Region['id'][]) {
    return this.regionRepository.findByIds(ids);
  }

  async update(
    id: Region['id'],

    updateRegionDto: UpdateRegionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let tenant: Tenant | undefined = undefined;

    if (updateRegionDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateRegionDto.tenant.id,
      );
      if (!tenantObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            tenant: 'notExists',
          },
        });
      }
      tenant = tenantObject;
    }

    return this.regionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      zipCodes: updateRegionDto.zipCodes,

      operatingHours: updateRegionDto.operatingHours,

      serviceTypes: updateRegionDto.serviceTypes,

      centroidLon: updateRegionDto.centroidLon,

      centroidLat: updateRegionDto.centroidLat,

      boundary: updateRegionDto.boundary,

      name: updateRegionDto.name,

      tenant,
    });
  }

  remove(id: Region['id']) {
    return this.regionRepository.remove(id);
  }
}
