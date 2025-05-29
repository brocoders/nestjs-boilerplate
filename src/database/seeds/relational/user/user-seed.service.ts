import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import {
  SettingsConfig,
  SettingsEntity,
  SettingsSubjectType,
  SettingsType,
} from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import {
  KycDetailsEntity,
  KycStatus,
  KycSubjectType,
} from '../../../../kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';
import { AuthProvidersEnum } from '../../../../auth/auth-providers.enum';

@Injectable()
export class UserSeedService {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
    @InjectRepository(KycDetailsEntity)
    private readonly kycRepository: Repository<KycDetailsEntity>,
  ) {}

  async run() {
    const tenants = await this.tenantRepository.find({
      relations: ['roles'],
    });

    for (const tenant of tenants) {
      const roles = await this.roleRepository.find({
        where: { tenant: { id: tenant.id } },
      });

      for (const role of roles) {
        if (role.name === 'Customer') {
          await this.createMultipleCustomers(tenant, role);
        } else if (role.name === 'Agent') {
          await this.createMultipleAgents(tenant, role);
        } else {
          await this.createUserForRole(tenant, role);
        }
      }
    }
  }

  private async createMultipleCustomers(
    tenant: TenantEntity,
    role: RoleEntity,
  ) {
    const existingCustomers = await this.userRepository.find({
      where: {
        tenant: { id: tenant.id },
        role: { id: role.id },
      },
    });

    const customersToCreate = 10 - existingCustomers.length;

    if (customersToCreate <= 0) {
      this.logger.log(
        `Tenant ${tenant.name} already has ${existingCustomers.length} customers. Skipping creation.`,
      );
      return;
    }

    this.logger.log(
      `Creating ${customersToCreate} customers for tenant ${tenant.name}`,
    );

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('secret', salt);

    for (let i = 1; i <= customersToCreate; i++) {
      const userData = this.buildUserData(tenant, role, password, i);
      const savedUser = await this.userRepository.save(userData);
      await this.createUserSettings(tenant, savedUser);
      await this.createUserKyc(tenant, savedUser);
    }
  }

  private async createMultipleAgents(tenant: TenantEntity, role: RoleEntity) {
    const existingAgents = await this.userRepository.find({
      where: {
        tenant: { id: tenant.id },
        role: { id: role.id },
      },
    });

    const agentsToCreate = 5 - existingAgents.length;

    if (agentsToCreate <= 0) {
      this.logger.log(
        `Tenant ${tenant.name} already has ${existingAgents.length} agents. Skipping creation.`,
      );
      return;
    }

    this.logger.log(
      `Creating ${agentsToCreate} agents for tenant ${tenant.name}`,
    );

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('secret', salt);
    const regions = await this.regionRepository.find({
      where: { tenant: { id: tenant.id } },
      take: 3, // Get regions for assignment
    });

    for (let i = 1; i <= agentsToCreate; i++) {
      const userData = this.buildUserData(tenant, role, password, i);

      // Assign regions to agents
      if (regions.length > 0) {
        const agentRegions = [regions[i % regions.length]];
        if (regions.length > 1)
          agentRegions.push(regions[(i + 1) % regions.length]);
        userData.regions = agentRegions;
      }
      userData.fullyOnboarded = false;
      const savedUser = await this.userRepository.save(userData);
      await this.createUserSettings(tenant, savedUser);
      await this.createUserKyc(tenant, savedUser);
    }
  }

  private async createUserForRole(tenant: TenantEntity, role: RoleEntity) {
    const existingUser = await this.userRepository.findOne({
      where: {
        tenant: { id: tenant.id },
        role: { id: role.id },
      },
    });

    if (!existingUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);
      const userData = this.buildUserData(tenant, role, password);
      const savedUser = await this.userRepository.save(userData);
      await this.createUserSettings(tenant, savedUser);
      await this.createUserKyc(tenant, savedUser);
    }
  }

  private buildUserData(
    tenant: TenantEntity,
    role: RoleEntity,
    password: string,
    index?: number,
  ): Partial<UserEntity> {
    const roleName = role.name || '';
    const tenantNamePart = tenant?.name
      ? tenant.name.toLowerCase().replace(/\s+/g, '')
      : 'tenant';

    // Generate unique identifiers
    const email = `${roleName.toLowerCase()}${index ? index : ''}.${tenantNamePart}@example.com`;
    const phoneNumber = `+1${5550000000 + (index || 0)}`;

    return this.userRepository.create({
      firstName: roleName,
      lastName: index ? `User${index}` : 'User',
      email,
      phoneNumber,
      countryCode: 'US',
      password,
      tenant,
      role,
      fullyOnboarded: false,
      provider: AuthProvidersEnum.email,
      status: { id: StatusEnum.active },
    });
  }

  private async createUserSettings(tenant: TenantEntity, user: UserEntity) {
    const roleName = user.role?.name || '';

    const defaultConfig: SettingsConfig = {
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
        whatsapp: false,
      },
      theme: {
        primaryColor: '#4CAF50',
        secondaryColor: '#FFC107',
        darkModeEnabled: true,
      },
      ...(roleName === 'Customer' ? this.getCustomerSettings() : {}),
      ...(roleName === 'Agent' ? this.getAgentSettings() : {}),
    };

    const settings = this.settingsRepository.create({
      config: defaultConfig,
      settingsType: SettingsType.PREFERENCES,
      subjectType: SettingsSubjectType.USER,
      tenant,
      user,
    });

    await this.settingsRepository.save(settings);
    this.logger.log(`Created settings for ${roleName} user ${user.email}`);
  }

  private getCustomerSettings(): Partial<SettingsConfig> {
    return {
      wasteCategories: ['Organic', 'Plastic', 'Paper', 'Glass'],
      collectionFrequencies: ['weekly', 'bi-weekly', 'monthly'],
      pricingModel: 'volume_based',
      minimumPickupAmount: 20,
      subscriptionPlans: {
        basic: {
          price: 49.99,
          features: ['Weekly pickup', '2 bins'],
          limits: { pickupsPerMonth: 4, bins: 2 },
        },
      },
    };
  }

  private getAgentSettings(): Partial<SettingsConfig> {
    return {
      workingHours: {
        start: '08:00',
        end: '17:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
      driverSettings: {
        allowDriverAssignment: true,
        maxPickupsPerDay: 15,
        routeOptimizationEnabled: true,
      },
      binTrackingEnabled: true,
      vehicleTrackingEnabled: true,
    };
  }

  private async createUserKyc(tenant: TenantEntity, user: UserEntity) {
    const roleName = user.role?.name || '';
    const kycStatus =
      roleName === 'Agent' ? KycStatus.VERIFIED : KycStatus.PENDING;

    const kycData = this.kycRepository.create({
      status: kycStatus,
      subjectType: KycSubjectType.USER,
      documentType: 'national_id',
      documentNumber: `ID-${user.id.toString().slice(0, 8).toUpperCase()}`,
      documentData: {
        frontUrl: 'https://example.com/kyc/front.jpg',
        backUrl: 'https://example.com/kyc/back.jpg',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
      submittedAt: kycStatus === KycStatus.VERIFIED ? new Date() : undefined,
      verifiedAt: kycStatus === KycStatus.VERIFIED ? new Date() : undefined,
      tenant,
      user,
    });

    await this.kycRepository.save(kycData);
    this.logger.log(
      `Created KYC for ${roleName} user ${user.email} (Status: ${kycStatus})`,
    );
  }
}
