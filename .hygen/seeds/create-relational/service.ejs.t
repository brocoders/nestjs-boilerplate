---
to: src/database/seeds/relational/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>-seed.service.ts
---
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { <%= name %>Entity } from '../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
import { Repository } from 'typeorm';

@Injectable()
export class <%= name %>SeedService {
  constructor(
    @InjectRepository(<%= name %>Entity)
    private repository: Repository<<%= name %>Entity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
