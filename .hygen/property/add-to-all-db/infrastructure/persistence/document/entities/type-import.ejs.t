---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema.ts
at_line: 0
skip_if: <% if (kind === 'reference' || kind === 'duplication') { -%>import { <%= type %>SchemaClass<% } else { -%><%= true %><% } -%>
---
<% if (kind === 'reference' || kind === 'duplication') { -%>
  import { <%= type %>SchemaClass } from '../../../../../<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/entities/<%= h.inflection.transform(type, ['underscore', 'dasherize']) %>.schema';
<% } -%>