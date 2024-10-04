---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper.ts
after: new <%= name %>SchemaClass\(\)
---
<% if (kind === 'primitive') { -%>
  persistenceSchema.<%= property %> = domainEntity.<%= property %>;
<% } else if (kind === 'reference' || kind === 'duplication') { -%>
  <% if (referenceType === 'oneToOne' || referenceType === 'manyToOne') { -%>
    if (domainEntity.<%= property %>) {
      persistenceSchema.<%= property %> = <%= type %>Mapper.toPersistence(domainEntity.<%= property %>);
    }
    <% if (isNullable) { -%>
      else if (domainEntity.<%= property %> === null) {
        persistenceSchema.<%= property %> = null;
      }
    <% } -%>
  <% } else if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
    if (domainEntity.<%= property %>) {
      persistenceSchema.<%= property %> = domainEntity.<%= property %>.map((item) => <%= type %>Mapper.toPersistence(item));
    }
    <% if (isNullable) { -%>
      else if (domainEntity.<%= property %> === null) {
        persistenceSchema.<%= property %> = null;
      }
    <% } -%>
  <% } -%>
<% } -%>