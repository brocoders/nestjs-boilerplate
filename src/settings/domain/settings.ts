import { Tenant } from '../../tenants/domain/tenant';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  SettingsConfig,
  SettingsSubjectType,
  SettingsType,
} from '../infrastructure/persistence/relational/entities/settings.entity';

export class Settings {
  @ApiProperty({
    type: Object,
    description: 'Configuration settings',
    example: {
      currency: 'KES',
      notificationPreferences: {
        email: true,
        sms: false,
      },
    },
  })
  config?: SettingsConfig | null;

  @ApiProperty({
    enum: SettingsType,
    description: 'Type of settings category',
  })
  settingsType?: SettingsType;

  @ApiProperty({
    enum: SettingsSubjectType,
    description: 'Subject type this settings applies to',
  })
  subjectType: SettingsSubjectType;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
