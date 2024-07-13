---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper.ts
after: new <%= name %>\(\)
---
domainEntity.<%= property %> = raw.<%= property %>;