import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class EmitRoomDto {
  @ApiPropertyOptional({
    description: 'Namespace (default: /ws)',
    example: '/ws',
  })
  @Expose()
  @IsOptional()
  @IsString()
  namespace?: string;

  @ApiProperty({ description: 'Room name', example: 'orders:open' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  room!: string;

  @ApiProperty({ description: 'Event name', example: 'order.updated' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  event!: string;

  @ApiProperty({ description: 'Payload data (any JSON)' })
  @Expose()
  data!: object;
}

@Exclude()
export class EmitBroadcastDto {
  @ApiPropertyOptional({
    description: 'Namespace (default: /ws)',
    example: '/ws',
  })
  @Expose()
  @IsOptional()
  @IsString()
  namespace?: string;

  @ApiProperty({ description: 'Event name', example: 'admin.notice' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  event!: string;

  @ApiProperty({
    description: 'Payload data (any JSON)',
    example: { message: 'Hello all!' },
  })
  @Expose()
  data!: object;
}

@Exclude()
export class EmitUserDto {
  @ApiProperty({
    description: 'User ID (targets room: user:{id})',
    example: '123',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: 'Event name', example: 'notification' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  event!: string;

  @ApiProperty({ description: 'Payload data (any JSON)' })
  @Expose()
  data!: object;
}
