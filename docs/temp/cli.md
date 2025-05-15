Creating seeds (TypeORM)
Create seed file with npm run seed:create:relational -- --name Post. Where Post is name of entity.
Go to src/database/seeds/relational/post/post-seed.service.ts.


generate migration file:

npm run migration:generate -- src/database/migrations/CreatePostTable


Run migration
npm run migration:run
Revert migration
npm run migration:revert
Drop all tables in database
npm run schema:drop
