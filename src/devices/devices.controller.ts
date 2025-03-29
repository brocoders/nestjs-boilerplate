import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Device } from './domain/device';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import {
  FindAllDevicesDto,
  FindAllDevicesUserDto,
} from './dto/find-all-devices.dto';
import { ErrorTypeMessage } from '../utils/types/message.type';
import { DeviceUserResponseDto } from './dto/device-response.dto';
import { QueryDeviceDto } from './dto/query-device.dto';

@ApiTags('Devices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'devices',
  version: '1',
})
export class DevicesController {
  passphrasesService: any;
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Device,
  })
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Device),
  })
  async findAll(
    @Query() query: FindAllDevicesDto,
  ): Promise<InfinityPaginationResponseDto<Device>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.devicesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Device,
  })
  findById(@Param('id') id: string) {
    return this.devicesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Device,
  })
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }

  @Get('me')
  @ApiOkResponse({
    type: DeviceUserResponseDto,
    description: 'Successfully retrieved devices for the user',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No Devices found for the user',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          devices: ErrorTypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        },
      },
    },
  })
  @ApiOkResponse({ type: Device, isArray: true })
  async findAllByMe(@Request() request): Promise<DeviceUserResponseDto[]> {
    return this.devicesService.findByme(request.user);
  }

  @Get('user/:userId')
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The numeric ID of the user',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    type: DeviceUserResponseDto,
    description: 'Successfully retrieved devices for the user',
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    schema: {
      example: {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          userId: 'must be a positive number',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No devices found for the user',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          devices: ErrorTypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        },
      },
    },
  })
  async findAllByUserId(
    @Param() params: FindAllDevicesUserDto,
  ): Promise<DeviceUserResponseDto[]> {
    return this.devicesService.findByUserId(params.userId);
  }

  @Get('search')
  @ApiOkResponse({
    type: InfinityPaginationResponse(DeviceUserResponseDto),
    description: 'Successfully retrieved filtered device list',
  })
  @ApiBadRequestResponse({
    description: 'Invalid filter or sort options',
    schema: {
      example: {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          filters: 'Invalid filter format',
          sort: 'Sort key is not allowed',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No devices matched the filter criteria',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          devices: ErrorTypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        },
      },
    },
  })
  async findMany(
    @Query() query: QueryDeviceDto,
  ): Promise<InfinityPaginationResponseDto<DeviceUserResponseDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const result = await this.devicesService.findManyWithPagination({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: { page, limit },
    });

    return infinityPagination(result, { page, limit });
  }
}
