---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/dto/update-<%= h.inflection.transform(name.split('/').pop(), ['underscore','dasherize']) %>.dto.ts
---<%
const _parts = name.split('/');
const _entityName = _parts[_parts.length - 1];
const _dirParts = _parts.slice(0, -1);
const _resourceDir = (_dirParts.length ? _dirParts.map(p => h.inflection.transform(p, ['underscore','dasherize'])).join('/') + '/' : '') + h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
const _entitySlug = h.inflection.transform(_entityName, ['underscore','dasherize']);
const _entityPlural = h.inflection.transform(_entityName, ['pluralize']);
const _entityPluralSlug = h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
%>

// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { Create<%= _entityName %>Dto } from './create-<%= _entitySlug %>.dto';

export class Update<%= _entityName %>Dto extends PartialType(Create<%= _entityName %>Dto) {}
