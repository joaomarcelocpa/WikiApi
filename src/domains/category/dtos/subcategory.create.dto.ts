// sub-category.create.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class SubCategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category_identifier: string;
}

// sub-category.create.response.dto.ts
export class SubCategoryCreateResponseDto {
  identifier: string;
  name: string;
  category_identifier: string;
  created_at: Date;
  updated_at: Date;
}

// sub-category.delete.response.dto.ts
export class SubCategoryDeleteResponseDto {
  identifier: string;
  message: string;
  deleted_at: Date;
}