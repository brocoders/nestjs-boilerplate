---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(name.split('/').pop(), ['underscore','dasherize']) %>.repository.ts
---<%
const _parts = name.split('/');
const _entityName = _parts[_parts.length - 1];
const _dirParts = _parts.slice(0, -1);
const _resourceDir = (_dirParts.length ? _dirParts.map(p => h.inflection.transform(p, ['underscore','dasherize'])).join('/') + '/' : '') + h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
const _entitySlug = h.inflection.transform(_entityName, ['underscore','dasherize']);
const _entityPlural = h.inflection.transform(_entityName, ['pluralize']);
const _entityPluralSlug = h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
%>

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { <%= _entityName %>Entity } from '../entities/<%= _entitySlug %>.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { <%= _entityName %> } from '../../../../domain/<%= _entitySlug %>';
import { <%= _entityName %>Repository } from '../../<%= _entitySlug %>.repository';
import { <%= _entityName %>Mapper } from '../mappers/<%= _entitySlug %>.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class <%= _entityName %>RelationalRepository implements <%= _entityName %>Repository {
  constructor(
    @InjectRepository(<%= _entityName %>Entity)
    private readonly <%= h.inflection.camelize(_entityName, true) %>Repository: Repository<<%= _entityName %>Entity>,
  ) {}

  async create(data: <%= _entityName %>): Promise<<%= _entityName %>> {
    const persistenceModel = <%= _entityName %>Mapper.toPersistence(data);
    const newEntity = await this.<%= h.inflection.camelize(_entityName, true) %>Repository.save(
      this.<%= h.inflection.camelize(_entityName, true) %>Repository.create(persistenceModel),
    );
    return <%= _entityName %>Mapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<<%= _entityName %>[]> {
    const entities = await this.<%= h.inflection.camelize(_entityName, true) %>Repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => <%= _entityName %>Mapper.toDomain(entity));
  }

  async findById(id: <%= _entityName %>['id']): Promise<NullableType<<%= _entityName %>>> {
    const entity = await this.<%= h.inflection.camelize(_entityName, true) %>Repository.findOne({
      where: { id },
    });

    return entity ? <%= _entityName %>Mapper.toDomain(entity) : null;
  }

  async findByIds(ids: <%= _entityName %>['id'][]): Promise<<%= _entityName %>[]> {
    const entities = await this.<%= h.inflection.camelize(_entityName, true) %>Repository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => <%= _entityName %>Mapper.toDomain(entity));
  }

  async update(
    id: <%= _entityName %>['id'],
    payload: Partial<<%= _entityName %>>,
  ): Promise<<%= _entityName %>> {
    const entity = await this.<%= h.inflection.camelize(_entityName, true) %>Repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.<%= h.inflection.camelize(_entityName, true) %>Repository.save(
      this.<%= h.inflection.camelize(_entityName, true) %>Repository.create(
        <%= _entityName %>Mapper.toPersistence({
          ...<%= _entityName %>Mapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return <%= _entityName %>Mapper.toDomain(updatedEntity);
  }

  async remove(id: <%= _entityName %>['id']): Promise<void> {
    await this.<%= h.inflection.camelize(_entityName, true) %>Repository.delete(id);
  }
}
