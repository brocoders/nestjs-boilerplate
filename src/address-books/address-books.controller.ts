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
import { AddressBook } from './domain/address-book';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAddressBooksDto } from './dto/find-all-address-books.dto';
import { AddressBookUserResponseDto } from './dto/address-book-user-response.dto';
import { TypeMessage } from '../utils/types/message.type';
import {
  IdParamDto,
  UserIdAssetTypeParamDto,
  UserIdLabelParamDto,
  UserIdParamDto,
} from './dto/address-book-param.dto';
import { FilterAddressBooksDto } from './dto/address-book-query.dto';
import { RequestWithUser } from '../utils/types/object.type';

@ApiTags('AddressBooks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'address-books',
  version: '1',
})
export class AddressBooksController {
  constructor(private readonly addressBooksService: AddressBooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AddressBook })
  create(@Body() createAddressBookDto: CreateAddressBookDto) {
    return this.addressBooksService.create(createAddressBookDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: InfinityPaginationResponse(AddressBook),
  })
  async findAll(
    @Query() query: FindAllAddressBooksDto,
  ): Promise<InfinityPaginationResponseDto<AddressBook>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.addressBooksService.findAllWithPagination({
        paginationOptions: { page, limit },
      }),
      { page, limit },
    );
  }

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AddressBook })
  async createByUser(
    @Request() request: RequestWithUser,
    @Body() createAddressBookUserDto: CreateAddressBookUserDto,
  ) {
    return this.addressBooksService.createByUser(
      createAddressBookUserDto,
      request.user,
    );
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AddressBookUserResponseDto,
    description: 'Successfully retrieved Address Book for the user',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No Devices found for the user',
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
    @Request() request: RequestWithUser,
  ): Promise<AddressBookUserResponseDto[]> {
    return this.addressBooksService.findByMe(request.user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBook })
  findById(@Param() params: IdParamDto) {
    return this.addressBooksService.findById(params.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AddressBook })
  update(
    @Param() params: IdParamDto,
    @Body() updateAddressBookDto: UpdateAddressBookDto,
  ) {
    return this.addressBooksService.update(params.id, updateAddressBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: IdParamDto) {
    return this.addressBooksService.remove(params.id);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  findAllByUser(@Param() params: UserIdParamDto) {
    return this.addressBooksService.findAllByUser(params.userId);
  }

  @Get('/user/:userId/label/:label')
  @HttpCode(HttpStatus.OK)
  findByLabel(@Param() params: UserIdLabelParamDto) {
    return this.addressBooksService.findByLabel(params.userId, params.label);
  }

  @Get('/user/:userId/favorites')
  @HttpCode(HttpStatus.OK)
  findFavorites(@Param() params: UserIdParamDto) {
    return this.addressBooksService.findFavorites(params.userId);
  }

  @Get('/user/:userId/asset-type/:assetType')
  @HttpCode(HttpStatus.OK)
  findByAssetType(@Param() params: UserIdAssetTypeParamDto) {
    return this.addressBooksService.findByAssetType(
      params.userId,
      params.assetType,
    );
  }

  @Get('/user/:userId/filter')
  @HttpCode(HttpStatus.OK)
  filter(
    @Param() params: UserIdParamDto,
    @Query() query: FilterAddressBooksDto,
  ) {
    return this.addressBooksService.filter(
      params.userId,
      query.blockchain,
      query.assetType,
    );
  }
}
