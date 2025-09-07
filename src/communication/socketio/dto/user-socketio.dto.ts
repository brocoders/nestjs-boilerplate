import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoleEnum } from '../../../roles/roles.enum';
import { RoleGroups } from '../../../utils/transformers/enum.transformer';

@Exclude()
export class UserSocketDto {
  @ApiProperty({ description: 'User identifier', example: '42' })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'Application roles for this user',
    isArray: true,
    enum: RoleEnum,
    example: [RoleEnum.user],
  })
  @IsOptional()
  @IsArray()
  @Expose(RoleGroups([RoleEnum.admin]))
  roles?: RoleEnum[];
}

@Exclude()
export class UserSocketMetaDto {
  @ApiPropertyOptional({
    description: 'Remote IP address (if available)',
    example: '127.0.0.1',
  })
  @IsOptional()
  @IsString()
  @Expose(RoleGroups([RoleEnum.admin]))
  ip?: string | null;

  @ApiPropertyOptional({
    description: 'User-Agent string (if available)',
    example:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  })
  @IsOptional()
  @IsString()
  @Expose(RoleGroups([RoleEnum.admin]))
  userAgent?: string | null;
}

@Exclude()
export class UserSocketStateDto {
  @ApiProperty({ description: 'Socket identifier', example: 'abc123' })
  @IsString()
  @Expose()
  socketId: string;

  @ApiProperty({
    description: 'Namespace of the active socket',
    example: '/ws',
  })
  @IsString()
  @Expose()
  namespace: string;

  @ApiProperty({
    description: 'Rooms joined by this socket',
    type: [String],
    example: ['abc123', 'user:42'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  rooms: string[];

  @ApiProperty({
    description: 'Connection state for this socket',
    example: true,
  })
  @IsBoolean()
  @Expose()
  connected: boolean;

  @ApiPropertyOptional({
    description: 'Additional connection metadata',
    type: () => UserSocketMetaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSocketMetaDto)
  @Expose(RoleGroups([RoleEnum.admin]))
  meta?: UserSocketMetaDto | null;
}

@Exclude()
export class WhoamiDto {
  @ApiProperty({ description: 'Authenticated user', type: () => UserSocketDto })
  @ValidateNested()
  @Type(() => UserSocketDto)
  @Expose()
  user: UserSocketDto;

  @ApiProperty({
    description: 'Current socket state',
    type: () => UserSocketStateDto,
  })
  @ValidateNested()
  @Type(() => UserSocketStateDto)
  @Expose()
  state: UserSocketStateDto;
}

@Exclude()
export class PresenceSocketDto {
  @ApiProperty({ description: 'Socket identifier', example: 'abc123' })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Rooms this socket has joined',
    type: [String],
    example: ['abc123', 'user:42'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  rooms: string[];

  @ApiPropertyOptional({
    description: 'Remote IP address if available',
    example: '127.0.0.1',
  })
  @IsOptional()
  @IsString()
  @Expose(RoleGroups([RoleEnum.admin]))
  ip?: string | null;

  @ApiProperty({ description: 'Connection state', example: true })
  @IsBoolean()
  @Expose()
  connected: boolean;
}

@Exclude()
export class UserPresenceDto {
  @ApiProperty({ description: 'Namespace checked', example: '/ws' })
  @IsString()
  @Expose()
  namespace: string;

  @ApiProperty({ description: 'User personal room', example: 'user:42' })
  @IsString()
  @Expose()
  userRoom: string;

  @ApiProperty({
    description: 'Whether the user is connected in this namespace',
    example: true,
  })
  @IsBoolean()
  @Expose()
  connected: boolean;

  @ApiProperty({
    description: 'Number of sockets for this user in the namespace',
    example: 2,
  })
  @IsNumber()
  @Expose()
  socketCount: number;

  @ApiProperty({
    description: 'Sockets for this user',
    type: () => [PresenceSocketDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PresenceSocketDto)
  @Expose()
  sockets: PresenceSocketDto[];

  @ApiPropertyOptional({
    description: 'Associated user (if available)',
    type: () => UserSocketDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSocketDto)
  @Expose()
  user?: UserSocketDto | null;
}
