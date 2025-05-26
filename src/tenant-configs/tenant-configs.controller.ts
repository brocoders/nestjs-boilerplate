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
import { TenantConfigsService } from './tenant-configs.service';
import { CreateTenantConfigDto } from './dto/create-tenant-config.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TenantConfig } from './domain/tenant-config';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTenantConfigsDto } from './dto/find-all-tenant-configs.dto';

@ApiTags('Tenantconfigs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'tenant-configs',
  version: '1',
})
export class TenantConfigsController {
  constructor(private readonly tenantConfigsService: TenantConfigsService) {}

  @Post()
  @ApiCreatedResponse({
    type: TenantConfig,
  })
  create(@Body() createTenantConfigDto: CreateTenantConfigDto) {
    return this.tenantConfigsService.create(createTenantConfigDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(TenantConfig),
  })
  async findAll(
    @Query() query: FindAllTenantConfigsDto,
  ): Promise<InfinityPaginationResponseDto<TenantConfig>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.tenantConfigsService.findAllWithPagination({
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
    type: TenantConfig,
  })
  findById(@Param('id') id: string) {
    return this.tenantConfigsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TenantConfig,
  })
  update(
    @Param('id') id: string,
    @Body() updateTenantConfigDto: UpdateTenantConfigDto,
  ) {
    return this.tenantConfigsService.update(id, updateTenantConfigDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.tenantConfigsService.remove(id);
  }
}
