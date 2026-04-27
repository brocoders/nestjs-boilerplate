import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { VendorStatus } from '../../../../domain/vendor';

@Entity({ name: 'vendor' })
@Unique('uq_vendor_user', ['userId'])
@Unique('uq_vendor_slug', ['slug'])
@Index(['status'])
export class VendorEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ length: 64 })
  slug!: string;

  @Column({ name: 'name_translations', type: 'jsonb' })
  nameTranslations!: Record<string, string>;

  @Column({
    name: 'description_translations',
    type: 'jsonb',
    default: () => "'{}'::jsonb",
  })
  descriptionTranslations!: Record<string, string>;

  @Column({ name: 'logo_file_id', type: 'uuid', nullable: true })
  logoFileId!: string | null;

  @ManyToOne(() => FileEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'logo_file_id' })
  logoFile!: FileEntity | null;

  @Column({ name: 'banner_file_id', type: 'uuid', nullable: true })
  bannerFileId!: string | null;

  @ManyToOne(() => FileEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'banner_file_id' })
  bannerFile!: FileEntity | null;

  @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.PENDING })
  status!: VendorStatus;

  @Column({ name: 'default_region_id', type: 'uuid' })
  defaultRegionId!: string;

  @Column({
    name: 'supported_region_ids',
    type: 'uuid',
    array: true,
    default: () => 'ARRAY[]::uuid[]',
  })
  supportedRegionIds!: string[];

  @Column({ name: 'return_window_days', type: 'smallint', default: 14 })
  returnWindowDays!: number;

  @Column({
    name: 'ships_from_country',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  shipsFromCountry!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
