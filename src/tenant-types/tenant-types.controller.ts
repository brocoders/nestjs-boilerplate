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
import { TenantTypesService } from './tenant-types.service';
import { CreateTenantTypeDto } from './dto/create-tenant-type.dto';
import { UpdateTenantTypeDto } from './dto/update-tenant-type.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TenantType } from './domain/tenant-type';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTenantTypesDto } from './dto/find-all-tenant-types.dto';
import { Public } from '../auth/decorators/public.decorator'; // Add this import

@ApiTags('Tenanttypes')
@Controller({
  path: 'tenant-types',
  version: '1',
})
export class TenantTypesController {
  constructor(private readonly tenantTypesService: TenantTypesService) {}

  @Public() // Make this route public
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(TenantType),
  })
  async findAll(
    @Query() query: FindAllTenantTypesDto,
  ): Promise<InfinityPaginationResponseDto<TenantType>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.tenantTypesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Public() // Optionally make this public too if needed
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TenantType,
  })
  findById(@Param('id') id: string) {
    return this.tenantTypesService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({
    type: TenantType,
  })
  create(@Body() createTenantTypeDto: CreateTenantTypeDto) {
    return this.tenantTypesService.create(createTenantTypeDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TenantType,
  })
  update(
    @Param('id') id: string,
    @Body() updateTenantTypeDto: UpdateTenantTypeDto,
  ) {
    return this.tenantTypesService.update(id, updateTenantTypeDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.tenantTypesService.remove(id);
  }
}
