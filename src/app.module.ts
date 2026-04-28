import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { InformationModule } from './domains/information/modules/information.module';
import { UsersModule } from './domains/users/modules/user.module';
import { AuthModule } from './domains/auth/modules/auth.module';
import { CategoryModule } from './domains/category/modules/category.module';
import { JwtAuthGuard } from './domains/auth/guards/jwt-auth.guard';
import { RolesGuard } from './domains/auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    InformationModule,
    CategoryModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
