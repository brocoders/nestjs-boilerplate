---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper.ts
at_line: 1
skip_if: import { <%= type %>Mapper
---
<% if ((kind === 'reference' && shouldAutoLoad) || kind === 'denormalized') { -%>
  import { <%= type %>Mapper } from '../../../../../<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/mappers/<%= h.inflection.transform(type, ['underscore', 'dasherize']) %>.mapper';
<% } -%>