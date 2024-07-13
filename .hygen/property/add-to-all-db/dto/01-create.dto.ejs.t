---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
after: export class Create<%= name %>Dto
---

<% if (isAddToDto) { -%>
  @ApiProperty()
  <% if (type === 'string') { -%>
  @IsString()
  <% } -%>
  <% if (type === 'number') { -%>
  @IsNumber()
  <% } -%>
  <% if (type === 'boolean') { -%>
  @IsBoolean()
  <% } -%>
  <%= property %>: <%= type %>;
<% } -%>
