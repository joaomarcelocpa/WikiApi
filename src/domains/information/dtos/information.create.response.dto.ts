export class FileResponseDto {
  id: number;
  originalName: string;
  fileName: string;
  path: string;
  mimetype: string;
  size: number;
  uploaded_at: Date;
}

export class CategoryInfoDto {
  identifier: string;
  name: string;
}

export class SubCategoryInfoDto {
  identifier: string;
  name: string;
  category_identifier: string;
}

export class InformationCreateResponseDto {
  identifier: string;
  question: string;
  content: string;
  file?: FileResponseDto;
  file_identifier?: number;
  category_identifier: string;
  category: CategoryInfoDto;
  sub_category_identifier: string;
  subCategory: SubCategoryInfoDto;
  user_identifier: string;
  user_name: string;
  created_at: Date;
  updated_at: Date;
}
