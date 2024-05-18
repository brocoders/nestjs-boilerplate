---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module.ts
---
import { Module } from '@nestjs/common';
import { <%= h.inflection.transform(name, ['pluralize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { <%= h.inflection.transform(name, ['pluralize']) %>Controller } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller';
import { Relational<%= name %>PersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [Relational<%= name %>PersistenceModule],
  controllers: [<%= h.inflection.transform(name, ['pluralize']) %>Controller],
  providers: [<%= h.inflection.transform(name, ['pluralize']) %>Service],
  exports: [<%= h.inflection.transform(name, ['pluralize']) %>Service, Relational<%= name %>PersistenceModule],
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Module {}
