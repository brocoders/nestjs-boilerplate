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
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto, CreateWalletUserDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WalletDto } from './dto/wallet.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { IdParamDto, UserIdParamDto } from './dto/param-wallet.dto';
import { FilterWalletsDto } from './dto/query-wallet.dto';
import { RequestWithUser } from '../utils/types/object.type';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { ApiOperationRoles } from '../utils/decorators/swagger.decorator';

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'wallets',
  version: '1',
})
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Create wallet', [RoleEnum.admin])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: WalletDto })
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @ApiOperationRoles('Create wallet entry for logged-in user')
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: WalletDto })
  createByMe(
    @Request() request: RequestWithUser,
    @Body() dto: CreateWalletUserDto,
  ) {
    return this.walletsService.createByMe(dto, request.user.id);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('List all wallets with pagination', [RoleEnum.admin])
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: InfinityPaginationResponse(WalletDto) })
  async findAll(
    @Query() query: FindAllWalletsDto,
  ): Promise<InfinityPaginationResponseDto<WalletDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    return infinityPagination(
      await this.walletsService.findAllWithPagination({
        paginationOptions: { page, limit },
      }),
      { page, limit },
    );
  }

  @ApiOperationRoles('Get wallets for logged-in user')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto, isArray: true })
  findAllByMe(@Request() req: RequestWithUser): Promise<WalletDto[]> {
    return this.walletsService.findAllByUserId(req.user.id);
  }

  @ApiOperationRoles('Get active wallets for logged-in user')
  @Get('me/actives')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto, isArray: true })
  findActivesByMe(@Request() req: RequestWithUser): Promise<WalletDto[]> {
    return this.walletsService.findActives(req.user.id);
  }

  @ApiOperationRoles('Count my wallets')
  @Get('me/count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  countMyWallets(@Request() req: RequestWithUser) {
    return this.walletsService.countAll(req.user.id);
  }

  @ApiOperationRoles('Count my active wallets')
  @Get('me/actives/count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  countMyActiveWallets(@Request() req: RequestWithUser) {
    return this.walletsService.countActives(req.user.id);
  }

  @ApiOperationRoles('Filter wallets for logged-in user')
  @Get('me/filter')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto, isArray: true })
  filterByMe(
    @Request() req: RequestWithUser,
    @Query() query: FilterWalletsDto,
  ): Promise<WalletDto[]> {
    return this.walletsService.filter(
      req.user.id,
      query.provider,
      query.lockupId,
      query.label,
      query.active,
    );
  }

  @ApiOperationRoles('Get wallet by ID for logged-in user')
  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto })
  findByMe(@Param() params: IdParamDto, @Request() req: RequestWithUser) {
    return this.walletsService.findByMe(params.id, req.user.id);
  }

  @ApiOperationRoles('Delete wallet by ID for logged-in user')
  @Delete('me/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByMe(
    @Param() params: IdParamDto,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    return this.walletsService.remove(params.id, req.user.id);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Count all wallets', [RoleEnum.admin])
  @Get('count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  countAll(@Query('userId') userId?: number) {
    return this.walletsService.countAll(userId);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Count active wallets', [RoleEnum.admin])
  @Get('actives/count')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Number })
  countActives(@Query('userId') userId?: number) {
    return this.walletsService.countActives(userId);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Find wallet by lockup ID', [RoleEnum.admin])
  @Get('lockup/:lockupId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto })
  findByLockupId(@Param('lockupId') lockupId: string) {
    return this.walletsService.findByLockupId(lockupId);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get all wallets by user ID', [RoleEnum.admin])
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto, isArray: true })
  findAllByUserId(@Param() params: UserIdParamDto) {
    return this.walletsService.findAllByUserId(params.userId);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Filter wallets by user ID', [RoleEnum.admin])
  @Get('user/:userId/filter')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto, isArray: true })
  filter(@Param() params: UserIdParamDto, @Query() query: FilterWalletsDto) {
    return this.walletsService.filter(
      params.userId,
      query.provider,
      query.lockupId,
      query.label,
      query.active,
    );
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get wallet by ID', [RoleEnum.admin])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto })
  findById(@Param() params: IdParamDto) {
    return this.walletsService.findById(params.id);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Update wallet by ID', [RoleEnum.admin])
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WalletDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateWalletDto) {
    return this.walletsService.update(params.id, dto);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Delete wallet by ID', [RoleEnum.admin])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: IdParamDto) {
    return this.walletsService.remove(params.id);
  }
}
