import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OnboardingsService } from './onboardings.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Onboarding } from './domain/onboarding';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllOnboardingsDto } from './dto/find-all-onboardings.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { OnboardingEntityType } from './infrastructure/persistence/relational/entities/onboarding.entity';
import { AuditAction } from '../audit-logs/infrastructure/persistence/relational/entities/audit-log.entity';

@ApiTags('Onboardings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'onboardings',
  version: '1',
})
export class OnboardingsController {
  constructor(
    private readonly onboardingsService: OnboardingsService,
    private auditService: AuditLogsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: Onboarding,
  })
  create(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.onboardingsService.create(createOnboardingDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Onboarding),
  })
  async findAll(
    @Query() query: FindAllOnboardingsDto,
  ): Promise<InfinityPaginationResponseDto<Onboarding>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.onboardingsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Onboarding,
  })
  findById(@Param('id') id: string) {
    return this.onboardingsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Onboarding,
  })
  update(
    @Param('id') id: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ) {
    return this.onboardingsService.update(id, updateOnboardingDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.onboardingsService.remove(id);
  }

  @Get(':entityType/:entityId/status')
  @ApiParam({ name: 'entityType', enum: OnboardingEntityType })
  @ApiParam({ name: 'entityId', type: String })
  getOnboardingStatus(
    @Param('entityType') entityType: OnboardingEntityType,
    @Param('entityId') entityId: string,
  ) {
    return this.onboardingsService.getOnboardingStatus(entityType, entityId);
  }

  @Post('initialize/:entityType/:entityId')
  @ApiParam({ name: 'entityType', enum: OnboardingEntityType })
  @ApiParam({ name: 'entityId', type: String })
  initialize(
    @Param('entityType') entityType: OnboardingEntityType,
    @Param('entityId') entityId: string,
  ) {
    if (entityType === OnboardingEntityType.USER) {
      return this.onboardingsService.initializeUserOnboarding(entityId);
    } else if (entityType === OnboardingEntityType.TENANT) {
      return this.onboardingsService.initializeTenantOnboarding(entityId);
    }
    throw new NotFoundException('Invalid entity type');
  }

  @Post(':entityType/:entityId/complete/:stepKey')
  @ApiParam({ name: 'entityType', enum: OnboardingEntityType })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'stepKey', type: String })
  async completeStep(
    @Param('entityType') entityType: OnboardingEntityType,
    @Param('entityId') entityId: string,
    @Param('stepKey') stepId: string,
    @Body() body: { metadata?: Record<string, any>; performedBy?: any },
  ) {
    const result = await this.onboardingsService.completeStep(
      entityType,
      entityId,
      stepId,
      body.metadata,
      body.performedBy,
    );

    await this.auditService.logEvent(
      AuditAction.COMPLETE_STEP,
      entityType,
      entityId,
      {
        userId: entityType === OnboardingEntityType.USER ? entityId : undefined,
        tenantId:
          entityType === OnboardingEntityType.TENANT ? entityId : undefined,
      },
      undefined,
      { step: stepId, status: 'completed' },
      `${entityType} completed onboarding step: ${stepId}`,
      stepId,
    );

    return result;
  }

  @Post(':entityType/:entityId/skip/:stepKey')
  @ApiParam({ name: 'entityType', enum: OnboardingEntityType })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'stepKey', type: String })
  async skipStep(
    @Param('entityType') entityType: OnboardingEntityType,
    @Param('entityId') entityId: string,
    @Param('stepKey') stepKey: string,
    @Body() body: { performedBy?: any },
  ) {
    const result = await this.onboardingsService.skipStep(
      entityType,
      entityId,
      stepKey,
      body.performedBy,
    );

    await this.auditService.logEvent(
      AuditAction.SKIP_STEP,
      entityType,
      entityId,
      {
        userId: entityType === OnboardingEntityType.USER ? entityId : undefined,
        tenantId:
          entityType === OnboardingEntityType.TENANT ? entityId : undefined,
      },
      undefined,
      { step: stepKey, status: 'skipped' },
      `${entityType} skipped onboarding step: ${stepKey}`,
      stepKey,
    );

    return result;
  }

  @Post(':entityType/:entityId/reset/:stepKey')
  @ApiParam({ name: 'entityType', enum: OnboardingEntityType })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'stepKey', type: String })
  async resetStep(
    @Param('entityType') entityType: OnboardingEntityType,
    @Param('entityId') entityId: string,
    @Param('stepKey') stepKey: string,
  ) {
    return this.onboardingsService.resetStep(entityType, entityId, stepKey);
  }

  @Get(':entityType/:entityId/step/:stepKey')
  @ApiParam({ name: 'entityType', enum: OnboardingEntityType })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'stepKey', type: String })
  async getStepStatus(
    @Param('entityType') entityType: OnboardingEntityType,
    @Param('entityId') entityId: string,
    @Param('stepKey') stepKey: string,
  ) {
    return this.onboardingsService.getStepStatus(entityType, entityId, stepKey);
  }
}
