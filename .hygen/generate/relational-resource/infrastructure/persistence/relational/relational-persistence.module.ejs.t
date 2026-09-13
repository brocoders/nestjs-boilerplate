---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/infrastructure/persistence/relational/relational-persistence.module.ts
---<%
const _parts = name.split('/');
const _entityName = _parts[_parts.length - 1];
const _dirParts = _parts.slice(0, -1);
const _resourceDir = (_dirParts.length ? _dirParts.map(p => h.inflection.transform(p, ['underscore','dasherize'])).join('/') + '/' : '') + h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
const _entitySlug = h.inflection.transform(_entityName, ['underscore','dasherize']);
const _entityPlural = h.inflection.transform(_entityName, ['pluralize']);
const _entityPluralSlug = h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
%>

import { Module } from '@nestjs/common';
import { <%= _entityName %>Repository } from '../<%= _entitySlug %>.repository';
import { <%= _entityName %>RelationalRepository } from './repositories/<%= _entitySlug %>.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= _entityName %>Entity } from './entities/<%= _entitySlug %>.entity';

@Module({
  imports: [TypeOrmModule.forFeature([<%= _entityName %>Entity])],
  providers: [
    {
      provide: <%= _entityName %>Repository,
      useClass: <%= _entityName %>RelationalRepository,
    },
  ],
  exports: [<%= _entityName %>Repository],
})
export class Relational<%= _entityName %>PersistenceModule {}
