module.exports = {
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/**/*{.ts,.js}'],
  seeds: ['seeds/**/*{.ts,.js}'],
  factories: ['factories/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true'
        ? {
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA
              ? fs.readFileSync(process.env.DATABASE_CA).toString()
              : undefined,
            key: process.env.DATABASE_KEY
              ? fs.readFileSync(process.env.DATABASE_KEY).toString()
              : undefined,
            cert: process.env.DATABASE_CERT
              ? fs.readFileSync(process.env.DATABASE_CERT).toString()
              : undefined,
          }
        : undefined,
  },
};
