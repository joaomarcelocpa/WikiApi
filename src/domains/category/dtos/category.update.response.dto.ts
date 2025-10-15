export interface SubCategoryInfo {
  identifier: string;
  name: string;
  category_identifier: string;
  created_at: Date;
  updated_at: Date;
}

export class CategoryUpdateResponseDto {
  identifier: string;
  name: string;
  subCategories: SubCategoryInfo[];
  created_at: Date;
  updated_at: Date;
}