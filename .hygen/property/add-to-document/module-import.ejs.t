---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module.ts
at_line: 0
skip_if: import { <%= h.inflection.transform(type, ['pluralize']) %>Module
---
<% if (kind === 'reference' || kind === 'duplication') { -%>import { <%= h.inflection.transform(type, ['pluralize']) %>Module } from '../<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>.module';<% } -%>