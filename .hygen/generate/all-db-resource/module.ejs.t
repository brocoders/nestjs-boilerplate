---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module.ts
---
import { Module } from '@nestjs/common';
import { <%= h.inflection.transform(name, ['pluralize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { <%= h.inflection.transform(name, ['pluralize']) %>Controller } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller';
import { Relational<%= name %>PersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { Document<%= name %>PersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? Document<%= name %>PersistenceModule
  : Relational<%= name %>PersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [<%= h.inflection.transform(name, ['pluralize']) %>Controller],
  providers: [<%= h.inflection.transform(name, ['pluralize']) %>Service],
  exports: [<%= h.inflection.transform(name, ['pluralize']) %>Service, infrastructurePersistenceModule],
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Module {}
