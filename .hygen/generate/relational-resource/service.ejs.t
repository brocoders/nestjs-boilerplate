---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
---
import { Injectable } from '@nestjs/common';
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { <%= name %>Repository } from './infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';

@Injectable()
export class <%= h.inflection.transform(name, ['pluralize']) %>Service {
  constructor(private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository) {}

  create(create<%= name %>Dto: Create<%= name %>Dto) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.create(create<%= name %>Dto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: <%= name %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findById(id);
  }

  update(id: <%= name %>['id'], update<%= name %>Dto: Update<%= name %>Dto) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.update(id, update<%= name %>Dto);
  }

  remove(id: <%= name %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.remove(id);
  }
}
