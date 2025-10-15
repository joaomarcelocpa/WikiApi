import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationController } from '../controllers/information.controller';
import { InformationService } from '../services/information.service';
import { InformationRepository } from '../repositories/information.repository';
import { Information } from '../entities/information.entity';
import { File } from '../entities/file.entity';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../category/entities/subcategory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Information, File, Category, SubCategory]),
  ],
  controllers: [InformationController],
  providers: [InformationService, InformationRepository],
  exports: [InformationService, InformationRepository],
})
export class InformationModule {}
