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
import { AccountsReceivablesService } from './accounts-receivables.service';
import { CreateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { UpdateAccountsReceivableDto } from './dto/update-accounts-receivable.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccountsReceivable } from './domain/accounts-receivable';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAccountsReceivablesDto } from './dto/find-all-accounts-receivables.dto';

@ApiTags('Accountsreceivables')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'accounts-receivables',
  version: '1',
})
export class AccountsReceivablesController {
  constructor(
    private readonly accountsReceivablesService: AccountsReceivablesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: AccountsReceivable,
  })
  create(@Body() createAccountsReceivableDto: CreateAccountsReceivableDto) {
    return this.accountsReceivablesService.create(createAccountsReceivableDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AccountsReceivable),
  })
  async findAll(
    @Query() query: FindAllAccountsReceivablesDto,
  ): Promise<InfinityPaginationResponseDto<AccountsReceivable>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.accountsReceivablesService.findAllWithPagination({
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
    type: AccountsReceivable,
  })
  findById(@Param('id') id: string) {
    return this.accountsReceivablesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AccountsReceivable,
  })
  update(
    @Param('id') id: string,
    @Body() updateAccountsReceivableDto: UpdateAccountsReceivableDto,
  ) {
    return this.accountsReceivablesService.update(
      id,
      updateAccountsReceivableDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.accountsReceivablesService.remove(id);
  }
}
