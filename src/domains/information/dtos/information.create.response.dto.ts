import { WikiMainCategory, WikiSubCategory } from '../enums/categories.enum';

export class FileResponseDto {
  id: number;
  originalName: string;
  fileName: string;
  path: string;
  mimetype: string;
  size: number;
  uploaded_at: Date;
}

export class InformationCreateResponseDto {
  identifier: string;
  question: string;
  content: string;
  file?: FileResponseDto;
  file_identifier?: number;
  main_category: WikiMainCategory;
  sub_category: WikiSubCategory;
  created_at: Date;
  updated_at: Date;
}
