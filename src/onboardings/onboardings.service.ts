import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { OnboardingRepository } from './infrastructure/persistence/onboarding.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Onboarding } from './domain/onboarding';
import {
  OnboardingEntityType,
  OnboardingStepStatus,
} from './infrastructure/persistence/relational/entities/onboarding.entity';
import {
  OnboardingStepDefinition,
  TENANT_ONBOARDING_STEPS,
  USER_ONBOARDING_STEPS,
} from './constants/onboarding-steps.constants';

@Injectable()
export class OnboardingsService {
  constructor(
    @Inject(forwardRef(() => TenantsService))
    private readonly tenantService: TenantsService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly onboardingRepository: OnboardingRepository,
  ) {}

  async initializeOnboarding(
    entityType: OnboardingEntityType,
    entityId: string,
    steps: OnboardingStepDefinition[],
  ): Promise<Onboarding[]> {
    const stepEntities = await Promise.all(
      steps.map((step) =>
        this.onboardingRepository.create({
          ...step,
          entityType,
          description: step.description ?? '',
          [entityType]: { id: entityId },
          metadata: null,
          status: OnboardingStepStatus.PENDING,
          stepKey: step.key,
        }),
      ),
    );

    return stepEntities;
  }

  async initializeUserOnboarding(userId: string): Promise<Onboarding[]> {
    return this.initializeOnboarding(
      OnboardingEntityType.USER,
      userId,
      USER_ONBOARDING_STEPS,
    );
  }

  async initializeTenantOnboarding(tenantId: string): Promise<Onboarding[]> {
    return this.initializeOnboarding(
      OnboardingEntityType.TENANT,
      tenantId,
      TENANT_ONBOARDING_STEPS,
    );
  }

  async completeStep(
    entityType: OnboardingEntityType,
    entityId: string,
    stepKey: string,
    metadata?: Record<string, any>,
    performedBy?: { userId?: string; tenantId?: string },
  ): Promise<Onboarding> {
    const whereCondition = {
      entityType,
      stepKey,
      [entityType]: { id: entityId },
    };

    const step = await this.onboardingRepository.findOne(whereCondition);

    if (!step) {
      throw new NotFoundException(
        `Onboarding step not found for ${entityType} ${entityId}`,
      );
    }

    const updatePayload: Partial<Onboarding> = {
      status: OnboardingStepStatus.COMPLETED,
      metadata: metadata || step.metadata,
      completedAt: new Date(),
    };

    // Set performer if provided
    if (performedBy) {
      if (performedBy.userId) {
        updatePayload.performedByUser = { id: performedBy.userId } as User;
      }
      if (performedBy.tenantId) {
        updatePayload.performedByTenant = {
          id: performedBy.tenantId,
        } as Tenant;
      }
    }

    await this.onboardingRepository.update(step.id, updatePayload);
    return this.onboardingRepository.findOne(
      whereCondition,
    ) as Promise<Onboarding>;
  }

  async skipStep(
    entityType: OnboardingEntityType,
    entityId: string,
    stepKey: string,
    performedBy?: { userId?: string; tenantId?: string },
  ): Promise<Onboarding> {
    const whereCondition = {
      entityType,
      stepKey,
      [entityType]: { id: entityId },
    };

    const step = await this.onboardingRepository.findOne(whereCondition);

    if (!step) {
      throw new NotFoundException(
        `Onboarding step not found for ${entityType} ${entityId}`,
      );
    }

    const updatePayload: Partial<Onboarding> = {
      status: OnboardingStepStatus.SKIPPED,
      completedAt: new Date(),
    };

    // Set performer if provided
    if (performedBy) {
      if (performedBy.userId) {
        updatePayload.performedByUser = { id: performedBy.userId } as User;
      }
      if (performedBy.tenantId) {
        updatePayload.performedByTenant = {
          id: performedBy.tenantId,
        } as Tenant;
      }
    }

    await this.onboardingRepository.update(step.id, updatePayload);
    return this.onboardingRepository.findOne(
      whereCondition,
    ) as Promise<Onboarding>;
  }

  async getOnboardingStatus(
    entityType: OnboardingEntityType,
    entityId: string,
  ): Promise<{
    steps: Onboarding[];
    completedCount: number;
    totalCount: number;
    requiredCompleted: number;
    totalRequired: number;
    percentage: number;
    currentStep: Onboarding | null;
  }> {
    const steps = await this.onboardingRepository.find({
      where: { entityType, [entityType]: { id: entityId } },
      order: { order: 'ASC' },
    });

    const requiredSteps = steps.filter((s) => s.isRequired);
    const completedSteps = steps.filter(
      (s) => s.status === OnboardingStepStatus.COMPLETED,
    );

    const requiredCompleted = requiredSteps.filter(
      (s) => s.status === OnboardingStepStatus.COMPLETED,
    ).length;

    // Find first pending step that isn't blocked by dependencies
    let currentStep: Onboarding | null = null;
    for (const step of steps) {
      if (step.status === OnboardingStepStatus.PENDING) {
        // Check if dependencies are completed
        const stepDef =
          entityType === OnboardingEntityType.USER
            ? USER_ONBOARDING_STEPS.find((s) => s.key === step.stepKey)
            : TENANT_ONBOARDING_STEPS.find((s) => s.key === step.stepKey);

        if (!stepDef) continue;

        const dependenciesCompleted =
          !stepDef.dependencies?.length ||
          stepDef.dependencies.every((depKey) =>
            steps.some(
              (s) =>
                s.stepKey === depKey &&
                s.status === OnboardingStepStatus.COMPLETED,
            ),
          );

        if (dependenciesCompleted) {
          currentStep = step;
          break;
        }
      }
    }

    const percentage = steps.length
      ? Math.round((completedSteps.length / steps.length) * 100)
      : 0;

    return {
      steps,
      completedCount: completedSteps.length,
      totalCount: steps.length,
      requiredCompleted,
      totalRequired: requiredSteps.length,
      percentage,
      currentStep,
    };
  }

