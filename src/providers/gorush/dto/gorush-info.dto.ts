import { IsArray, IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GorushInfoDto {
  @ApiProperty({ description: 'Indicates if the service is healthy' })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ description: 'Message describing the health status' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Timestamp of the health check in UNIX format' })
  @IsInt()
  timestamp: number;
}

export class GoRushVersionResponseDto {
  @ApiProperty({ description: 'Source URL of the Gorush repository' })
  @IsString()
  source: string;

  @ApiProperty({ description: 'Version of the Gorush application' })
  @IsString()
  version: string;
}

export class GoRushCoreStatusResponseDto {
  @ApiProperty({
    description: 'Current timestamp in nanoseconds',
    example: '1738248792',
  })
  @IsInt()
  time: number;

  @ApiProperty({ description: 'Go version', example: 'go1.22.7' })
  @IsString()
  go_version: string;

  @ApiProperty({ description: 'Operating System', example: 'linux' })
  @IsString()
  go_os: string;

  @ApiProperty({ description: 'CPU Architecture', example: 'amd64' })
  @IsString()
  go_arch: string;

  @ApiProperty({ description: 'Number of CPU cores', example: 12 })
  @IsInt()
  cpu_num: number;

  @ApiProperty({ description: 'Number of active Goroutines', example: 14 })
  @IsInt()
  goroutine_num: number;

  @ApiProperty({ description: 'GOMAXPROCS value', example: 12 })
  @IsInt()
  gomaxprocs: number;

  @ApiProperty({ description: 'Number of CGO calls', example: 0 })
  @IsInt()
  cgo_call_num: number;

  @ApiProperty({ description: 'Memory allocation in bytes', example: 3961440 })
  @IsInt()
  memory_alloc: number;

  @ApiProperty({ description: 'Total memory allocated', example: 10391400 })
  @IsInt()
  memory_total_alloc: number;

  @ApiProperty({ description: 'System memory usage', example: 18961672 })
  @IsInt()
  memory_sys: number;

  @ApiProperty({ description: 'Memory lookups count', example: 0 })
  @IsInt()
  memory_lookups: number;

  @ApiProperty({ description: 'Total mallocs count', example: 69950 })
  @IsInt()
  memory_mallocs: number;

  @ApiProperty({ description: 'Total frees count', example: 54190 })
  @IsInt()
  memory_frees: number;

  @ApiProperty({ description: 'Stack memory usage', example: 786432 })
  @IsInt()
  memory_stack: number;

  @ApiProperty({
    description: 'Heap allocation memory usage',
    example: 3961440,
  })
  @IsInt()
  heap_alloc: number;

  @ApiProperty({ description: 'Heap system memory', example: 11796480 })
  @IsInt()
  heap_sys: number;

  @ApiProperty({ description: 'Heap idle memory', example: 5849088 })
  @IsInt()
  heap_idle: number;

  @ApiProperty({ description: 'Heap in-use memory', example: 5947392 })
  @IsInt()
  heap_inuse: number;

  @ApiProperty({ description: 'Heap released memory', example: 5251072 })
  @IsInt()
  heap_released: number;

  @ApiProperty({ description: 'Heap object count', example: 15760 })
  @IsInt()
  heap_objects: number;

  @ApiProperty({
    description: 'Next GC target allocation size',
    example: 8605344,
  })
  @IsInt()
  gc_next: number;

  @ApiProperty({
    description: 'Last GC timestamp',
    example: 173824873090,
  })
  @IsInt()
  gc_last: number;

  @ApiProperty({
    description: 'Total number of garbage collections',
    example: 25,
  })
  @IsInt()
  gc_num: number;

  @ApiProperty({
    description: 'Garbage collections per second',
    example: 0.0083849,
  })
  @IsNumber()
  gc_per_second: number;

  @ApiProperty({
    description: 'Garbage collection pause time per second',
    example: 7.982045,
  })
  @IsNumber()
  gc_pause_per_second: number;

  @ApiProperty({
    description: 'Garbage collection pause durations',
    example: [0.168496, 1.15062, 0.294964],
  })
  @IsArray()
  gc_pause: number[];
}
