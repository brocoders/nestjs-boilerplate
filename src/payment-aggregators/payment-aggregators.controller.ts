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
import { PaymentAggregatorsService } from './payment-aggregators.service';
import { CreatePaymentAggregatorDto } from './dto/create-payment-aggregator.dto';
import { UpdatePaymentAggregatorDto } from './dto/update-payment-aggregator.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentAggregator } from './domain/payment-aggregator';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllPaymentAggregatorsDto } from './dto/find-all-payment-aggregators.dto';

@ApiTags('Paymentaggregators')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'payment-aggregators',
  version: '1',
})
export class PaymentAggregatorsController {
  constructor(
    private readonly paymentAggregatorsService: PaymentAggregatorsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: PaymentAggregator,
  })
  create(@Body() createPaymentAggregatorDto: CreatePaymentAggregatorDto) {
    return this.paymentAggregatorsService.create(createPaymentAggregatorDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PaymentAggregator),
  })
  async findAll(
    @Query() query: FindAllPaymentAggregatorsDto,
  ): Promise<InfinityPaginationResponseDto<PaymentAggregator>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.paymentAggregatorsService.findAllWithPagination({
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
    type: PaymentAggregator,
  })
  findById(@Param('id') id: string) {
    return this.paymentAggregatorsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: PaymentAggregator,
  })
  update(
    @Param('id') id: string,
    @Body() updatePaymentAggregatorDto: UpdatePaymentAggregatorDto,
  ) {
    return this.paymentAggregatorsService.update(
      id,
      updatePaymentAggregatorDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.paymentAggregatorsService.remove(id);
  }
}
