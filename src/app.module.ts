import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { InformationModule } from './domains/information/modules/information.module';
import { UsersModule } from './domains/users/modules/user.module';
import { AuthModule } from './domains/auth/modules/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    InformationModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
