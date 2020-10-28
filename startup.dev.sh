/opt/wait-for-it.sh postgres:5432 -- npm run migration:run && npm run seed:run
npm run start:prod
