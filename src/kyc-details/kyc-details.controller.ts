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
import { KycDetailsService } from './kyc-details.service';
import { CreateKycDetailsDto } from './dto/create-kyc-details.dto';
import { UpdateKycDetailsDto } from './dto/update-kyc-details.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { KycDetails } from './domain/kyc-details';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllKycDetailsDto } from './dto/find-all-kyc-details.dto';

@ApiTags('Kycdetails')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'kyc-details',
  version: '1',
})
export class KycDetailsController {
  constructor(private readonly kycDetailsService: KycDetailsService) {}

  @Post()
  @ApiCreatedResponse({
    type: KycDetails,
  })
  create(@Body() createKycDetailsDto: CreateKycDetailsDto) {
    return this.kycDetailsService.create(createKycDetailsDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(KycDetails),
  })
  async findAll(
    @Query() query: FindAllKycDetailsDto,
  ): Promise<InfinityPaginationResponseDto<KycDetails>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.kycDetailsService.findAllWithPagination({
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
    type: KycDetails,
  })
  findById(@Param('id') id: string) {
    return this.kycDetailsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: KycDetails,
  })
  update(
    @Param('id') id: string,
    @Body() updateKycDetailsDto: UpdateKycDetailsDto,
  ) {
    return this.kycDetailsService.update(id, updateKycDetailsDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.kycDetailsService.remove(id);
  }
}
