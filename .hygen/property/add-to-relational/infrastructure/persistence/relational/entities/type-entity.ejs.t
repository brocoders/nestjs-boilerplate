---
inject: true
to: <% if (kind === 'reference') { -%>src/<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(type, ['underscore', 'dasherize']) %>.entity.ts<% } else { -%>src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity.ts<% } -%>
after: export class <%= type %>Entity
skip_if: <% if (!(kind === 'reference' && referenceType === 'oneToMany')) { -%><%= true -%><% } -%>
---
<% if (kind === 'reference' && referenceType === 'oneToMany') { -%>
  @ManyToOne(() => <%= name %>Entity, (parentEntity) => parentEntity.<%= property %>)
  <%= h.inflection.camelize(name, true) %>?: <%= name %>Entity;
<% } -%>