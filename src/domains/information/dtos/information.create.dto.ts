import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  category_identifier: string;

  @IsString()
  @IsNotEmpty()
  sub_category_identifier: string;
}
