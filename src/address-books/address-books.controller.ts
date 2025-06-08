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
import { AddressBooksService } from './address-books.service';
import { CreateAddressBookDto } from './dto/create-address-book.dto';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
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

@ApiTags('Addressbooks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'address-books',
  version: '1',
})
export class AddressBooksController {
  constructor(private readonly addressBooksService: AddressBooksService) {}

  @Post()
  @ApiCreatedResponse({
    type: AddressBook,
  })
  create(@Body() createAddressBookDto: CreateAddressBookDto) {
    return this.addressBooksService.create(createAddressBookDto);
  }

  @Get()
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
    type: AddressBook,
  })
  findById(@Param('id') id: string) {
    return this.addressBooksService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AddressBook,
  })
  update(
    @Param('id') id: string,
    @Body() updateAddressBookDto: UpdateAddressBookDto,
  ) {
    return this.addressBooksService.update(id, updateAddressBookDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.addressBooksService.remove(id);
  }

  @Get('/user/:userId')
  @ApiParam({ name: 'userId', type: Number })
  findAllByUser(@Param('userId') userId: number) {
    return this.addressBooksService.findAllByUser(userId);
  }

  @Get('/user/:userId/label/:label')
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'label', type: String })
  findByLabel(@Param('userId') userId: number, @Param('label') label: string) {
    return this.addressBooksService.findByLabel(userId, label);
  }

  @Get('/user/:userId/favorites')
  @ApiParam({ name: 'userId', type: Number })
  findFavorites(@Param('userId') userId: number) {
    return this.addressBooksService.findFavorites(userId);
  }

  @Get('/user/:userId/asset-type/:assetType')
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'assetType', type: String })
  findByAssetType(
    @Param('userId') userId: number,
    @Param('assetType') assetType: string,
  ) {
    return this.addressBooksService.findByAssetType(userId, assetType);
  }

  @Get('/user/:userId/filter')
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'blockchain', required: false })
  @ApiQuery({ name: 'assetType', required: false })
  filter(
    @Param('userId') userId: number,
    @Query('blockchain') blockchain?: string,
    @Query('assetType') assetType?: string,
  ) {
    return this.addressBooksService.filter(userId, blockchain, assetType);
  }
}
