---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
---
import { 
  // common
  Injectable,
} from '@nestjs/common';
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { <%= name %>Repository } from './infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';

@Injectable()
export class <%= h.inflection.transform(name, ['pluralize']) %>Service {
  constructor(
    // Dependencies here
    private readonly <%= h.inflection.camelize(name, true) %>Repository: <%= name %>Repository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create<%= name %>Dto: Create<%= name %>Dto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.<%= h.inflection.camelize(name, true) %>Repository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
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

  findById(id: <%= name %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findById(id);
  }

  findByIds(ids: <%= name %>['id'][]) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.findByIds(ids);
  }

  async update(
    id: <%= name %>['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update<%= name %>Dto: Update<%= name %>Dto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.<%= h.inflection.camelize(name, true) %>Repository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: <%= name %>['id']) {
    return this.<%= h.inflection.camelize(name, true) %>Repository.remove(id);
  }
}
