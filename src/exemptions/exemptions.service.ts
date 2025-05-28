import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { InvoicesService } from '../invoices/invoices.service';
import { Invoice } from '../invoices/domain/invoice';

import { ResidencesService } from '../residences/residences.service';
import { Residence } from '../residences/domain/residence';

import { RegionsService } from '../regions/regions.service';
import { Region } from '../regions/domain/region';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateExemptionDto } from './dto/create-exemption.dto';
import { UpdateExemptionDto } from './dto/update-exemption.dto';
import { ExemptionRepository } from './infrastructure/persistence/exemption.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Exemption } from './domain/exemption';

@Injectable()
export class ExemptionsService {
  constructor(
    private readonly tenantService: TenantsService,

    private readonly invoiceService: InvoicesService,

    private readonly residenceService: ResidencesService,

    private readonly regionService: RegionsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly exemptionRepository: ExemptionRepository,
  ) {}

  async create(createExemptionDto: CreateExemptionDto) {
    // Do not remove comment below.
    // <creating-property />
    const tenantObject = await this.tenantService.findById(
      createExemptionDto.tenant.id,
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

    let invoice: Invoice | null | undefined = undefined;

    if (createExemptionDto.invoice) {
      const invoiceObject = await this.invoiceService.findById(
        createExemptionDto.invoice.id,
      );
      if (!invoiceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            invoice: 'notExists',
          },
        });
      }
      invoice = invoiceObject;
    } else if (createExemptionDto.invoice === null) {
      invoice = null;
    }

    let residence: Residence | null | undefined = undefined;

    if (createExemptionDto.residence) {
      const residenceObject = await this.residenceService.findById(
        createExemptionDto.residence.id,
      );
      if (!residenceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            residence: 'notExists',
          },
        });
      }
      residence = residenceObject;
    } else if (createExemptionDto.residence === null) {
      residence = null;
    }

    let region: Region | null | undefined = undefined;

    if (createExemptionDto.region) {
      const regionObject = await this.regionService.findById(
        createExemptionDto.region.id,
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
    } else if (createExemptionDto.region === null) {
      region = null;
    }

    let customer: User | null | undefined = undefined;

    if (createExemptionDto.customer) {
      const customerObject = await this.userService.findById(
        createExemptionDto.customer.id,
      );
      if (!customerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            customer: 'notExists',
          },
        });
      }
      customer = customerObject;
    } else if (createExemptionDto.customer === null) {
      customer = null;
    }

    return this.exemptionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tenant,

      invoice,

      residence,

      region,

      customer,

      endDate: createExemptionDto.endDate,

      startDate: createExemptionDto.startDate,

      reason: createExemptionDto.reason,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.exemptionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Exemption['id']) {
    return this.exemptionRepository.findById(id);
  }

  findByIds(ids: Exemption['id'][]) {
    return this.exemptionRepository.findByIds(ids);
  }

  async update(
    id: Exemption['id'],

    updateExemptionDto: UpdateExemptionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tenant: Tenant | undefined = undefined;

    if (updateExemptionDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateExemptionDto.tenant.id,
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

    let invoice: Invoice | null | undefined = undefined;

    if (updateExemptionDto.invoice) {
      const invoiceObject = await this.invoiceService.findById(
        updateExemptionDto.invoice.id,
      );
      if (!invoiceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            invoice: 'notExists',
          },
        });
      }
      invoice = invoiceObject;
    } else if (updateExemptionDto.invoice === null) {
      invoice = null;
    }

    let residence: Residence | null | undefined = undefined;

    if (updateExemptionDto.residence) {
      const residenceObject = await this.residenceService.findById(
        updateExemptionDto.residence.id,
      );
      if (!residenceObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            residence: 'notExists',
          },
        });
      }
      residence = residenceObject;
    } else if (updateExemptionDto.residence === null) {
      residence = null;
    }

    let region: Region | null | undefined = undefined;

    if (updateExemptionDto.region) {
      const regionObject = await this.regionService.findById(
        updateExemptionDto.region.id,
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
    } else if (updateExemptionDto.region === null) {
      region = null;
    }

    let customer: User | null | undefined = undefined;

    if (updateExemptionDto.customer) {
      const customerObject = await this.userService.findById(
        updateExemptionDto.customer.id,
      );
      if (!customerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            customer: 'notExists',
          },
        });
      }
      customer = customerObject;
    } else if (updateExemptionDto.customer === null) {
      customer = null;
    }

    return this.exemptionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tenant,

      invoice,

      residence,

      region,

      customer,

      endDate: updateExemptionDto.endDate,

      startDate: updateExemptionDto.startDate,

      reason: updateExemptionDto.reason,
    });
  }

  remove(id: Exemption['id']) {
    return this.exemptionRepository.remove(id);
  }
}
