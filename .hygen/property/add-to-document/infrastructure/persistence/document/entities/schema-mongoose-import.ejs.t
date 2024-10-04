---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/document/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.schema.ts
at_line: 0
skip_if: import mongoose
---
<% if (kind === 'reference') { -%>
  import mongoose from 'mongoose';
<% } -%>