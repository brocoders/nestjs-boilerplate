import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
export enum AuditAction {
  // CRUD actions
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',

  // Onboarding-specific actions
  COMPLETE_STEP = 'complete_step',
  SKIP_STEP = 'skip_step',
  RESTART_STEP = 'restart_step',

  // Auth-related actions
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_COMPLETE = 'password_reset_complete',

  // Permission & Role changes
  ASSIGN_ROLE = 'assign_role',
  REMOVE_ROLE = 'remove_role',
  UPDATE_PERMISSIONS = 'update_permissions',

  // User-related
  INVITE_USER = 'invite_user',
  ACTIVATE_USER = 'activate_user',
  DEACTIVATE_USER = 'deactivate_user',

  // Tenant-related
  CREATE_TENANT = 'create_tenant',
  UPDATE_TENANT = 'update_tenant',
  DELETE_TENANT = 'delete_tenant',
  SWITCH_TENANT = 'switch_tenant',

  // File or data operations
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  EXPORT = 'export',
  IMPORT = 'import',

  // Settings and configuration
  UPDATE_SETTINGS = 'update_settings',
  RESET_SETTINGS = 'reset_settings',

  // Audit & logs
  VIEW_AUDIT_LOG = 'view_audit_log',
  EXPORT_AUDIT_LOG = 'export_audit_log',

  // System events
  SYSTEM_START = 'system_start',
  SYSTEM_SHUTDOWN = 'system_shutdown',
  SYSTEM_ERROR = 'system_error',

  // Notification
  SEND_NOTIFICATION = 'send_notification',
  READ_NOTIFICATION = 'read_notification',

  // Misc
  ARCHIVE = 'archive',
  RESTORE = 'restore',
  TAG = 'tag',
  UNTAG = 'untag',
}

@Entity({
  name: 'audit_log',
})
export class AuditLogEntity extends EntityRelationalHelper {
  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  performedByUser?: UserEntity | null;

  @ManyToOne(() => TenantEntity, { eager: true, nullable: true })
  performedByTenant?: TenantEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  status?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  beforeState?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  afterState?: Record<string, any>;

  @Column({
    nullable: true,
    type: String,
  })
  entityId?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  entityType: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
