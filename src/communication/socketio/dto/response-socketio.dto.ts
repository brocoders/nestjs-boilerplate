// src/communication/socketio/dto/response-socketio.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEmail,
} from 'class-validator';

@Exclude()
export class HealthDto {
  @ApiProperty({ description: 'Service health flag', example: true })
  @IsBoolean()
  @Expose()
  ok: boolean;

  @ApiProperty({ description: 'Bootstrap/initialization flag', example: true })
  @IsBoolean()
  @Expose()
  bootstrapped: boolean;

  @ApiProperty({
    description: 'Registered Socket.IO namespaces',
    type: [String],
    example: ['/ws', '/binance'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  namespaces: string[];
}

@Exclude()
export class NamespacesDto {
  @ApiProperty({
    description: 'Registered Socket.IO namespaces',
    type: [String],
    example: ['/ws', '/binance'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  namespaces: string[];
}

@Exclude()
export class RoomsDto {
  @ApiProperty({ description: 'Namespace of the listed rooms', example: '/ws' })
  @IsString()
  @Expose()
  namespace: string;

  @ApiProperty({
    description: 'Rooms within the namespace',
    type: [String],
    example: ['user:123', 'orders:open'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  rooms: string[];
}

@Exclude()
export class SocketUserDto {
  @ApiPropertyOptional({
    description: 'User ID (if available)',
    example: '123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({
    description: 'User email (if available)',
    example: 'a@b.com',
  })
  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;
}

@Exclude()
export class SocketInfoDto {
  @ApiProperty({ description: 'Socket identifier', example: 'abc123' })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Rooms the socket has joined',
    type: [String],
    example: ['abc123', 'user:123'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  rooms: string[];

  @ApiPropertyOptional({
    description: 'Associated user (if authenticated)',
    type: () => SocketUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocketUserDto)
  @Expose()
  user?: SocketUserDto | null;
}

@Exclude()
export class SocketsDto {
  @ApiProperty({ description: 'Namespace of the sockets list', example: '/ws' })
  @IsString()
  @Expose()
  namespace: string;

  @ApiProperty({
    description: 'Connected sockets',
    type: () => [SocketInfoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocketInfoDto)
  @Expose()
  sockets: SocketInfoDto[];
}

@Exclude()
export class EmitNamespaceResultDto {
  @ApiProperty({ description: 'Operation success flag', example: true })
  @IsBoolean()
  @Expose()
  ok: boolean;

  @ApiProperty({ description: 'Target namespace', example: '/ws' })
  @IsString()
  @Expose()
  namespace: string;

  @ApiProperty({ description: 'Event name emitted', example: 'orders:update' })
  @IsString()
  @Expose()
  event: string;

  @ApiPropertyOptional({
    description: 'Number of sockets that received the event',
    example: 42,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  emitted?: number;
}

@Exclude()
export class EmitRoomResultDto {
  @ApiProperty({ description: 'Operation success flag', example: true })
  @IsBoolean()
  @Expose()
  ok: boolean;

  @ApiProperty({ description: 'Target namespace', example: '/ws' })
  @IsString()
  @Expose()
  namespace: string;

  @ApiProperty({ description: 'Target room', example: 'orders:open' })
  @IsString()
  @Expose()
  room: string;

  @ApiProperty({ description: 'Event name emitted', example: 'orders:update' })
  @IsString()
  @Expose()
  event: string;

  @ApiPropertyOptional({
    description: 'Number of sockets that received the event',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  emitted?: number;
}

@Exclude()
export class EmitUserResultDto {
  @ApiProperty({ description: 'Operation success flag', example: true })
  @IsBoolean()
  @Expose()
  ok: boolean;

  @ApiProperty({ description: 'Target namespace', example: '/ws' })
  @IsString()
  @Expose()
  namespace: string;

  @ApiProperty({ description: 'User personal room', example: 'user:123' })
  @IsString()
  @Expose()
  userRoom: string;

  @ApiProperty({
    description: 'Event name emitted',
    example: 'notification:new',
  })
  @IsString()
  @Expose()
  event: string;

  @ApiPropertyOptional({
    description: 'Number of sockets that received the event',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  emitted?: number;
}
