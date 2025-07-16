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
import { AddressBooksService } from './address-books.service';
import {
  CreateAddressBookDto,
  CreateAddressBookUserDto,
} from './dto/create-address-book.dto';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddressBookDto } from './dto/address-book.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAddressBooksDto } from './dto/find-all-address-books.dto';
import { TypeMessage } from '../utils/types/message.type';
import { IdParamDto, UserIdParamDto } from './dto/param-address-book.dto';
import { FilterAddressBooksDto } from './dto/query-address-book.dto';
import { RequestWithUser } from '../utils/types/object.type';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { ApiOperationRoles } from '../utils/decorators/swagger.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('AddressBooks')
@Controller({ path: 'address-books', version: '1' })
export class AddressBooksController {
  constructor(private readonly addressBooksService: AddressBooksService) {}

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('create address book entry', [RoleEnum.admin])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AddressBookDto })
  create(@Body() createAddressBookDto: CreateAddressBookDto) {
    return this.addressBooksService.create(createAddressBookDto);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('List all address books with pagination', [RoleEnum.admin])
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: InfinityPaginationResponse(AddressBookDto) })
  async findAll(
    @Query() query: FindAllAddressBooksDto,
  ): Promise<InfinityPaginationResponseDto<AddressBookDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    return infinityPagination(
      await this.addressBooksService.findAllWithPagination({
        paginationOptions: { page, limit },
      }),
      { page, limit },
    );
  }

  @ApiOperationRoles('Create address book entry')
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AddressBookDto })
  async createByMe(
    @Request() request: RequestWithUser,
    @Body() dto: CreateAddressBookUserDto,
  ) {
    return this.addressBooksService.createByMe(dto, request.user.id);
  }

  @ApiOperationRoles('Get all address books')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto, isArray: true })
  @ApiNotFoundResponse({
    description: 'No address book entries found',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          devices: TypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        },
      },
    },
  })
  async findAllByMe(
    @Request() req: RequestWithUser,
  ): Promise<AddressBookDto[]> {
    return this.addressBooksService.findAllByUserId(req.user.id);
  }

  @ApiOperationRoles('Get favorite address books')
  @Get('me/favorites')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto, isArray: true })
  async findFavoritesByMe(
    @Request() req: RequestWithUser,
  ): Promise<AddressBookDto[]> {
    return this.addressBooksService.findFavoritesByMe(req.user.id);
  }

  @ApiOperationRoles('Filter address books')
  @Get('me/filter')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto, isArray: true })
  async filterByMe(
    @Request() req: RequestWithUser,
    @Query() query: FilterAddressBooksDto,
  ): Promise<AddressBookDto[]> {
    return this.addressBooksService.filterByMe(
      req.user.id,
      query.blockchain,
      query.assetType,
      query.isFavorite,
    );
  }

  @ApiOperationRoles('Get address book by ID')
  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto })
  async findByMe(@Param() params: IdParamDto, @Request() req: RequestWithUser) {
    return this.addressBooksService.findByMe(params.id, req.user.id);
  }

  @ApiOperationRoles('Delete address book entry')
  @Delete('me/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeByMe(
    @Param() params: IdParamDto,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    await this.addressBooksService.remove(params.id, req.user.id);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get all address books by user ID', [RoleEnum.admin])
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto, isArray: true })
  findAllByUserId(@Param() params: UserIdParamDto) {
    return this.addressBooksService.findAllByUserId(params.userId);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get favorite address books by user ID', [RoleEnum.admin])
  @Get('user/:userId/favorites')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto, isArray: true })
  findFavorites(@Param() params: UserIdParamDto) {
    return this.addressBooksService.findFavorites(params.userId);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Filter address books by user ID', [RoleEnum.admin])
  @Get('user/:userId/filter')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto, isArray: true })
  filter(
    @Param() params: UserIdParamDto,
    @Query() query: FilterAddressBooksDto,
  ) {
    return this.addressBooksService.filter(
      params.userId,
      query.blockchain,
      query.assetType,
      query.isFavorite,
    );
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Get address book by ID', [RoleEnum.admin])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto })
  findById(@Param() params: IdParamDto) {
    return this.addressBooksService.findById(params.id);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Update address book by ID', [RoleEnum.admin])
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBookDto })
  update(@Param() params: IdParamDto, @Body() dto: UpdateAddressBookDto) {
    return this.addressBooksService.update(params.id, dto);
  }

  @Roles(RoleEnum.admin)
  @ApiOperationRoles('Delete address book by ID', [RoleEnum.admin])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: IdParamDto) {
    return this.addressBooksService.remove(params.id);
  }
}
