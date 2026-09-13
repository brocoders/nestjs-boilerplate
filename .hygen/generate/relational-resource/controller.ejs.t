---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/<%= h.inflection.transform(name.split('/').pop(), ['pluralize','underscore','dasherize']) %>.controller.ts
---<%
const _parts = name.split('/');
const _entityName = _parts[_parts.length - 1];
const _dirParts = _parts.slice(0, -1);
const _resourceDir = (_dirParts.length ? _dirParts.map(p => h.inflection.transform(p, ['underscore','dasherize'])).join('/') + '/' : '') + h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
const _entitySlug = h.inflection.transform(_entityName, ['underscore','dasherize']);
const _entityPlural = h.inflection.transform(_entityName, ['pluralize']);
const _entityPluralSlug = h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
%>

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
import { <%= _entityPlural %>Service } from './<%= _entityPluralSlug %>.service';
import { Create<%= _entityName %>Dto } from './dto/create-<%= _entitySlug %>.dto';
import { Update<%= _entityName %>Dto } from './dto/update-<%= _entitySlug %>.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { <%= _entityName %> } from './domain/<%= _entitySlug %>';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAll<%= _entityPlural %>Dto } from './dto/find-all-<%= _entityPluralSlug %>.dto';

@ApiTags('<%= h.inflection.transform(_entityName, ['pluralize', 'humanize']) %>')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: '<%= _resourceDir %>',
  version: '1',
})
export class <%= _entityPlural %>Controller {
  constructor(private readonly <%= h.inflection.camelize(h.inflection.pluralize(_entityName), true) %>Service: <%= _entityPlural %>Service) {}

  @Post()
  @ApiCreatedResponse({
    type: <%= _entityName %>,
  })
  create(@Body() create<%= _entityName %>Dto: Create<%= _entityName %>Dto) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(_entityName), true) %>Service.create(create<%= _entityName %>Dto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(<%= _entityName %>),
  })
  async findAll(
    @Query() query: FindAll<%= _entityPlural %>Dto,
  ): Promise<InfinityPaginationResponseDto<<%= _entityName %>>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.<%= h.inflection.camelize(h.inflection.pluralize(_entityName), true) %>Service.findAllWithPagination({
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
    type: <%= _entityName %>,
  })
  findById(@Param('id') id: string) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(_entityName), true) %>Service.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= _entityName %>,
  })
  update(
    @Param('id') id: string,
    @Body() update<%= _entityName %>Dto: Update<%= _entityName %>Dto,
  ) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(_entityName), true) %>Service.update(id, update<%= _entityName %>Dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(_entityName), true) %>Service.remove(id);
  }
}
