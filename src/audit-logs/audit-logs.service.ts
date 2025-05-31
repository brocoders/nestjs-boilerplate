import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { AuditLogRepository } from './infrastructure/persistence/audit-log.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AuditLog } from './domain/audit-log';
import { AuditAction } from './infrastructure/persistence/relational/entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  auditLogRepo: any;
  constructor(
    private readonly userService: UsersService,

    private readonly tenantService: TenantsService,

    // Dependencies here
    private readonly auditLogRepository: AuditLogRepository,
  ) {}
  async logEvent(
    action: AuditAction,
    entityType: string,
    entityId: string,
    performedBy?: { userId?: string; tenantId?: string },
    beforeState?: Record<string, any>,
    afterState?: Record<string, any>,
    description?: string,
    relatedStep?: string,
  ) {
    const payload: any = {
      action,
      entityType,
      entityId,
      beforeState,
      afterState,
      description,
      relatedStep,
    };
    if (performedBy?.userId)
      payload.performedByUser = { id: performedBy.userId };
    if (performedBy?.tenantId)
      payload.performedByTenant = { id: performedBy.tenantId };
    const log = this.auditLogRepository.create(payload);

    return log;
  }
  async create(createAuditLogDto: CreateAuditLogDto) {
    // Do not remove comment below.
    // <creating-property />
    let performedByUser: User | null | undefined = undefined;

    if (createAuditLogDto.performedByUserId) {
      const performedByUserObject = await this.userService.findById(
        createAuditLogDto.performedByUserId,
      );
      if (!performedByUserObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            performedByUser: 'notExists',
          },
        });
      }
      performedByUser = performedByUserObject;
    } else if (createAuditLogDto.performedByUserId === null) {
      performedByUser = null;
    }

    let performedByTenant: Tenant | null | undefined = undefined;

    if (createAuditLogDto.performedByTenantId) {
      const performedByTenantObject = await this.tenantService.findById(
        createAuditLogDto.performedByTenantId,
      );
      if (!performedByTenantObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            performedByTenant: 'notExists',
          },
        });
      }
      performedByTenant = performedByTenantObject;
    } else if (createAuditLogDto.performedByTenantId === null) {
      performedByTenant = null;
    }

    return this.auditLogRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      performedByUser,

      performedByTenant,

      status: createAuditLogDto.status,

      description: createAuditLogDto.description,

      afterState: createAuditLogDto.afterState,

      beforeState: createAuditLogDto.beforeState,

      entityId: createAuditLogDto.entityId,

      entityType: createAuditLogDto.entityType,

      action: createAuditLogDto.action,
    });
  }
  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return await this.auditLogRepo.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['performedByUser', 'performedByTenant'],
    });
  }
  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.auditLogRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AuditLog['id']) {
    return this.auditLogRepository.findById(id);
  }

  findByIds(ids: AuditLog['id'][]) {
    return this.auditLogRepository.findByIds(ids);
  }

  async update(
    id: AuditLog['id'],

    updateAuditLogDto: UpdateAuditLogDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let performedByUser: User | null | undefined = undefined;

    if (updateAuditLogDto.performedByUserId) {
      const performedByUserObject = await this.userService.findById(
        updateAuditLogDto.performedByUserId,
      );
      if (!performedByUserObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            performedByUser: 'notExists',
          },
        });
      }
      performedByUser = performedByUserObject;
    } else if (updateAuditLogDto.performedByUserId === null) {
      performedByUser = null;
    }

    let performedByTenant: Tenant | null | undefined = undefined;

    if (updateAuditLogDto.performedByTenantId) {
      const performedByTenantObject = await this.tenantService.findById(
        updateAuditLogDto.performedByTenantId,
      );
      if (!performedByTenantObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            performedByTenant: 'notExists',
          },
        });
      }
      performedByTenant = performedByTenantObject;
    } else if (updateAuditLogDto.performedByTenantId === null) {
      performedByTenant = null;
    }

    return this.auditLogRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      performedByUser,

      performedByTenant,

      status: updateAuditLogDto.status,

      description: updateAuditLogDto.description,

      afterState: updateAuditLogDto.afterState,

      beforeState: updateAuditLogDto.beforeState,

      entityId: updateAuditLogDto.entityId,

      entityType: updateAuditLogDto.entityType,

      action: updateAuditLogDto.action,
    });
  }

  remove(id: AuditLog['id']) {
    return this.auditLogRepository.remove(id);
  }
}
