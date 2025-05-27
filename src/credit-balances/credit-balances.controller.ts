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
import { CreditBalancesService } from './credit-balances.service';
import { CreateCreditBalanceDto } from './dto/create-credit-balance.dto';
import { UpdateCreditBalanceDto } from './dto/update-credit-balance.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreditBalance } from './domain/credit-balance';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCreditBalancesDto } from './dto/find-all-credit-balances.dto';

@ApiTags('Creditbalances')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'credit-balances',
  version: '1',
})
export class CreditBalancesController {
  constructor(private readonly creditBalancesService: CreditBalancesService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreditBalance,
  })
  create(@Body() createCreditBalanceDto: CreateCreditBalanceDto) {
    return this.creditBalancesService.create(createCreditBalanceDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CreditBalance),
  })
  async findAll(
    @Query() query: FindAllCreditBalancesDto,
  ): Promise<InfinityPaginationResponseDto<CreditBalance>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.creditBalancesService.findAllWithPagination({
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
    type: CreditBalance,
  })
  findById(@Param('id') id: string) {
    return this.creditBalancesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CreditBalance,
  })
  update(
    @Param('id') id: string,
    @Body() updateCreditBalanceDto: UpdateCreditBalanceDto,
  ) {
    return this.creditBalancesService.update(id, updateCreditBalanceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.creditBalancesService.remove(id);
  }
}
