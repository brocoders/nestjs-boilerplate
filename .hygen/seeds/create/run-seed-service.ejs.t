---
inject: true
to: src/database/seeds/run-seed.ts
before: close
---
  await app.get(<%= name %>SeedService).run();
