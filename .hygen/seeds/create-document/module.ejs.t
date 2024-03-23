---
to: src/database/seeds/document/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.module.ts
---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { <%= name %>Schema, <%= name %>SchemaClass } from '../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema';
import { <%= name %>SeedService } from './<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: <%= name %>SchemaClass.name,
        schema: <%= name %>Schema,
      },
    ]),
  ],
  providers: [<%= name %>SeedService],
  exports: [<%= name %>SeedService],
})
export class <%= name %>SeedModule {}
