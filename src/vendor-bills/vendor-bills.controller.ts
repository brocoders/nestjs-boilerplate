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
import { VendorBillsService } from './vendor-bills.service';
import { CreateVendorBillDto } from './dto/create-vendor-bill.dto';
import { UpdateVendorBillDto } from './dto/update-vendor-bill.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { VendorBill } from './domain/vendor-bill';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllVendorBillsDto } from './dto/find-all-vendor-bills.dto';

@ApiTags('Vendorbills')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'vendor-bills',
  version: '1',
})
export class VendorBillsController {
  constructor(private readonly vendorBillsService: VendorBillsService) {}

  @Post()
  @ApiCreatedResponse({
    type: VendorBill,
  })
  create(@Body() createVendorBillDto: CreateVendorBillDto) {
    return this.vendorBillsService.create(createVendorBillDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(VendorBill),
  })
  async findAll(
    @Query() query: FindAllVendorBillsDto,
  ): Promise<InfinityPaginationResponseDto<VendorBill>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.vendorBillsService.findAllWithPagination({
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
    type: VendorBill,
  })
  findById(@Param('id') id: string) {
    return this.vendorBillsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: VendorBill,
  })
  update(
    @Param('id') id: string,
    @Body() updateVendorBillDto: UpdateVendorBillDto,
  ) {
    return this.vendorBillsService.update(id, updateVendorBillDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.vendorBillsService.remove(id);
  }
}
