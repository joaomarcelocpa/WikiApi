import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { WikiMainCategory, WikiSubCategory } from '../enums/categories.enum';

export class InformationCreateDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  file_identifier?: number;

  @IsEnum(WikiMainCategory)
  @IsNotEmpty()
  main_category: WikiMainCategory;

  @IsEnum(WikiSubCategory)
  @IsNotEmpty()
  sub_category: WikiSubCategory;
}
