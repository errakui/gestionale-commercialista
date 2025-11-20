import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const isDev = process.env.NODE_ENV !== 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'railway',
  entities: [isDev ? 'src/**/*.entity{.ts,.js}' : 'dist/**/*.entity{.ts,.js}'],
  migrations: [isDev ? 'src/database/migrations/*{.ts,.js}' : 'dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: isDev,
  ssl: !isDev ? { rejectUnauthorized: false } : false,
});

