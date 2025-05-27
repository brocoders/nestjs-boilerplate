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
import { PaymentPlansService } from './payment-plans.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentPlan } from './domain/payment-plan';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllPaymentPlansDto } from './dto/find-all-payment-plans.dto';

@ApiTags('Paymentplans')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'payment-plans',
  version: '1',
})
export class PaymentPlansController {
  constructor(private readonly paymentPlansService: PaymentPlansService) {}

  @Post()
  @ApiCreatedResponse({
    type: PaymentPlan,
  })
  create(@Body() createPaymentPlanDto: CreatePaymentPlanDto) {
    return this.paymentPlansService.create(createPaymentPlanDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PaymentPlan),
  })
  async findAll(
    @Query() query: FindAllPaymentPlansDto,
  ): Promise<InfinityPaginationResponseDto<PaymentPlan>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.paymentPlansService.findAllWithPagination({
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
    type: PaymentPlan,
  })
  findById(@Param('id') id: string) {
    return this.paymentPlansService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: PaymentPlan,
  })
  update(
    @Param('id') id: string,
    @Body() updatePaymentPlanDto: UpdatePaymentPlanDto,
  ) {
    return this.paymentPlansService.update(id, updatePaymentPlanDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.paymentPlansService.remove(id);
  }
}
