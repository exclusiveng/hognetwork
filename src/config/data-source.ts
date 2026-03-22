import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      }),
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../entities/**/*.{js,ts}'],
  migrations: [__dirname + '/../migrations/**/*.{js,ts}'],
  subscribers: [],
  extra:
    process.env.DB_SSL === 'true' || process.env.DB_SSL === '1'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
});
