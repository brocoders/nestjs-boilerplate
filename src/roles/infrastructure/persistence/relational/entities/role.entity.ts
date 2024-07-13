import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Number,
  })
  @PrimaryColumn()
  id: number;

  @ApiProperty({
    type: String,
    example: 'admin',
  })
  @Column()
  name?: string;
}
