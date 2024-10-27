---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema.ts
after: export class <%= name %>SchemaClass
---

<% if (kind === 'reference') { -%>
  <% if (referenceType === 'oneToOne' || referenceType === 'manyToOne') { -%>
    @Prop({
      type: mongoose.Schema.Types.ObjectId,
      ref: '<%= type %>SchemaClass',
      autopopulate: <% if (propertyInReference) { -%>false<% } else { -%>true<% } -%>,
    })
    <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %>SchemaClass <% if (isNullable) { -%> | null<% } -%>;
  <% } else if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
    @Prop({
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: '<%= type %>SchemaClass',
        autopopulate: true,
      }]
    })
    <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %>SchemaClass[] <% if (isNullable) { -%> | null<% } -%>;
  <% } -%>
<% } else if (kind === 'duplication') { -%>
  <% if (referenceType === 'oneToOne' || referenceType === 'manyToOne') { -%>
    @Prop({
      type: <%= type %>SchemaClass,
    })
    <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %>SchemaClass <% if (isNullable) { -%> | null<% } -%>;
  <% } else if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
    @Prop({
      type: ['<%= type %>SchemaClass'],
    })
    <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %>SchemaClass[] <% if (isNullable) { -%> | null<% } -%>;
  <% } -%>
<% } else { -%>
  @Prop({
    type:
      <% if (type === 'string') { -%>
        String,
      <% } else if (type === 'number') { -%>
        Number,
      <% } else if (type === 'boolean') { -%>
        Boolean,
      <% } -%>
  })
  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %> <% if (isNullable) { -%> | null<% } -%>;
<% } -%>