  async resetStep(
    entityType: OnboardingEntityType,
    entityId: string,
    stepKey: string,
  ): Promise<Onboarding> {
    const whereCondition = {
      entityType,
      stepKey,
      [entityType]: { id: entityId },
    };

    const step = await this.onboardingRepository.findOne(whereCondition);

    if (!step) {
      throw new NotFoundException(
        `Onboarding step not found for ${entityType} ${entityId}`,
      );
    }

    const updatePayload: Partial<Onboarding> = {
      status: OnboardingStepStatus.PENDING,
      completedAt: null,
      metadata: null,
      performedByUser: null,
      performedByTenant: null,
    };

    await this.onboardingRepository.update(step.id, updatePayload);
    return this.onboardingRepository.findOne(
      whereCondition,
    ) as Promise<Onboarding>;
  }

  async create(createOnboardingDto: CreateOnboardingDto): Promise<Onboarding> {
    let performedByTenant: Tenant | null = null;
    let performedByUser: User | null = null;

    // Handle performedByTenant
    if (createOnboardingDto.performedByTenant) {
      const tenantObject = await this.tenantService.findById(
        createOnboardingDto.performedByTenant.id,
      );
      if (!tenantObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { performedByTenant: 'notExists' },
        });
      }
      performedByTenant = tenantObject;
    }

    // Handle performedByUser
    if (createOnboardingDto.performedByUser) {
      const userObject = await this.userService.findById(
        createOnboardingDto.performedByUser.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { performedByUser: 'notExists' },
        });
      }
      performedByUser = userObject;
    }

    return this.onboardingRepository.create({
      completedAt: createOnboardingDto.completedAt,
      metadata: createOnboardingDto.metadata,
      isSkippable: createOnboardingDto.isSkippable,
      isRequired: createOnboardingDto.isRequired,
      order: createOnboardingDto.order,
      status: createOnboardingDto.status,
      description: createOnboardingDto.description,
      name: createOnboardingDto.name,
      stepKey: createOnboardingDto.stepKey,
      entityType: createOnboardingDto.entityType,
      performedByTenant,
      performedByUser,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Onboarding[]> {
    return this.onboardingRepository.findAllWithPagination({
      paginationOptions,
    });
  }

  findById(id: string): Promise<Onboarding | null> {
    return this.onboardingRepository.findById(id);
  }

  findByIds(ids: string[]): Promise<Onboarding[]> {
    return this.onboardingRepository.findByIds(ids);
  }

  async update(
    id: string,
    updateOnboardingDto: UpdateOnboardingDto,
  ): Promise<Onboarding> {
    let performedByTenant: Tenant | null | undefined = undefined;
    let performedByUser: User | null | undefined = undefined;

    // Handle performedByTenant
    if (updateOnboardingDto.performedByTenant !== undefined) {
      if (updateOnboardingDto.performedByTenant) {
        const tenantObject = await this.tenantService.findById(
          updateOnboardingDto.performedByTenant.id,
        );
        if (!tenantObject) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { performedByTenant: 'notExists' },
          });
        }
        performedByTenant = tenantObject;
      } else {
        performedByTenant = null;
      }
    }

    // Handle performedByUser
    if (updateOnboardingDto.performedByUser !== undefined) {
      if (updateOnboardingDto.performedByUser) {
        const userObject = await this.userService.findById(
          updateOnboardingDto.performedByUser.id,
        );
        if (!userObject) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { performedByUser: 'notExists' },
          });
        }
        performedByUser = userObject;
      } else {
        performedByUser = null;
      }
    }

    const updatePayload: Partial<Onboarding> = {
      completedAt: updateOnboardingDto.completedAt,
      metadata: updateOnboardingDto.metadata,
      isSkippable: updateOnboardingDto.isSkippable,
      isRequired: updateOnboardingDto.isRequired,
      order: updateOnboardingDto.order,
      status: updateOnboardingDto.status,
      description: updateOnboardingDto.description,
      name: updateOnboardingDto.name,
      stepKey: updateOnboardingDto.stepKey,
      entityType: updateOnboardingDto.entityType,
    };

    // Only update performer fields if they are explicitly provided
    if (updateOnboardingDto.performedByTenant !== undefined) {
      updatePayload.performedByTenant = performedByTenant;
    }
    if (updateOnboardingDto.performedByUser !== undefined) {
      updatePayload.performedByUser = performedByUser;
    }

    await this.onboardingRepository.update(id, updatePayload);
    return this.onboardingRepository.findById(id) as Promise<Onboarding>;
  }

  remove(id: string): Promise<void> {
    return this.onboardingRepository.remove(id);
  }
}
