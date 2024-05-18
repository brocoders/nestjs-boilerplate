---
inject: true
to: src/app.module.ts
after: imports
---
    <%= h.inflection.transform(name, ['pluralize']) %>Module,