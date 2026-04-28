import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { CategoryUpdateDto } from '../dtos/category.update.dto';
import { CategoryCreateResponseDto } from '../dtos/category.create.response.dto';
import { CategoryUpdateResponseDto } from '../dtos/category.update.response.dto';
import { CategoryViewResponseDto } from '../dtos/category.view.dto';
import { CategoryDeleteResponseDto } from '../dtos/category.delete.response.dto';
import {
  SubCategoryCreateDto,
  SubCategoryUpdateDto,
  SubCategoryDeleteResponseDto,
  SubCategoryCreateResponseDto,
} from '../dtos/subcategory.create.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../users/enums/user-type.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(UserType.MASTER, UserType.DEVELOPER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CategoryCreateDto,
  ): Promise<CategoryCreateResponseDto> {
    return await this.categoryService.create(dto);
  }

  @Put(':identifier')
  @Roles(UserType.MASTER, UserType.DEVELOPER)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('identifier') identifier: string,
    @Body() dto: CategoryUpdateDto,
  ): Promise<CategoryUpdateResponseDto> {
    return await this.categoryService.update(identifier, dto);
  }

  @Delete(':identifier')
  @Roles(UserType.MASTER, UserType.DEVELOPER)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('identifier') identifier: string,
  ): Promise<CategoryDeleteResponseDto> {
    return await this.categoryService.delete(identifier);
  }

  @Get(':identifier')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('identifier') identifier: string,
  ): Promise<CategoryViewResponseDto> {
    return await this.categoryService.findOne(identifier);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<CategoryViewResponseDto[]> {
    return await this.categoryService.findAll();
  }

  @Post(':categoryId/subcategory')
  @Roles(UserType.MASTER, UserType.DEVELOPER)
  @HttpCode(HttpStatus.CREATED)
  async createSubCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: SubCategoryCreateDto,
  ): Promise<SubCategoryCreateResponseDto> {
    return await this.categoryService.createSubCategory(categoryId, dto);
  }

  @Get(':categoryId/subcategory')
  @HttpCode(HttpStatus.OK)
  async findSubCategories(@Param('categoryId') categoryId: string) {
    const category =
      await this.categoryService.findSubCategoriesByCategory(categoryId);
    return category.subCategories || [];
  }

  @Get(':categoryId/subcategory/:id')
  @HttpCode(HttpStatus.OK)
  async findSubCategoryById(@Param('id') id: string) {
    return await this.categoryService.findSubCategoryByIdentifier(id);
  }

  @Put(':categoryId/subcategory/:id')
  @Roles(UserType.MASTER, UserType.DEVELOPER)
  @HttpCode(HttpStatus.OK)
  async updateSubCategory(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Body() dto: SubCategoryUpdateDto,
  ): Promise<SubCategoryCreateResponseDto> {
    return await this.categoryService.updateSubCategory(categoryId, id, dto);
  }

  @Delete(':categoryId/subcategory/:id')
  @Roles(UserType.MASTER, UserType.DEVELOPER)
  @HttpCode(HttpStatus.OK)
  async deleteSubCategory(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
  ): Promise<SubCategoryDeleteResponseDto> {
    return await this.categoryService.deleteSubCategory(categoryId, id);
  }
}
