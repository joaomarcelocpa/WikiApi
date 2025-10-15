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
  UseGuards,
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
  SubCategoryDeleteResponseDto,
  SubCategoryCreateResponseDto,
} from '../dtos/subcategory.create.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CategoryCreateDto,
  ): Promise<CategoryCreateResponseDto> {
    return await this.categoryService.create(dto);
  }

  @Put(':identifier')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('identifier') identifier: string,
    @Body() dto: CategoryUpdateDto,
  ): Promise<CategoryUpdateResponseDto> {
    return await this.categoryService.update(identifier, dto);
  }

  @Delete(':identifier')
  @UseGuards(JwtAuthGuard)
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

  @Get(':categoryIdentifier/subcategories')
  @HttpCode(HttpStatus.OK)
  async findSubCategoriesByCategory(
    @Param('categoryIdentifier') categoryIdentifier: string,
  ) {
    const category =
      await this.categoryService.findSubCategoriesByCategory(
        categoryIdentifier,
      );

    return category.subCategories || [];
  }

  @Get('subcategory/:identifier')
  @HttpCode(HttpStatus.OK)
  async findSubCategoryByIdentifier(@Param('identifier') identifier: string) {
    return await this.categoryService.findSubCategoryByIdentifier(identifier);
  }

  @Post('subcategory')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSubCategory(
    @Body() dto: SubCategoryCreateDto,
  ): Promise<SubCategoryCreateResponseDto> {
    return await this.categoryService.createSubCategory(dto);
  }

  @Delete('subcategory/:identifier')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteSubCategory(
    @Param('identifier') identifier: string,
  ): Promise<SubCategoryDeleteResponseDto> {
    return await this.categoryService.deleteSubCategory(identifier);
  }
}
