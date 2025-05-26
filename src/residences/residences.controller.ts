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
import { ResidencesService } from './residences.service';
import { CreateResidenceDto } from './dto/create-residence.dto';
import { UpdateResidenceDto } from './dto/update-residence.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Residence } from './domain/residence';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllResidencesDto } from './dto/find-all-residences.dto';

@ApiTags('Residences')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'residences',
  version: '1',
})
export class ResidencesController {
  constructor(private readonly residencesService: ResidencesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Residence,
  })
  create(@Body() createResidenceDto: CreateResidenceDto) {
    return this.residencesService.create(createResidenceDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Residence),
  })
  async findAll(
    @Query() query: FindAllResidencesDto,
  ): Promise<InfinityPaginationResponseDto<Residence>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.residencesService.findAllWithPagination({
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
    type: Residence,
  })
  findById(@Param('id') id: string) {
    return this.residencesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Residence,
  })
  update(
    @Param('id') id: string,
    @Body() updateResidenceDto: UpdateResidenceDto,
  ) {
    return this.residencesService.update(id, updateResidenceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.residencesService.remove(id);
  }
}
