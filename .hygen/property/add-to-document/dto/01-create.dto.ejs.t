---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
after: export class Create<%= name %>Dto
---

<% if (isAddToDto) { -%>
  @ApiProperty({
    required: <%= !(isOptional || isNullable) %>,
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
          [<%= type %>Dto],
        <% } else { -%>
          <%= type %>Dto,
        <% } -%>
      <% } -%>
  })
<% } -%>

<% if (isAddToDto) { -%>
  <% if (isOptional || isNullable) { -%>
    @IsOptional()
  <% } -%>
  <% if (kind === 'primitive') { -%>
    <% if (type === 'string') { -%>
      @IsString()
    <% } else if (type === 'number') { -%>
      @IsNumber()
    <% } else if (type === 'boolean') { -%>
      @IsBoolean()
    <% } else if (type === 'Date') { -%>
      @Transform(({ value }) => new Date(value))
      @IsDate()
    <% } -%>
  <% } else if (kind === 'reference' || kind === 'duplication') { -%>
    @ValidateNested()
    @Type(() => <%= type %>Dto)
    <% if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
      @IsArray()
    <% } else { -%>
      @IsNotEmptyObject()
    <% } -%>
  <% } -%>
<% } -%>

<% if (kind === 'reference' || kind === 'duplication') { -%>
  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %>Dto<% if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>[]<% } -%> <% if (isNullable) { -%> | null<% } -%>;
<% } else { -%>
  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %> <% if (isNullable) { -%> | null<% } -%>;
<% } -%>
