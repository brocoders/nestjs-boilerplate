/opt/wait-for-it.sh postgres:5432 -- npm run migration:run && npm run seed:run
npm run start:prod > /dev/null 2>&1 &
/opt/wait-for-it.sh localhost:3000 -- npm run test:e2e
