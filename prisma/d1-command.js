require('dotenv/config');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const command = process.argv[2];
const databaseName = process.env.CLOUDFLARE_DATABASE_NAME;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken =
  process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_D1_TOKEN;
const databaseId = process.env.CLOUDFLARE_DATABASE_ID;

if (!databaseName) {
  throw new Error('CLOUDFLARE_DATABASE_NAME is required in .env');
}

if (!accountId || !apiToken || !databaseId) {
  throw new Error(
    'CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN/CLOUDFLARE_D1_TOKEN, and CLOUDFLARE_DATABASE_ID are required in .env',
  );
}

async function main() {
  if (command === 'create') {
    const response = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/' +
        accountId +
        '/d1/database',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: databaseName,
        }),
      },
    );

    await printJsonResponse(response);
    return;
  }

  if (command === 'migration-create') {
    const name = process.argv[3] ?? 'new_migration';
    const migrationPath = join(
      process.cwd(),
      'prisma',
      'migrations',
      `${name}.sql`,
    );

    console.log(
      `Create the migration file manually at ${migrationPath} for remote D1.`,
    );
    return;
  }

  const migrationFile = process.argv[3] ?? '0001_init.sql';
  const sqlFile =
    command === 'seed'
      ? join(process.cwd(), 'prisma', 'seed.sql')
      : join(
          process.cwd(),
          'prisma',
          'migrations',
          migrationFile.endsWith('.sql') ? migrationFile : `${migrationFile}.sql`,
        );

  const sql = readFileSync(sqlFile, 'utf8');
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
      }),
    },
  );

  await printJsonResponse(response);
}

async function printJsonResponse(response) {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Cloudflare API request failed (${response.status}): ${text}`);
  }

  console.log(text);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
