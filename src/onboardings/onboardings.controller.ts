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

  @Get('user/:userId/status')
  getUserStatus(@Param('userId') userId: string) {
    return this.onboardingsService.getOnboardingStatus(
      OnboardingEntityType.USER,
      userId,
    );
  }

  @Post('user/:userId/complete/:stepKey')
  async completeUserStep(
    @Param('userId') userId: string,
    @Param('stepKey') stepKey: string,
    @Body() body: any,
  ) {
    const result = await this.onboardingsService.completeStep(
      OnboardingEntityType.USER,
      userId,
      stepKey,
      body.metadata,
    );

    await this.auditService.logEvent(
      AuditAction.COMPLETE_STEP,
      'user',
      userId,
      { userId },
      undefined,
      { step: stepKey, status: 'completed' },
      `User completed onboarding step: ${stepKey}`,
      stepKey,
    );

    return result;
  }

  @Post('tenant/:tenantId/skip/:stepKey')
  async skipTenantStep(
    @Param('tenantId') tenantId: string,
    @Param('stepKey') stepKey: string,
  ) {
    const result = await this.onboardingsService.skipStep(
      OnboardingEntityType.TENANT,
      tenantId,
      stepKey,
    );

    await this.auditService.logEvent(
      AuditAction.SKIP_STEP,
      'tenant',
      tenantId,
      { tenantId },
      undefined,
      { step: stepKey, status: 'skipped' },
      `Tenant skipped onboarding step: ${stepKey}`,
      stepKey,
    );

    return result;
  }
}
