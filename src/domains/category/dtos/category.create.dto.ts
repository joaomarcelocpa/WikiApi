import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  subCategoryNames?: string[];
}
