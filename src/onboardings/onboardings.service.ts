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
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class OnboardingsService {
  private readonly onboardingStepsMap: Record<
    OnboardingEntityType,
    OnboardingStepDefinition[]
  > = {
    [OnboardingEntityType.USER]: USER_ONBOARDING_STEPS,
    [OnboardingEntityType.TENANT]: TENANT_ONBOARDING_STEPS,
  };

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
    const existingSteps = await this.onboardingRepository.find({
      where: {
        entityType,
        ...(entityType === OnboardingEntityType.TENANT
          ? { performedByTenant: { id: entityId } }
          : { performedByUser: { id: entityId } }),
      },
    });

    const existingStepKeys = new Set(existingSteps.map((step) => step.stepKey));

    const newSteps = steps
      .filter((step) => !existingStepKeys.has(step.key))
      .map((step) => {
        const baseData = {
          ...step,
          entityType,
          description: step.description ?? '',
          metadata: null,
          status: OnboardingStepStatus.PENDING,
          stepKey: step.key,
        };

        return this.onboardingRepository.create({
          ...baseData,
          ...(entityType === OnboardingEntityType.TENANT
            ? { performedByTenant: { id: entityId } as any }
            : { performedByUser: { id: entityId } as any }),
        });
      });

    if (!newSteps.length) {
      return [];
    }

    return await Promise.all(newSteps);
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
    stepId: string,
    metadata?: Record<string, any>,
    performedBy?: { userId?: string; tenantId?: string },
  ): Promise<Onboarding> {
    const whereCondition = {
      entityType: entityType.toLowerCase() as OnboardingEntityType,
      id: stepId,
      // [entityType.toLowerCase()]: { id: entityId },
    };
    console.log('Where condition:', whereCondition);
    console.log('Metadata:', metadata);
    const step = await this.onboardingRepository.findOne(whereCondition);

    if (!step) {
      throw new NotFoundException(
        `Onboarding step not found for ${entityType} ${entityId}`,
      );
    }
    //TODO : Validate stepKey against the onboarding steps map
    // TODO : save metadata to actual table
    const updatePayload: Partial<Onboarding> = {
      status: OnboardingStepStatus.COMPLETED,
      metadata: metadata || step.metadata,
      completedAt: new Date(),
    };

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
    const updatedStep = (await this.onboardingRepository.findOne(
      whereCondition,
    )) as Onboarding;
    console.log('Entity Type:', entityType);
    console.log('Entity ID:', entityId);
    console.log('OnboardingEntityType.TENANT:', OnboardingEntityType.TENANT);
    // Check if this was the last step
    if (entityType /**.toLocaleLowerCase() === OnboardingEntityType.TENANT**/) {
      console.log('Checking if this was the last step');
      const allSteps = await this.onboardingRepository.find({
        where: {
          entityType: entityType.toLowerCase() as OnboardingEntityType,
          id: stepId,
        },
      });
      const tenantSteps =
        this.onboardingStepsMap[
          entityType.toLowerCase() as OnboardingEntityType
        ];
      console.log('All tenantSteps:', tenantSteps);
      const lastStep = tenantSteps.reduce(
        (maxStep, step) => (step.order > maxStep.order ? step : maxStep),
        tenantSteps[0],
      );
      console.log('Last step:', lastStep);
      console.log('All steps:', allSteps);
      const isLastStep = updatedStep.stepKey === lastStep.key;
      // Create a map of stepKey to step definition for quick lookup
      const stepsByKey = tenantSteps.reduce<
        Record<string, OnboardingStepDefinition>
      >((acc, stepDef) => {
        acc[stepDef.key] = stepDef;
        return acc;
      }, {});
      const allStepsCompleted = allSteps.every(
        (s) =>
          s.status === OnboardingStepStatus.COMPLETED ||
          (s.status === OnboardingStepStatus.SKIPPED &&
            stepsByKey[s.stepKey]?.isSkippable),
      );
      console.log(
        'isLastStep',
        isLastStep,
        'allStepsCompleted',
        allStepsCompleted,
      );
      if (/**isLastStep &&**/ allStepsCompleted) {
        // Update tenant status
        await this.tenantService.update(entityId, { fullyOnboarded: true });
      }
    }

    return updatedStep;
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
    const condition: FindOptionsWhere<Onboarding> = {
      entityType: entityType.toLowerCase() as OnboardingEntityType,
    };

    if (entityType.toLowerCase() === 'tenant') {
      condition.performedByTenant = { id: entityId }; // Use relation object
    } else {
      condition.performedByUser = { id: entityId }; // Use relation object
    }

    const steps = await this.onboardingRepository.find({
      where: condition,
      order: { order: 'ASC' },
    });

    console.log('getOnboardingStatus Where condition:', condition);
    console.log('getOnboardingStatus Steps:', steps.length);
    const requiredSteps = steps.filter((s) => s.isRequired);
    const completedSteps = steps.filter(
      (s) => s.status === OnboardingStepStatus.COMPLETED,
    );

    const requiredCompleted = requiredSteps.filter(
      (s) => s.status === OnboardingStepStatus.COMPLETED,
    ).length;

    let currentStep: Onboarding | null = null;
    for (const step of steps) {
      if (step.status === OnboardingStepStatus.PENDING) {
        const stepDef = this.onboardingStepsMap[entityType]?.find(
          (s) => s.key === step.stepKey,
        );

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

  async getStepStatus(
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
        `Onboarding step not found for ${entityType} ${entityId} and step ${stepKey}`,
      );
    }

    return step;
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
