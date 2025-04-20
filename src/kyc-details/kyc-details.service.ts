import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateKycDetailsDto } from './dto/create-kyc-details.dto';
import { UpdateKycDetailsDto } from './dto/update-kyc-details.dto';
import { KycDetailsRepository } from './infrastructure/persistence/kyc-details.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { KycDetails } from './domain/kyc-details';
import { KycStatus } from './infrastructure/persistence/relational/entities/kyc-details.entity';

@Injectable()
export class KycDetailsService {
  constructor(
    @Inject(forwardRef(() => TenantsService))
    private readonly tenantService: TenantsService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // Dependencies here
    private readonly kycDetailsRepository: KycDetailsRepository,
  ) {}

  async create(createKycDetailsDto: CreateKycDetailsDto) {
    // Do not remove comment below.
    // <creating-property />

    const tenantObject = await this.tenantService.findById(
      createKycDetailsDto.tenant.id,
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

    const userObject = await this.userService.findById(
      createKycDetailsDto.user.id,
    );
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.kycDetailsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      verifiedBy: createKycDetailsDto.verifiedBy,

      verifiedAt: createKycDetailsDto.verifiedAt,

      submittedAt: createKycDetailsDto.submittedAt,

      status: createKycDetailsDto.status ?? KycStatus.PENDING,

      documentData: createKycDetailsDto.documentData,

      documentNumber: createKycDetailsDto.documentNumber,

      documentType: createKycDetailsDto.documentType,

      subjectType: createKycDetailsDto.subjectType,

      tenant,

      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.kycDetailsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: KycDetails['id']) {
    return this.kycDetailsRepository.findById(id);
  }

  findByIds(ids: KycDetails['id'][]) {
    return this.kycDetailsRepository.findByIds(ids);
  }

  async update(
    id: KycDetails['id'],

    updateKycDetailsDto: UpdateKycDetailsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let tenant: Tenant | undefined = undefined;

    if (updateKycDetailsDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateKycDetailsDto.tenant.id,
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

    let user: User | undefined = undefined;

    if (updateKycDetailsDto.user) {
      const userObject = await this.userService.findById(
        updateKycDetailsDto.user.id,
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

    return this.kycDetailsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      verifiedBy: updateKycDetailsDto.verifiedBy,

      verifiedAt: updateKycDetailsDto.verifiedAt,

      submittedAt: updateKycDetailsDto.submittedAt,

      status: updateKycDetailsDto.status,

      documentData: updateKycDetailsDto.documentData,

      documentNumber: updateKycDetailsDto.documentNumber,

      documentType: updateKycDetailsDto.documentType,

      subjectType: updateKycDetailsDto.subjectType,

      tenant,

      user,
    });
  }

  remove(id: KycDetails['id']) {
    return this.kycDetailsRepository.remove(id);
  }
}
