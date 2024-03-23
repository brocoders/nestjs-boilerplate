---
to: src/database/seeds/document/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.service.ts
---
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { <%= name %>SchemaClass } from '../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema';

@Injectable()
export class <%= name %>SeedService {
  constructor(
    @InjectModel(<%= name %>SchemaClass.name)
    private readonly model: Model<<%= name %>SchemaClass>,
  ) {}

  async run() {
    const count = await this.model.countDocuments();

    if (count === 0) {
      const data = new this.model({});
      await data.save();
    }
  }
}
