import { DataSource } from 'typeorm';
import { config } from 'dotenv';

/**
 * Core database connection for migrations
 * Used only for core schema management
 */
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.CORE_DB_HOST,
  port: parseInt(process.env.CORE_DB_PORT || '5432', 10),
  username: process.env.CORE_DB_USER,
  password: process.env.CORE_DB_PASSWORD,
  database: process.env.CORE_DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/core/*{.ts,.js}'],
  synchronize: false,
});
