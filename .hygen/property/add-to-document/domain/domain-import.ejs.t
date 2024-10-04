---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.ts
at_line: 0
skip_if: import { <%= type %><% if (type === 'File') { -%>Type<% } -%>
---
<% if (kind === 'reference' || kind === 'duplication') { -%>import { <%= type %><% if (type === 'File') { -%>Type<% } -%> } from '../../<%= h.inflection.transform(type, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(type, ['underscore', 'dasherize']) %>';<% } -%>