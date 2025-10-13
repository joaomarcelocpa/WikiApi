import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { InformationModule } from './domains/information/modules/information.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), InformationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
