---
inject: true
to: src/app.module.ts
before: \@Module
---<%
const _parts = name.split('/');
const _entityName = _parts[_parts.length - 1];
const _dirParts = _parts.slice(0, -1);
const _resourceDir = (_dirParts.length ? _dirParts.map(p => h.inflection.transform(p, ['underscore','dasherize'])).join('/') + '/' : '') + h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
const _entitySlug = h.inflection.transform(_entityName, ['underscore','dasherize']);
const _entityPlural = h.inflection.transform(_entityName, ['pluralize']);
const _entityPluralSlug = h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
%>

import { <%= _entityPlural %>Module } from './<%= _resourceDir %>/<%= _resourceDir %>.module';
