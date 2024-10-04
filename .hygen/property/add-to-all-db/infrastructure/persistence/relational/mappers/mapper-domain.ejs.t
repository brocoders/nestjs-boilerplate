---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper.ts
after: new <%= name %>\(\)
---
<% if (kind === 'primitive') { -%>
  domainEntity.<%= property %> = raw.<%= property %>;
<% } else if (kind === 'reference' || kind === 'duplication') { -%>
  <% if (referenceType === 'oneToOne' || referenceType === 'manyToOne') { -%>
    if (raw.<%= property %>) {
      domainEntity.<%= property %> = <%= type %>Mapper.toDomain(raw.<%= property %>);
    }
    <% if (isNullable) { -%>
      else if (raw.<%= property %> === null) {
        domainEntity.<%= property %> = null;
      }
    <% } -%>
  <% } else if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
    if (raw.<%= property %>) {
      domainEntity.<%= property %> = raw.<%= property %>.map((item) => <%= type %>Mapper.toDomain(item));
    }
    <% if (isNullable) { -%>
      else if (raw.<%= property %> === null) {
        domainEntity.<%= property %> = null;
      }
    <% } -%>
  <% } -%>
<% } -%>



