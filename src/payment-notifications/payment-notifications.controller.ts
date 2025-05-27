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
} from '@nestjs/common';
import { PaymentNotificationsService } from './payment-notifications.service';
import { CreatePaymentNotificationDto } from './dto/create-payment-notification.dto';
import { UpdatePaymentNotificationDto } from './dto/update-payment-notification.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentNotification } from './domain/payment-notification';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllPaymentNotificationsDto } from './dto/find-all-payment-notifications.dto';

@ApiTags('Paymentnotifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'payment-notifications',
  version: '1',
})
export class PaymentNotificationsController {
  constructor(
    private readonly paymentNotificationsService: PaymentNotificationsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: PaymentNotification,
  })
  create(@Body() createPaymentNotificationDto: CreatePaymentNotificationDto) {
    return this.paymentNotificationsService.create(
      createPaymentNotificationDto,
    );
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PaymentNotification),
  })
  async findAll(
    @Query() query: FindAllPaymentNotificationsDto,
  ): Promise<InfinityPaginationResponseDto<PaymentNotification>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.paymentNotificationsService.findAllWithPagination({
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
    type: PaymentNotification,
  })
  findById(@Param('id') id: string) {
    return this.paymentNotificationsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: PaymentNotification,
  })
  update(
    @Param('id') id: string,
    @Body() updatePaymentNotificationDto: UpdatePaymentNotificationDto,
  ) {
    return this.paymentNotificationsService.update(
      id,
      updatePaymentNotificationDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.paymentNotificationsService.remove(id);
  }
}
