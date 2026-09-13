---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/infrastructure/persistence/<%= h.inflection.transform(name.split('/').pop(), ['underscore','dasherize']) %>.repository.ts
---<%
const _parts = name.split('/');
const _entityName = _parts[_parts.length - 1];
const _dirParts = _parts.slice(0, -1);
const _resourceDir = (_dirParts.length ? _dirParts.map(p => h.inflection.transform(p, ['underscore','dasherize'])).join('/') + '/' : '') + h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
const _entitySlug = h.inflection.transform(_entityName, ['underscore','dasherize']);
const _entityPlural = h.inflection.transform(_entityName, ['pluralize']);
const _entityPluralSlug = h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
%>

import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { <%= _entityName %> } from '../../domain/<%= _entitySlug %>';

export abstract class <%= _entityName %>Repository {
  abstract create(
    data: Omit<<%= _entityName %>, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<<%= _entityName %>>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<<%= _entityName %>[]>;

  abstract findById(id: <%= _entityName %>['id']): Promise<NullableType<<%= _entityName %>>>;

  abstract findByIds(ids: <%= _entityName %>['id'][]): Promise<<%= _entityName %>[]>;

  abstract update(
    id: <%= _entityName %>['id'],
    payload: DeepPartial<<%= _entityName %>>,
  ): Promise<<%= _entityName %> | null>;

  abstract remove(id: <%= _entityName %>['id']): Promise<void>;
}
