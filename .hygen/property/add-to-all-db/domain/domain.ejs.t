---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.ts
after: export class <%= name %> {
---

@ApiProperty({
  type: () => 
    <% if (kind === 'primitive') { -%>
      <% if (type === 'string') { -%>
        String,
      <% } else if (type === 'number') { -%>
        Number,
      <% } else if (type === 'boolean') { -%>
        Boolean,
      <% } else if (type === 'Date') { -%>
        Date,
      <% } -%>
    <% } else if (kind === 'reference' || kind === 'duplication') { -%>
      <% if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
        [<%= type %><% if (type === 'File') { -%>Type<% } -%>],
      <% } else { -%>
        <%= type %><% if (type === 'File') { -%>Type<% } -%>,
      <% } -%>
    <% } -%>
  nullable: <%= isNullable %>,
})

<% if (kind === 'reference' || kind === 'duplication') { -%>
  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %><% if (type === 'File') { -%>Type<% } -%><% if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>[]<% } -%> <% if (isNullable) { -%> | null<% } -%>;
<% } else { -%>
  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %> <% if (isNullable) { -%> | null<% } -%>;
<% } -%>
