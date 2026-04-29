import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { VendorEntity } from '../../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';

@Entity({ name: 'shipping_zone' })
@Index(['vendorId'])
export class ShippingZoneEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId!: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor!: VendorEntity;

  @Column({ length: 64 })
  name!: string;

  @Column({
    name: 'country_codes',
    type: 'varchar',
    length: 2,
    array: true,
    default: () => "'{}'::varchar[]",
  })
  countryCodes!: string[];

  @Column({
    name: 'region_codes',
    type: 'varchar',
    length: 64,
    array: true,
    default: () => "'{}'::varchar[]",
  })
  regionCodes!: string[];

  @Column({ name: 'cost_minor_units', type: 'bigint' })
  costMinorUnits!: string;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode!: string;

  @Column({ name: 'free_above_minor_units', type: 'bigint', nullable: true })
  freeAboveMinorUnits!: string | null;

  @Column({ name: 'est_delivery_days_min', type: 'smallint' })
  estDeliveryDaysMin!: number;

  @Column({ name: 'est_delivery_days_max', type: 'smallint' })
  estDeliveryDaysMax!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
