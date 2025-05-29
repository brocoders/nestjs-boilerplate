import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { RegionsService } from '../regions/regions.service';
import { Region } from '../regions/domain/region';

import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateResidenceDto } from './dto/create-residence.dto';
import { UpdateResidenceDto } from './dto/update-residence.dto';
import { ResidenceRepository } from './infrastructure/persistence/residence.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Residence } from './domain/residence';

@Injectable()
export class ResidencesService {
  constructor(
    private readonly userService: UsersService,

    private readonly regionService: RegionsService,

    private readonly tenantService: TenantsService,

    // Dependencies here
    private readonly residenceRepository: ResidenceRepository,
  ) {}

  async create(createResidenceDto: CreateResidenceDto) {
    // Do not remove comment below.
    // <creating-property />
    let occupants: User[] | null | undefined = undefined;

    if (createResidenceDto.occupants) {
      const occupantsObjects = await this.userService.findByIds(
        createResidenceDto.occupants.map((entity) => entity.id),
      );
      if (occupantsObjects.length !== createResidenceDto.occupants.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            occupants: 'notExists',
          },
        });
      }
      occupants = occupantsObjects;
    } else if (createResidenceDto.occupants === null) {
      occupants = null;
    }

    const regionObject = await this.regionService.findById(
      createResidenceDto.region.id,
    );
    if (!regionObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          region: 'notExists',
        },
      });
    }
    const region = regionObject;

    const tenantObject = await this.tenantService.findById(
      createResidenceDto.tenant.id,
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

    return this.residenceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />

      type: createResidenceDto.type,

      occupants,

      region,

      tenant,

      isActive: createResidenceDto.isActive,

      charge: createResidenceDto.charge,

      name: createResidenceDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.residenceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Residence['id']) {
    return this.residenceRepository.findById(id);
  }

  findByIds(ids: Residence['id'][]) {
    return this.residenceRepository.findByIds(ids);
  }

  async update(
    id: Residence['id'],

    updateResidenceDto: UpdateResidenceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let occupants: User[] | null | undefined = undefined;

    if (updateResidenceDto.occupants) {
      const occupantsObjects = await this.userService.findByIds(
        updateResidenceDto.occupants.map((entity) => entity.id),
      );
      if (occupantsObjects.length !== updateResidenceDto.occupants.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            occupants: 'notExists',
          },
        });
      }
      occupants = occupantsObjects;
    } else if (updateResidenceDto.occupants === null) {
      occupants = null;
    }

    let region: Region | undefined = undefined;

    if (updateResidenceDto.region) {
      const regionObject = await this.regionService.findById(
        updateResidenceDto.region.id,
      );
      if (!regionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            region: 'notExists',
          },
        });
      }
      region = regionObject;
    }

    let tenant: Tenant | undefined = undefined;

    if (updateResidenceDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateResidenceDto.tenant.id,
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

    return this.residenceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />

      type: updateResidenceDto.type,

      occupants,

      region,

      tenant,

      isActive: updateResidenceDto.isActive,

      charge: updateResidenceDto.charge,

      name: updateResidenceDto.name,
    });
  }

  remove(id: Residence['id']) {
    return this.residenceRepository.remove(id);
  }
}
