import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { SubCategory } from '../entities/subcategory.entity';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(
    category: Partial<Category>,
    subCategoryNames?: string[],
  ): Promise<Category> {
    const identifier = createId();
    const entity = this.categoryRepository.create({
      identifier,
      ...category,
    });

    await this.categoryRepository.save(entity);

    if (subCategoryNames && subCategoryNames.length > 0) {
      const subCategories = subCategoryNames.map((name) =>
        this.subCategoryRepository.create({
          identifier: createId(),
          name,
          category_identifier: identifier,
        }),
      );
      await this.subCategoryRepository.save(subCategories);
    }

    return await this.findByIdentifier(identifier);
  }

  async findByIdentifier(identifier: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      where: { identifier, deleted: false },
      relations: ['subCategories'],
    });

    if (category && category.subCategories) {
      category.subCategories = category.subCategories.filter(
        (sub) => !sub.deleted,
      );
    }

    return category;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { deleted: false },
      relations: ['subCategories'],
      order: { created_at: 'DESC' },
    });

    categories.forEach((category) => {
      if (category.subCategories) {
        category.subCategories = category.subCategories.filter(
          (sub) => !sub.deleted,
        );
      }
    });

    return categories;
  }

  async findSubCategoriesByCategoryIdentifier(
    categoryIdentifier: string,
  ): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      where: { category_identifier: categoryIdentifier, deleted: false },
      order: { created_at: 'DESC' },
    });
  }

  async findSubCategoryByIdentifier(
    identifier: string,
  ): Promise<SubCategory | null> {
    return await this.subCategoryRepository.findOne({
      where: { identifier, deleted: false },
      relations: ['category'],
    });
  }

  async update(
    identifier: string,
    data: Partial<Category>,
  ): Promise<Category | null> {
    const updateData: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    await this.categoryRepository.update(
      { identifier, deleted: false },
      { ...updateData, updated_at: new Date() },
    );
    return await this.findByIdentifier(identifier);
  }

  async softDelete(identifier: string): Promise<boolean> {
    const result = await this.categoryRepository.update(
      { identifier, deleted: false },
      { deleted: true, updated_at: new Date() },
    );

    if ((result.affected ?? 0) > 0) {
      await this.subCategoryRepository.update(
        { category_identifier: identifier, deleted: false },
        { deleted: true, updated_at: new Date() },
      );
      return true;
    }

    return false;
  }

  async createSubCategory(
    name: string,
    categoryIdentifier: string,
  ): Promise<SubCategory> {
    const subCategory = this.subCategoryRepository.create({
      identifier: createId(),
      name,
      category_identifier: categoryIdentifier,
    });
    return await this.subCategoryRepository.save(subCategory);
  }

  async softDeleteSubCategory(identifier: string): Promise<boolean> {
    const result = await this.subCategoryRepository.update(
      { identifier, deleted: false },
      { deleted: true, updated_at: new Date() },
    );
    return (result.affected ?? 0) > 0;
  }
}
