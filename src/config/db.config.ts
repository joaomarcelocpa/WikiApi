import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'wiki',
  password: process.env.DB_PASSWORD ?? 'wiki123',
  database: process.env.DB_NAME ?? 'wiki_db',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: true,
  logging: ['error', 'warn'],
};
