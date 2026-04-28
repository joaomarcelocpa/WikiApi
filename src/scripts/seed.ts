import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'wiki',
  password: process.env.DB_PASSWORD ?? 'wiki123',
  database: process.env.DB_NAME ?? 'wiki_db',
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository('users');

  const email = 'master@wiki.local';
  const existing = await userRepo.findOne({ where: { email } });

  if (existing) {
    console.log('Usuário MASTER já existe, pulando...');
    await AppDataSource.destroy();
    return;
  }

  await userRepo.save({
    id: createId(),
    name: 'Master',
    email,
    password: await bcrypt.hash('123mudar', 10),
    type: 'MASTER',
    deleted: false,
    deleted_at: null,
  });

  console.log('✔ MASTER criado: master@wiki.local / 123mudar');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
