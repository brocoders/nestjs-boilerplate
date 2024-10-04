---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
at_line: 0
skip_if: import { <%= type %>Dto
---
<% if (kind === 'reference' || kind === 'duplication') { -%>
  import { <%= type %>Dto } from '../../<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/dto/<%= h.inflection.transform(type, ['underscore', 'dasherize']) %>.dto';
<% } -%>