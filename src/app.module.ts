import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { InformationModule } from './domains/information/modules/information.module';
import { UsersModule } from './domains/users/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    InformationModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
