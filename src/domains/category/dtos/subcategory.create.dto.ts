import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SubCategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SubCategoryUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}

export class SubCategoryCreateResponseDto {
  identifier: string;
  name: string;
  category_identifier: string;
  created_at: Date;
  updated_at: Date;
}

export class SubCategoryDeleteResponseDto {
  identifier: string;
  message: string;
  deleted_at: Date;
}