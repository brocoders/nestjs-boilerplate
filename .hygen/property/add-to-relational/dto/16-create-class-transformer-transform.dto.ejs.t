---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
before: "} from 'class-transformer'"
skip_if: \Transform,
---
<% if (isAddToDto && (kind === 'primitive' && type === 'Date')) { -%>
  Transform,
<% } -%>