import {
  CategoryInfoDto,
  FileResponseDto,
  SubCategoryInfoDto,
} from './information.create.response.dto';

export class InformationViewResponseDto {
  identifier: string;
  question: string;
  content: string;
  slug: string;
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
