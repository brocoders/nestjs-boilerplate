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
import { CustomerPlansService } from './customer-plans.service';
import { CreateCustomerPlanDto } from './dto/create-customer-plan.dto';
import { UpdateCustomerPlanDto } from './dto/update-customer-plan.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerPlan } from './domain/customer-plan';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCustomerPlansDto } from './dto/find-all-customer-plans.dto';

@ApiTags('Customerplans')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'customer-plans',
  version: '1',
})
export class CustomerPlansController {
  constructor(private readonly customerPlansService: CustomerPlansService) {}

  @Post()
  @ApiCreatedResponse({
    type: CustomerPlan,
  })
  create(@Body() createCustomerPlanDto: CreateCustomerPlanDto) {
    return this.customerPlansService.create(createCustomerPlanDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CustomerPlan),
  })
  async findAll(
    @Query() query: FindAllCustomerPlansDto,
  ): Promise<InfinityPaginationResponseDto<CustomerPlan>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.customerPlansService.findAllWithPagination({
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
    type: CustomerPlan,
  })
  findById(@Param('id') id: string) {
    return this.customerPlansService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CustomerPlan,
  })
  update(
    @Param('id') id: string,
    @Body() updateCustomerPlanDto: UpdateCustomerPlanDto,
  ) {
    return this.customerPlansService.update(id, updateCustomerPlanDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.customerPlansService.remove(id);
  }
}
