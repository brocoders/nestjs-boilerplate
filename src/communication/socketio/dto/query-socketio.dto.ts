import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class SocketIoHealthDto {
  @ApiProperty({ description: 'Service is responding' })
  @Expose()
  @IsBoolean()
  ok!: boolean;

  @ApiProperty({ description: 'Redis adapter bootstrapped' })
  @Expose()
  @IsBoolean()
  bootstrapped!: boolean;

  @ApiProperty({
    type: [String],
    description: 'Registered Socket.IO namespaces',
  })
  @Expose()
  @IsArray()
  namespaces!: string[];
}

@Exclude()
export class SocketIoNamespacesDto {
  @ApiProperty({
    type: [String],
    description: 'Registered Socket.IO namespaces',
  })
  @Expose()
  @IsArray()
  namespaces!: string[];
}

@Exclude()
export class SocketIoRoomsDto {
  @ApiProperty({ description: 'Namespace of the rooms' })
  @Expose()
  @IsString()
  namespace!: string;

  @ApiProperty({
    type: [String],
    description: 'Room names under the namespace',
  })
  @Expose()
  @IsArray()
  rooms!: string[];
}

@Exclude()
export class SocketUserDto {
  @ApiProperty({ description: 'User identifier' })
  @Expose()
  @IsString()
  id!: string;

  @ApiPropertyOptional({ description: 'User email (if available)' })
  @Expose()
  @IsOptional()
  @IsString()
  email?: string | null;

  @ApiPropertyOptional({ description: 'User role (shape depends on app)' })
  @Expose()
  @IsOptional()
  role?: any;
}

@Exclude()
export class SocketSummaryDto {
  @ApiProperty({ description: 'Socket id' })
  @Expose()
  @IsString()
  id!: string;

  @ApiProperty({ type: [String], description: 'Rooms this socket has joined' })
  @Expose()
  @IsArray()
  rooms!: string[];

  @ApiPropertyOptional({
    description: 'Resolved user bound to this socket',
    type: () => SocketUserDto,
  })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => SocketUserDto)
  user?: SocketUserDto | null;

  @ApiPropertyOptional({ description: 'Client IP address' })
  @Expose()
  @IsOptional()
  @IsString()
  ip?: string | null;
}

@Exclude()
export class SocketIoSocketsDto {
  @ApiProperty({ description: 'Namespace of these sockets' })
  @Expose()
  @IsString()
  namespace!: string;

  @ApiProperty({ type: () => [SocketSummaryDto], description: 'Socket list' })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => SocketSummaryDto)
  sockets!: SocketSummaryDto[];
}

@Exclude()
export class OkDto {
  @ApiProperty({ description: 'Operation success flag' })
  @Expose()
  @IsBoolean()
  ok!: boolean;
}

@Exclude()
export class QueryNamespaceDto {
  @ApiPropertyOptional({
    description: 'Namespace to target (default: /ws)',
    example: '/ws',
  })
  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  namespace?: string;
}
