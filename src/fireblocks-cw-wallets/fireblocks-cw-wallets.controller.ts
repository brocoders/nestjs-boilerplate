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
import { FireblocksCwWalletsService } from './fireblocks-cw-wallets.service';
import { CreateFireblocksCwWalletDto } from './dto/create-fireblocks-cw-wallet.dto';
import { UpdateFireblocksCwWalletDto } from './dto/update-fireblocks-cw-wallet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FireblocksCwWallet } from './domain/fireblocks-cw-wallet';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllFireblocksCwWalletsDto } from './dto/find-all-fireblocks-cw-wallets.dto';
import { RegisterApiTag } from '../common/api-docs/decorators/register-api-tag.decorator';

@RegisterApiTag(
  'Fireblocks - CW',
  'Direct Custody Wallets managed by Fireblocks',
  'https://developers.fireblocks.com/docs/create-direct-custody-wallets',
)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'fireblocks/cw',
  version: '11',
})
export class FireblocksCwWalletsController {
  constructor(
    private readonly fireblocksCwWalletsService: FireblocksCwWalletsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: FireblocksCwWallet,
  })
  create(@Body() createFireblocksCwWalletDto: CreateFireblocksCwWalletDto) {
    return this.fireblocksCwWalletsService.create(createFireblocksCwWalletDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(FireblocksCwWallet),
  })
  async findAll(
    @Query() query: FindAllFireblocksCwWalletsDto,
  ): Promise<InfinityPaginationResponseDto<FireblocksCwWallet>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.fireblocksCwWalletsService.findAllWithPagination({
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
    type: FireblocksCwWallet,
  })
  findById(@Param('id') id: string) {
    return this.fireblocksCwWalletsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: FireblocksCwWallet,
  })
  update(
    @Param('id') id: string,
    @Body() updateFireblocksCwWalletDto: UpdateFireblocksCwWalletDto,
  ) {
    return this.fireblocksCwWalletsService.update(
      id,
      updateFireblocksCwWalletDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.fireblocksCwWalletsService.remove(id);
  }
}
