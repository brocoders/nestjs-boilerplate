---
to: src/database/seeds/relational/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.module.ts
---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= name %>Entity } from '../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
import { <%= name %>SeedService } from './<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([<%= name %>Entity])],
  providers: [<%= name %>SeedService],
  exports: [<%= name %>SeedService],
})
export class <%= name %>SeedModule {}
