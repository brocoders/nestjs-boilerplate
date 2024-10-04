---
inject: true
to: <% if (kind === 'reference') { -%>src/<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(type, ['underscore', 'dasherize']) %>.entity.ts<% } else { -%>src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity.ts<% } -%>
before: from \'typeorm\'
skip_if: <% if (kind === 'reference' && referenceType === 'oneToMany') { -%>\sManyToOne,<% } else { -%><%= true %><% } -%>
---
<% if (kind === 'reference' && referenceType === 'oneToMany') { -%>
  ManyToOne,
<% } -%>