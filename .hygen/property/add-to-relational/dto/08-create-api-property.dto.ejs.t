---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
before: "} from '@nestjs/swagger'"
skip_if: \ApiProperty,
---
<% if (isAddToDto) { -%>
  ApiProperty,
<% } -%>