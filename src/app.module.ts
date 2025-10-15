import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { InformationModule } from './domains/information/modules/information.module';
import { UsersModule } from './domains/users/modules/user.module';
import { AuthModule } from './domains/auth/modules/auth.module';
import { CategoryModule } from './domains/category/modules/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    InformationModule,
    CategoryModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
