---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto.ts
---
// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

export class Create<%= name %>Dto {}
