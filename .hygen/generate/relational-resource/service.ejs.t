---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/<%= h.inflection.transform(name.split('/').pop(), ['pluralize','underscore','dasherize']) %>.service.ts
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
  // common
  Injectable,
} from '@nestjs/common';
import { Create<%= _entityName %>Dto } from './dto/create-<%= _entitySlug %>.dto';
import { Update<%= _entityName %>Dto } from './dto/update-<%= _entitySlug %>.dto';
import { <%= _entityName %>Repository } from './infrastructure/persistence/<%= _entitySlug %>.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { <%= _entityName %> } from './domain/<%= _entitySlug %>';

@Injectable()
export class <%= _entityPlural %>Service {
  constructor(
    // Dependencies here
    private readonly <%= h.inflection.camelize(_entityName, true) %>Repository: <%= _entityName %>Repository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create<%= _entityName %>Dto: Create<%= _entityName %>Dto
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.<%= h.inflection.camelize(_entityName, true) %>Repository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.<%= h.inflection.camelize(_entityName, true) %>Repository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: <%= _entityName %>['id']) {
    return this.<%= h.inflection.camelize(_entityName, true) %>Repository.findById(id);
  }

  findByIds(ids: <%= _entityName %>['id'][]) {
    return this.<%= h.inflection.camelize(_entityName, true) %>Repository.findByIds(ids);
  }

  async update(
    id: <%= _entityName %>['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update<%= _entityName %>Dto: Update<%= _entityName %>Dto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.<%= h.inflection.camelize(_entityName, true) %>Repository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: <%= _entityName %>['id']) {
    return this.<%= h.inflection.camelize(_entityName, true) %>Repository.remove(id);
  }
}
