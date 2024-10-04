---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
at_line: 0
skip_if: import { <%= h.inflection.transform(type, ['pluralize']) %>Service
---
<% if (kind === 'reference' || kind === 'duplication') { -%>import { <%= h.inflection.transform(type, ['pluralize']) %>Service } from '../<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>.service';<% } -%>