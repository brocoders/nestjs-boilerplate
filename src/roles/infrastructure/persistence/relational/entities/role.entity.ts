import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper {
  @ApiResponseProperty({
    type: Number,
  })
  @PrimaryColumn()
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  @Column()
  name?: string;
}
