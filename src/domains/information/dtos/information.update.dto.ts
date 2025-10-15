import { IsString, IsOptional, IsNumber } from 'class-validator';

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
  @IsString()
  category_identifier?: string;

  @IsOptional()
  @IsString()
  sub_category_identifier?: string;
}
