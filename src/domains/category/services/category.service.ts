import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
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

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(dto: CategoryCreateDto): Promise<CategoryCreateResponseDto> {
    const category = await this.categoryRepository.create(
      {
        name: dto.name,
      },
      dto.subCategoryNames,
    );

    return {
      identifier: category.identifier,
      name: category.name,
      subCategories: category.subCategories
        ? category.subCategories.map((sub) => ({
            identifier: sub.identifier,
            name: sub.name,
            category_identifier: sub.category_identifier,
            created_at: sub.created_at,
            updated_at: sub.updated_at,
          }))
        : [],
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  async update(
    identifier: string,
    dto: CategoryUpdateDto,
  ): Promise<CategoryUpdateResponseDto> {
    const category = await this.categoryRepository.findByIdentifier(identifier);

    if (!category) {
      throw new NotFoundException(
        `Categoria com identificador ${identifier} não encontrada`,
      );
    }

    const updatedCategory = await this.categoryRepository.update(
      identifier,
      dto,
    );

    if (!updatedCategory) {
      throw new NotFoundException(
        `Falha ao atualizar categoria com identificador ${identifier}`,
      );
    }

    return {
      identifier: updatedCategory.identifier,
      name: updatedCategory.name,
      subCategories: updatedCategory.subCategories
        ? updatedCategory.subCategories.map((sub) => ({
            identifier: sub.identifier,
            name: sub.name,
            category_identifier: sub.category_identifier,
            created_at: sub.created_at,
            updated_at: sub.updated_at,
          }))
        : [],
      created_at: updatedCategory.created_at,
      updated_at: updatedCategory.updated_at,
    };
  }

  async delete(identifier: string): Promise<CategoryDeleteResponseDto> {
    const category = await this.categoryRepository.findByIdentifier(identifier);

    if (!category) {
      throw new NotFoundException(
        `Categoria com identificador ${identifier} não encontrada`,
      );
    }

    const deleted = await this.categoryRepository.softDelete(identifier);

    if (!deleted) {
      throw new BadRequestException(
        `Falha ao deletar categoria com identificador ${identifier}`,
      );
    }

    return {
      identifier,
      message: 'Categoria deletada com sucesso',
      deleted_at: new Date(),
    };
  }

  async findOne(identifier: string): Promise<CategoryViewResponseDto> {
    const category = await this.categoryRepository.findByIdentifier(identifier);

    if (!category) {
      throw new NotFoundException(
        `Categoria com identificador ${identifier} não encontrada`,
      );
    }

    return {
      identifier: category.identifier,
      name: category.name,
      subCategories: category.subCategories
        ? category.subCategories.map((sub) => ({
            identifier: sub.identifier,
            name: sub.name,
            category_identifier: sub.category_identifier,
            created_at: sub.created_at,
            updated_at: sub.updated_at,
          }))
        : [],
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  async findAll(): Promise<CategoryViewResponseDto[]> {
    const categories = await this.categoryRepository.findAll();

    return categories.map((category): CategoryViewResponseDto => {
      return {
        identifier: category.identifier,
        name: category.name,
        subCategories: category.subCategories
          ? category.subCategories.map((sub) => ({
              identifier: sub.identifier,
              name: sub.name,
              category_identifier: sub.category_identifier,
              created_at: sub.created_at,
              updated_at: sub.updated_at,
            }))
          : [],
        created_at: category.created_at,
        updated_at: category.updated_at,
      };
    });
  }

  async findSubCategoriesByCategory(
    categoryIdentifier: string,
  ): Promise<CategoryViewResponseDto> {
    const category =
      await this.categoryRepository.findByIdentifier(categoryIdentifier);

    if (!category) {
      throw new NotFoundException(
        `Categoria com identificador ${categoryIdentifier} não encontrada`,
      );
    }

    const subCategories =
      await this.categoryRepository.findSubCategoriesByCategoryIdentifier(
        categoryIdentifier,
      );

    return {
      identifier: category.identifier,
      name: category.name,
      subCategories: subCategories.map((sub) => ({
        identifier: sub.identifier,
        name: sub.name,
        category_identifier: sub.category_identifier,
        created_at: sub.created_at,
        updated_at: sub.updated_at,
      })),
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  async findSubCategoryByIdentifier(identifier: string) {
    const subCategory =
      await this.categoryRepository.findSubCategoryByIdentifier(identifier);

    if (!subCategory) {
      throw new NotFoundException(
        `Subcategoria com identificador ${identifier} não encontrada`,
      );
    }

    return {
      identifier: subCategory.identifier,
      name: subCategory.name,
      category_identifier: subCategory.category_identifier,
      category: subCategory.category
        ? {
            identifier: subCategory.category.identifier,
            name: subCategory.category.name,
          }
        : null,
      created_at: subCategory.created_at,
      updated_at: subCategory.updated_at,
    };
  }

  async createSubCategory(
    dto: SubCategoryCreateDto,
  ): Promise<SubCategoryCreateResponseDto> {
    const category = await this.categoryRepository.findByIdentifier(
      dto.category_identifier,
    );

    if (!category) {
      throw new NotFoundException(
        `Categoria com identificador ${dto.category_identifier} não encontrada`,
      );
    }

    const subCategory = await this.categoryRepository.createSubCategory(
      dto.name,
      dto.category_identifier,
    );

    return {
      identifier: subCategory.identifier,
      name: subCategory.name,
      category_identifier: subCategory.category_identifier,
      created_at: subCategory.created_at,
      updated_at: subCategory.updated_at,
    };
  }

  async deleteSubCategory(
    identifier: string,
  ): Promise<SubCategoryDeleteResponseDto> {
    const subCategory =
      await this.categoryRepository.findSubCategoryByIdentifier(identifier);

    if (!subCategory) {
      throw new NotFoundException(
        `Subcategoria com identificador ${identifier} não encontrada`,
      );
    }

    const deleted =
      await this.categoryRepository.softDeleteSubCategory(identifier);

    if (!deleted) {
      throw new BadRequestException(
        `Falha ao deletar subcategoria com identificador ${identifier}`,
      );
    }

    return {
      identifier,
      message: 'Subcategoria deletada com sucesso',
      deleted_at: new Date(),
    };
  }
}
