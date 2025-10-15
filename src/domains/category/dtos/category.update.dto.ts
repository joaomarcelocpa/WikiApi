import { IsString, IsOptional } from 'class-validator';

export class CategoryUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;
}