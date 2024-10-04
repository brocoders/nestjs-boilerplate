---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
after: \<updating\-property\-payload \/\>
---
<% if (kind === 'reference' || kind === 'duplication') { -%>
  <%= property %>,
<% } else { -%>
  <%= property %>: update<%= name %>Dto.<%= property %>,
<% } -%>