---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
before: "} from 'class-transformer'"
skip_if: \Type,
---
<% if (isAddToDto && (kind === 'reference' || kind === 'duplication')) { -%>
  Type,
<% } -%>