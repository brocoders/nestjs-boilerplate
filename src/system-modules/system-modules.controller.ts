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
import { SystemModulesService } from './system-modules.service';
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SystemModule } from './domain/system-module';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSystemModulesDto } from './dto/find-all-system-modules.dto';

@ApiTags('Systemmodules')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'system-modules',
  version: '1',
})
export class SystemModulesController {
  constructor(private readonly systemModulesService: SystemModulesService) {}

  @Post()
  @ApiCreatedResponse({
    type: SystemModule,
  })
  create(@Body() createSystemModuleDto: CreateSystemModuleDto) {
    return this.systemModulesService.create(createSystemModuleDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(SystemModule),
  })
  async findAll(
    @Query() query: FindAllSystemModulesDto,
  ): Promise<InfinityPaginationResponseDto<SystemModule>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.systemModulesService.findAllWithPagination({
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
    type: SystemModule,
  })
  findById(@Param('id') id: string) {
    return this.systemModulesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: SystemModule,
  })
  update(
    @Param('id') id: string,
    @Body() updateSystemModuleDto: UpdateSystemModuleDto,
  ) {
    return this.systemModulesService.update(id, updateSystemModuleDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.systemModulesService.remove(id);
  }
}
