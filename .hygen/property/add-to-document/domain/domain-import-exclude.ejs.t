---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.ts
at_line: 0
skip_if: from 'class-transformer'
---
<% if (!isAddToDto) { -%>import { Exclude } from 'class-transformer';<% } -%>
