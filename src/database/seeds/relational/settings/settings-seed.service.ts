import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsEntity } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import { TenantEntity } from '../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { SettingsSubjectType } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import { SettingsType } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';
import { RoleEnum } from '../../../../roles/roles.enum';
import { SettingsConfig } from '../../../../settings/infrastructure/persistence/relational/entities/settings.entity';

@Injectable()
export class SettingsSeedService {
  constructor(
    @InjectRepository(SettingsEntity)
    private repository: Repository<SettingsEntity>,
    @InjectRepository(TenantEntity)
    private tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    await this.seedTenantSettings();
    await this.seedUserSettings();
  }

  private async seedTenantSettings() {
    const tenants = await this.tenantRepository.find();

    for (const tenant of tenants) {
      const adminUser = await this.userRepository.findOne({
        where: {
          tenant: { id: tenant.id },
          role: { id: RoleEnum.admin },
        },
      });

      if (adminUser) {
        const existingSetting = await this.repository.findOne({
          where: {
            tenant: { id: tenant.id },
            subjectType: SettingsSubjectType.TENANT,
          },
        });

        if (!existingSetting) {
          await this.repository.save(
            this.repository.create({
              config: this.getDefaultTenantConfig(),
              settingsType: SettingsType.SYSTEM,
              subjectType: SettingsSubjectType.TENANT,
              tenant: tenant,
              user: adminUser,
            }),
          );
        }
      }
    }
  }

  private async seedUserSettings() {
    const users = await this.userRepository.find();

    for (const user of users) {
      const existingSetting = await this.repository.findOne({
        where: {
          user: { id: user.id },
          subjectType: SettingsSubjectType.USER,
        },
      });

      if (!existingSetting) {
        await this.repository.save(
          this.repository.create({
            config: this.getDefaultUserConfig(),
            settingsType: SettingsType.PREFERENCES,
            subjectType: SettingsSubjectType.USER,
            tenant: user.tenant,
            user: user,
          }),
        );
      }
    }
  }

  private getDefaultTenantConfig(): SettingsConfig {
    return {
      currency: 'USD',
      timezone: 'UTC',
      locale: 'en-US',
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
        whatsapp: false,
      },
      paymentGateways: {
        stripe: {
          enabled: true,
          apiKey: 'default_stripe_key',
          webhookSecret: 'default_webhook_secret',
        },
      },
    };
  }

  private getDefaultUserConfig(): SettingsConfig {
    return {
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        whatsapp: false,
      },
      theme: {
        primaryColor: '#3F83F8',
        secondaryColor: '#1F2937',
        darkModeEnabled: false,
      },
    };
  }
}
