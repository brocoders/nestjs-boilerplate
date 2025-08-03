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
import { FireblocksNcwWalletsService } from './fireblocks-ncw-wallets.service';
import { CreateFireblocksNcwWalletDto } from './dto/create-fireblocks-ncw-wallet.dto';
import { UpdateFireblocksNcwWalletDto } from './dto/update-fireblocks-ncw-wallet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FireblocksNcwWallet } from './domain/fireblocks-ncw-wallet';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllFireblocksNcwWalletsDto } from './dto/find-all-fireblocks-ncw-wallets.dto';
import { RegisterApiTag } from '../common/api-docs/decorators/register-api-tag.decorator';

@RegisterApiTag(
  'Fireblocks - NCW',
  'The Fireblocks Embedded Wallet (Non-Custodial Wallet: NCW)',
  'https://ncw-developers.fireblocks.com/docs/getting-started',
)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'fireblocks/ncw',
  version: '11',
})
export class FireblocksNcwWalletsController {
  constructor(
    private readonly fireblocksNcwWalletsService: FireblocksNcwWalletsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: FireblocksNcwWallet,
  })
  create(@Body() createFireblocksNcwWalletDto: CreateFireblocksNcwWalletDto) {
    return this.fireblocksNcwWalletsService.create(
      createFireblocksNcwWalletDto,
    );
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(FireblocksNcwWallet),
  })
  async findAll(
    @Query() query: FindAllFireblocksNcwWalletsDto,
  ): Promise<InfinityPaginationResponseDto<FireblocksNcwWallet>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.fireblocksNcwWalletsService.findAllWithPagination({
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
    type: FireblocksNcwWallet,
  })
  findById(@Param('id') id: string) {
    return this.fireblocksNcwWalletsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: FireblocksNcwWallet,
  })
  update(
    @Param('id') id: string,
    @Body() updateFireblocksNcwWalletDto: UpdateFireblocksNcwWalletDto,
  ) {
    return this.fireblocksNcwWalletsService.update(
      id,
      updateFireblocksNcwWalletDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.fireblocksNcwWalletsService.remove(id);
  }
}
