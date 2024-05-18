---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/document-persistence.module.ts
---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  <%= name %>Schema,
  <%= name %>SchemaClass,
} from './entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema';
import { <%= name %>Repository } from '../<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';
import { <%= name %>DocumentRepository } from './repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: <%= name %>SchemaClass.name, schema: <%= name %>Schema },
    ]),
  ],
  providers: [
    {
      provide: <%= name %>Repository,
      useClass: <%= name %>DocumentRepository,
    },
  ],
  exports: [<%= name %>Repository],
})
export class Document<%= name %>PersistenceModule {}
