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
import { AccountsPayablesService } from './accounts-payables.service';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccountsPayable } from './domain/accounts-payable';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAccountsPayablesDto } from './dto/find-all-accounts-payables.dto';

@ApiTags('Accountspayables')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'accounts-payables',
  version: '1',
})
export class AccountsPayablesController {
  constructor(
    private readonly accountsPayablesService: AccountsPayablesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: AccountsPayable,
  })
  create(@Body() createAccountsPayableDto: CreateAccountsPayableDto) {
    return this.accountsPayablesService.create(createAccountsPayableDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AccountsPayable),
  })
  async findAll(
    @Query() query: FindAllAccountsPayablesDto,
  ): Promise<InfinityPaginationResponseDto<AccountsPayable>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.accountsPayablesService.findAllWithPagination({
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
    type: AccountsPayable,
  })
  findById(@Param('id') id: string) {
    return this.accountsPayablesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AccountsPayable,
  })
  update(
    @Param('id') id: string,
    @Body() updateAccountsPayableDto: UpdateAccountsPayableDto,
  ) {
    return this.accountsPayablesService.update(id, updateAccountsPayableDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.accountsPayablesService.remove(id);
  }
}
