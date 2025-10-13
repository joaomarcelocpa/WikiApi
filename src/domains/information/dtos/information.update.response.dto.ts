import { WikiMainCategory, WikiSubCategory } from '../enums/categories.enum';
import { FileResponseDto } from './information.create.response.dto';

export class InformationUpdateResponseDto {
  identifier: string;
  question: string;
  content: string;
  file?: FileResponseDto;
  file_identifier?: number;
  main_category: WikiMainCategory;
  sub_category: WikiSubCategory;
  user_identifier: string;
  user_name: string;
  created_at: Date;
  updated_at: Date;
}
