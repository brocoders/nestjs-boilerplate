---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper.ts
after: new <%= name %>\(\)
---
<% if (kind === 'primitive') { -%>
  domainEntity.<%= property %> = raw.<%= property %>;
<% } else if (kind === 'reference' && !shouldAutoLoad) { -%>
  <% if (referenceType === 'oneToOne' || referenceType === 'manyToOne') { -%>
    if (raw.<%= property %>) {
      const <%= property %>Domain = new <%= type %>();
      <%= property %>Domain.id = raw.<%= property %>.toString();
      domainEntity.<%= property %> = <%= property %>Domain;
    }
    <% if (isNullable) { -%>
      else if (raw.<%= property %> === null) {
        domainEntity.<%= property %> = null;
      }
    <% } -%>
  <% } else if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
    if (raw.<%= property %>) {
      domainEntity.<%= property %> = raw.<%= property %>.map((id) => {
        const item = new <%= type %>();
        item.id = id.toString();
        return item;
      });
    }
    <% if (isNullable) { -%>
      else if (raw.<%= property %> === null) {
        domainEntity.<%= property %> = null;
      }
    <% } -%>
  <% } -%>
<% } else if (kind === 'reference' || kind === 'denormalized') { -%>
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