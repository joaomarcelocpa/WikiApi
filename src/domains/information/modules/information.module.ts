import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationController } from '../controllers/information.controller';
import { InformationService } from '../services/information.service';
import { InformationRepository } from '../repositories/information.repository';
import { Information } from '../entities/information.entity';
import { File } from '../entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Information, File])],
  controllers: [InformationController],
  providers: [InformationService, InformationRepository],
  exports: [InformationService],
})
export class InformationModule {}
