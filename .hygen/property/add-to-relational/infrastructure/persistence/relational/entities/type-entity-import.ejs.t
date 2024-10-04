---
inject: true
to: <% if (kind === 'reference') { -%>src/<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(type, ['underscore', 'dasherize']) %>.entity.ts<% } else { -%>src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity.ts<% } -%>
at_line: 0
skip_if: <% if (kind === 'reference' && referenceType === 'oneToMany') { -%>import { <%= name %>Entity<% } else { -%><%= true %><% } -%>
---
<% if (kind === 'reference' && referenceType === 'oneToMany') { -%>
  import { <%= name %>Entity } from '../../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
<% } -%>