---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity.ts
before: from \'typeorm\'
skip_if: \sOneToMany,
---
<% if (kind === 'reference' && referenceType === 'oneToMany') { -%>
  OneToMany,
<% } -%>