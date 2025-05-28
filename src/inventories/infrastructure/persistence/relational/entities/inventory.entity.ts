import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'inventory',
})
export class InventoryEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  unitOfMeasure?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  materialType?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  accountType: string;

  @Column({
    nullable: true,
    type: Number,
  })
  salePrice?: number | null;

  @Column({
    nullable: false,
    type: Number,
  })
  purchasePrice: number;

  @Column({
    nullable: false,
    type: Number,
  })
  quantity: number;

  @Column({
    nullable: true,
    type: String,
  })
  itemDescription?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  itemName?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // @OneToMany(() => GoodsReceipt, receipt => receipt.inventory)
  // receipts: GoodsReceipt[];
}
