import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.entity';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { Status } from '../statuses/status.entity';
import { IsNotExist } from '../utils/is-not-exists.validator';
import { FileEntity } from '../files/file.entity';
import { IsExist } from '../utils/is-exists.validator';
import * as bcrypt from 'bcryptjs';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'test1@example.com' })
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @MinLength(6)
  @Column({ nullable: true })
  password: string;

  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @ApiProperty({ example: 'John' })
  @Index()
  @Column()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column()
  @Index()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: () => FileEntity })
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'Image not exists',
  })
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity;

  @ApiProperty({ type: Role })
  @Validate(IsExist, ['Role', 'id'], {
    message: 'Role not exists',
  })
  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role;

  @ApiProperty({ type: Status })
  @Validate(IsExist, ['Status', 'id'], {
    message: 'Status not exists',
  })
  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @Index()
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
