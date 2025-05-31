import { TenantsService } from '../tenants/tenants.service';
import { Tenant } from '../tenants/domain/tenant';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  NotFoundException,
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
    private readonly tenantService: TenantsService,

    private readonly userService: UsersService,

    // Dependencies here
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
  ): Promise<Onboarding> {
    const step = await this.onboardingRepository.findOne({
      entityType,
      stepKey,
      [entityType]: { id: entityId },
    });

    if (!step) {
      throw new NotFoundException(
        `Onboarding step not found for ${entityType} ${entityId}`,
      );
    }

    const updatePayload = {
      status: OnboardingStepStatus.COMPLETED,
      metadata: metadata || step.metadata,
      completedAt: new Date(),
    };

    await this.onboardingRepository.update(step.id, updatePayload);
    return this.onboardingRepository.findById(step.id) as Promise<Onboarding>;
  }

  async skipStep(
    entityType: OnboardingEntityType,
    entityId: string,
    stepKey: string,
  ): Promise<Onboarding> {
    const step = await this.onboardingRepository.findOne({
      entityType,
      stepKey,
      [entityType]: { id: entityId },
    });

    if (!step) {
      throw new NotFoundException(
        `Onboarding step not found for ${entityType} ${entityId}`,
      );
    }

    const updatePayload = {
      status: OnboardingStepStatus.SKIPPED,
      completedAt: new Date(),
    };

    await this.onboardingRepository.update(step.id, updatePayload);
    return this.onboardingRepository.findById(step.id) as Promise<Onboarding>;
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
    const step = await this.onboardingRepository.findOne({
      entityType,
      stepKey,
      [entityType]: { id: entityId },
    });

    if (!step) {
      throw new NotFoundException(
        `Onboarding step not found for ${entityType} ${entityId}`,
      );
    }

    const updatePayload = {
      status: OnboardingStepStatus.PENDING,
      completedAt: null,
      metadata: null,
    };

    await this.onboardingRepository.update(step.id, updatePayload);
    return this.onboardingRepository.findById(step.id) as Promise<Onboarding>;
  }

  async create(createOnboardingDto: CreateOnboardingDto) {
    // Do not remove comment below.
    // <creating-property />

    let tenant: Tenant | null | undefined = undefined;

    if (createOnboardingDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        createOnboardingDto.tenant.id,
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
    } else if (createOnboardingDto.tenant === null) {
      tenant = null;
    }

    let user: User | null | undefined = undefined;

    if (createOnboardingDto.user) {
      const userObject = await this.userService.findById(
        createOnboardingDto.user.id,
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
    } else if (createOnboardingDto.user === null) {
      user = null;
    }

    return this.onboardingRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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

      tenant,

      user,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.onboardingRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Onboarding['id']) {
    return this.onboardingRepository.findById(id);
  }

  findByIds(ids: Onboarding['id'][]) {
    return this.onboardingRepository.findByIds(ids);
  }

  async update(
    id: Onboarding['id'],

    updateOnboardingDto: UpdateOnboardingDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let tenant: Tenant | null | undefined = undefined;

    if (updateOnboardingDto.tenant) {
      const tenantObject = await this.tenantService.findById(
        updateOnboardingDto.tenant.id,
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
    } else if (updateOnboardingDto.tenant === null) {
      tenant = null;
    }

    let user: User | null | undefined = undefined;

    if (updateOnboardingDto.user) {
      const userObject = await this.userService.findById(
        updateOnboardingDto.user.id,
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
    } else if (updateOnboardingDto.user === null) {
      user = null;
    }

    return this.onboardingRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
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

      tenant,

      user,
    });
  }

  remove(id: Onboarding['id']) {
    return this.onboardingRepository.remove(id);
  }
}
