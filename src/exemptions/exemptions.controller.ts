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
import { ExemptionsService } from './exemptions.service';
import { CreateExemptionDto } from './dto/create-exemption.dto';
import { UpdateExemptionDto } from './dto/update-exemption.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Exemption } from './domain/exemption';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllExemptionsDto } from './dto/find-all-exemptions.dto';

@ApiTags('Exemptions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'exemptions',
  version: '1',
})
export class ExemptionsController {
  constructor(private readonly exemptionsService: ExemptionsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Exemption,
  })
  create(@Body() createExemptionDto: CreateExemptionDto) {
    return this.exemptionsService.create(createExemptionDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Exemption),
  })
  async findAll(
    @Query() query: FindAllExemptionsDto,
  ): Promise<InfinityPaginationResponseDto<Exemption>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.exemptionsService.findAllWithPagination({
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
    type: Exemption,
  })
  findById(@Param('id') id: string) {
    return this.exemptionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Exemption,
  })
  update(
    @Param('id') id: string,
    @Body() updateExemptionDto: UpdateExemptionDto,
  ) {
    return this.exemptionsService.update(id, updateExemptionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.exemptionsService.remove(id);
  }
}
