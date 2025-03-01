---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
before: private readonly <%= h.inflection.camelize(type, true) %>Service
skip_if: \=\> <%= h.inflection.transform(type, ['pluralize']) %>Service\)\)
---
<% if (kind === 'reference' || kind === 'duplication') { -%>
  <% if (referenceType === 'oneToMany' || (referenceType === 'manyToOne' && !!propertyInReference)) { -%>
    @Inject(forwardRef(() => <%= h.inflection.transform(type, ['pluralize']) %>Service))
  <% } -%>
<% } -%>