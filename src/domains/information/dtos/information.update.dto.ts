import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { WikiMainCategory, WikiSubCategory } from '../enums/categories.enum';

export class InformationUpdateDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  file_identifier?: number;

  @IsOptional()
  @IsEnum(WikiMainCategory)
  main_category?: WikiMainCategory;

  @IsOptional()
  @IsEnum(WikiSubCategory)
  sub_category?: WikiSubCategory;
}
