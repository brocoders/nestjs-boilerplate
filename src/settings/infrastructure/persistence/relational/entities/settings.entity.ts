import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

export enum SettingsSubjectType {
  TENANT = 'tenant',
  USER = 'user',
  SYSTEM = 'system', // For platform-wide settings
  COLLECTOR = 'collector', // Special role-specific settings
  FACILITY = 'facility', // Waste processing facilities
}

export enum SettingsType {
  // Financial
  INVOICE = 'invoice',
  BILLING = 'billing',
  PAYMENT = 'payment',
  TAX = 'tax',
  COMMISSION = 'commission',

  // Notifications
  NOTIFICATION = 'notification',
  REMINDER = 'reminder',
  ALERT = 'alert',

  // Waste Operations
  WASTE = 'waste',
  COLLECTION = 'collection',
  PROCESSING = 'processing',
  RECYCLING = 'recycling',
  DISPOSAL = 'disposal',

  // Marketplace
  MARKETPLACE = 'marketplace',
  LISTING = 'listing',
  BIDDING = 'bidding',
  TRANSACTION = 'transaction',

  // User Preferences
  PREFERENCES = 'preferences',
  PRIVACY = 'privacy',
  ACCESSIBILITY = 'accessibility',

  // Compliance
  COMPLIANCE = 'compliance',
  CERTIFICATION = 'certification',
  REPORTING = 'reporting',
  AUDIT = 'audit',

  // Technical
  API = 'api',
  INTEGRATION = 'integration',
  SECURITY = 'security',
  RATE_LIMITING = 'rate_limiting',

  // Localization
  LOCALIZATION = 'localization',
  LANGUAGE = 'language',
  CURRENCY = 'currency',
  TIMEZONE = 'timezone',

  // UI/UX
  THEME = 'theme',
  LAYOUT = 'layout',
  DASHBOARD = 'dashboard',

  // System Operations
  SYSTEM = 'system',
  MAINTENANCE = 'maintenance',
  BACKUP = 'backup',
  SCALING = 'scaling',

  // Environmental
  CARBON_ACCOUNTING = 'carbon_accounting',
  SUSTAINABILITY = 'sustainability',

  // Logistics
  ROUTING = 'routing',
  VEHICLE = 'vehicle',
  DRIVER = 'driver',
}
export interface SettingsConfig {
  invoicePrefix?: string;
  currency?: string;
  timezone?: string;
  locale?: string;
  dateFormat?: string;
  defaultLanguage?: string;

  wasteCategories?: string[];
  allowedWasteTypes?: string[];
  collectionFrequencies?: string[];
  serviceAreas?: string[];
  pricingModel?: 'weight_based' | 'volume_based' | 'flat_rate';
  minimumPickupAmount?: number;
  specialServices?: string[];

  roles?: {
    [roleName: string]: {
      permissions: string[];
    };
  };
  defaultRole?: string;

  paymentGateways?: {
    mpesa?: {
      enabled: boolean;
      shortcode: string;
      consumerKey: string;
      consumerSecret: string;
      passkey: string;
      callbackUrl: string;
    };
    paypal?: {
      enabled: boolean;
      clientId: string;
      secret: string;
      mode: 'sandbox' | 'live';
      webhookUrl?: string;
    };
    stripe?: {
      enabled: boolean;
      apiKey: string;
      webhookSecret: string;
    };
    bankTransfer?: {
      enabled: boolean;
      accountName: string;
      accountNumber: string;
      bankName: string;
      swiftCode?: string;
      instructions?: string;
    };
    paystack?: {
      enabled: boolean;
      publicKey: string;
      secretKey: string;
    };
  };

  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
  };

  smsApi?: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    senderId: string;
    callbackUrl?: string;
  };
  whatsappApi?: {
    enabled: boolean;
    provider: string;
    apiUrl: string;
    token: string;
    phoneNumberId: string;
    callbackUrl?: string;
  };
  emailSettings?: {
    fromAddress: string;
    smtpHost: string;
    smtpPort: number;
    username: string;
    password: string;
    secure: boolean;
  };

  companyName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    buttonStyle?: 'rounded' | 'square';
    darkModeEnabled?: boolean;
  };

  marketplaceEnabled?: boolean;
  marketplaceCommission?: number;
  allowExternalVendors?: boolean;

  workingHours?: {
    start: string;
    end: string;
    days: string[];
  };
  driverSettings?: {
    allowDriverAssignment: boolean;
    maxPickupsPerDay: number;
    routeOptimizationEnabled: boolean;
  };
  binTrackingEnabled?: boolean;
  vehicleTrackingEnabled?: boolean;

  subscriptionPlans?: {
    [planName: string]: {
      price: number;
      features: string[];
      limits: {
        pickupsPerMonth?: number;
        bins?: number;
      };
    };
  };
  trialPeriodDays?: number;
  autoRenewal?: boolean;

  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  requireIDVerification?: boolean;

  webhooks?: {
    pickupCompleted?: string;
    invoiceGenerated?: string;
    paymentReceived?: string;
  };
  apiAccess?: {
    enabled: boolean;
    apiKey: string;
    rateLimit?: number;
  };

  aiOptimization?: {
    enabled: boolean;
    autoAssignDrivers: boolean;
    predictPickupNeeds: boolean;
  };
  auditLogging?: boolean;
  backupSettings?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    backupEmail?: string;
  };
}
@Entity({
  name: 'settings',
})
export class SettingsEntity extends EntityRelationalHelper {
  @Column({ type: 'jsonb' })
  config: SettingsConfig;

  @Column({
    type: 'enum',
    enum: SettingsType,
  })
  settingsType: SettingsType;

  @Column({
    type: 'enum',
    enum: SettingsSubjectType,
  })
  subjectType: SettingsSubjectType;

  @ManyToOne(() => TenantEntity, (parentEntity) => parentEntity.settings, {
    eager: false,
    nullable: false,
  })
  tenant: TenantEntity;

  @ManyToOne(() => UserEntity, (parentEntity) => parentEntity.settings, {
    eager: false,
    nullable: false,
  })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
