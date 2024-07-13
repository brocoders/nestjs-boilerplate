---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema.ts
after: export class <%= name %>SchemaClass
---

@ApiProperty()
@Prop()
<%= property %>: <%= type %>;
