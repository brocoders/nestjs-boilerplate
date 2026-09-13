---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/<%= h.inflection.transform(name.split('/').pop(), ['pluralize','underscore','dasherize']) %>.module.ts
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
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { <%= _entityPlural %>Service } from './<%= _entityPluralSlug %>.service';
import { <%= _entityPlural %>Controller } from './<%= _entityPluralSlug %>.controller';
import { Relational<%= _entityName %>PersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    Relational<%= _entityName %>PersistenceModule,
  ],
  controllers: [<%= _entityPlural %>Controller],
  providers: [<%= _entityPlural %>Service],
  exports: [<%= _entityPlural %>Service, Relational<%= _entityName %>PersistenceModule],
})
export class <%= _entityPlural %>Module {}
