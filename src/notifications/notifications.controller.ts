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
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Notification } from './domain/notification';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllNotificationsDto } from './dto/find-all-notifications.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Notification,
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Notification),
  })
  async findAll(
    @Query() query: FindAllNotificationsDto,
  ): Promise<InfinityPaginationResponseDto<Notification>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.notificationsService.findAllWithPagination({
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
    type: Notification,
  })
  findById(@Param('id') id: string) {
    return this.notificationsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Notification,
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
  @Get('search')
  @ApiOkResponse({
    type: InfinityPaginationResponse(Notification),
    description: 'Successfully retrieved filtered notification list',
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
    description: 'No notifications matched the filter criteria',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          notifications: 'No matching notifications found',
        },
      },
    },
  })
  async findMany(
    @Query() query: QueryNotificationDto,
  ): Promise<InfinityPaginationResponseDto<Notification>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const result = await this.notificationsService.findManyWithPagination({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: { page, limit },
    });

    return infinityPagination(result, { page, limit });
  }
  @Get('device/:deviceId')
  @ApiParam({ name: 'deviceId', type: String, required: true })
  @ApiOkResponse({
    type: InfinityPaginationResponse(Notification),
    description: 'All notifications for a device',
  })
  async findAllByDeviceId(
    @Param('deviceId') deviceId: string,
    @Query() query: FindAllNotificationsDto,
  ): Promise<InfinityPaginationResponseDto<Notification>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const result = await this.notificationsService.findAllByDeviceId(deviceId, {
      page,
      limit,
    });

    return infinityPagination(result, { page, limit });
  }

  @Get('device/:deviceId/unread')
  @ApiParam({ name: 'deviceId', type: String, required: true })
  @ApiOkResponse({
    type: InfinityPaginationResponse(Notification),
    description: 'All unread notifications for a device',
  })
  async findUnreadByDeviceId(
    @Param('deviceId') deviceId: string,
    @Query() query: FindAllNotificationsDto,
  ): Promise<InfinityPaginationResponseDto<Notification>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const result = await this.notificationsService.findUnreadByDeviceId(
      deviceId,
      { page, limit },
    );

    return infinityPagination(result, { page, limit });
  }
}
