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
  HttpStatus,
} from '@nestjs/common';
import { PassphrasesService } from './passphrases.service';
import {
  CreatePassphraseDto,
  CreatePassphraseUserDto,
} from './dto/create-passphrase.dto';
import { UpdatePassphraseDto } from './dto/update-passphrase.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Passphrase } from './domain/passphrase';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import {
  FindAllPassphrasesDto,
  FindAllPassphrasesUserDto,
} from './dto/find-all-passphrases.dto';
import { PassphraseUserResponseDto } from './dto/passphrase-response.dto';
import { ErrorTypeMessage } from '../utils/types/message.type';
import { QueryPassphraseDto } from './dto/query-passphrase.dto';
import { ApiInfinityPaginatedResponse } from '../utils/decorators/paginated-response.decorator';

@ApiTags('Passphrases')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'passphrases',
  version: '1',
})
export class PassphrasesController {
  constructor(private readonly passphrasesService: PassphrasesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Passphrase,
  })
  create(@Body() createPassphraseDto: CreatePassphraseDto) {
    return this.passphrasesService.create(createPassphraseDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Passphrase),
  })
  async findAll(
    @Query() query: FindAllPassphrasesDto,
  ): Promise<InfinityPaginationResponseDto<Passphrase>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.passphrasesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Passphrase,
  })
  update(
    @Param('id') id: string,
    @Body() updatePassphraseDto: UpdatePassphraseDto,
  ) {
    return this.passphrasesService.update(id, updatePassphraseDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.passphrasesService.remove(id);
  }

  @Post('me')
  @ApiCreatedResponse({
    type: Passphrase,
  })
  async createByUser(
    @Request() request,
    @Body() createPassphraseUserDto: CreatePassphraseUserDto,
  ) {
    return this.passphrasesService.createByUser(
      createPassphraseUserDto,
      request.user,
    );
  }

  @Get('me')
  @ApiOkResponse({
    type: PassphraseUserResponseDto,
    description: 'Successfully retrieved passphrases for the user',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No passphrases found for the user',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          passphrases: ErrorTypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        },
      },
    },
  })
  async findAllByMe(@Request() request): Promise<PassphraseUserResponseDto[]> {
    return this.passphrasesService.findByMe(request.user);
  }

  @Get('user/:userId')
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The numeric ID of the user',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    type: PassphraseUserResponseDto,
    description: 'Successfully retrieved passphrases for the user',
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    schema: {
      example: {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          userId: 'must be a positive number',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No passphrases found for the user',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          passphrases: ErrorTypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        },
      },
    },
  })
  async findAllByUserId(
    @Param() params: FindAllPassphrasesUserDto,
  ): Promise<PassphraseUserResponseDto[]> {
    return this.passphrasesService.findByUserId(params.userId);
  }

  @Get('search')
  @ApiInfinityPaginatedResponse(
    PassphraseUserResponseDto,
    'Successfully retrieved filtered passphrase list',
  )
  @ApiBadRequestResponse({
    description: 'Invalid filter or sort options',
    schema: {
      example: {
        status: HttpStatus.BAD_REQUEST,
        errors: {
          filters: 'Invalid filter format',
          sort: 'Sort key is not allowed',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No passphrases matched the filter criteria',
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          passphrases: ErrorTypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        },
      },
    },
  })
  async findMany(
    @Query() query: QueryPassphraseDto,
  ): Promise<InfinityPaginationResponseDto<PassphraseUserResponseDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const result = await this.passphrasesService.findManyWithPagination({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: { page, limit },
    });

    return infinityPagination(result, { page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Passphrase,
  })
  findById(@Param('id') id: string) {
    return this.passphrasesService.findById(id);
  }
}
