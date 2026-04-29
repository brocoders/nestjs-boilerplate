import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RegionEntity } from '../../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { CartItemEntity } from './cart-item.entity';

@Entity({ name: 'cart' })
@Unique('uq_cart_user', ['userId'])
export class CartEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'region_id', type: 'uuid' })
  regionId!: string;

  @ManyToOne(() => RegionEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'region_id' })
  region!: RegionEntity;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode!: string;

  @OneToMany(() => CartItemEntity, (i) => i.cart)
  items!: CartItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
