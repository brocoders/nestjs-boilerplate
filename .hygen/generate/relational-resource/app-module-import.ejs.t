---
inject: true
to: src/app.module.ts
before: \@Module
---
import { <%= h.inflection.transform(name, ['pluralize']) %>Module } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module';
