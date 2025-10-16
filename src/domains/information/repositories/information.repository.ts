import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Information } from '../entities/information.entity';
import { createId } from '@paralleldrive/cuid2';
import { SlugUtil } from '../utils/slug.util';

@Injectable()
export class InformationRepository {
  constructor(
    @InjectRepository(Information)
    private readonly repository: Repository<Information>,
  ) {}

  async create(
    information: Partial<Information>,
    categoryName: string,
    subCategoryName: string,
  ): Promise<Information> {
    const baseSlug = SlugUtil.generateFull(
      categoryName,
      subCategoryName,
      information.question || '',
    );

    const existingSlugs = await this.findAllSlugs();
    const uniqueSlug = SlugUtil.generateUnique(baseSlug, existingSlugs);

    const entity = this.repository.create({
      identifier: createId(),
      slug: uniqueSlug,
      ...information,
    });

    const saved = await this.repository.save(entity);
    return await this.findByIdentifier(saved.identifier);
  }

  async findByIdentifier(identifier: string): Promise<Information | null> {
    return await this.repository.findOne({
      where: { identifier, deleted: false },
      relations: ['file', 'category', 'subCategory'],
    });
  }

  async findBySlug(slug: string): Promise<Information | null> {
    return await this.repository.findOne({
      where: { slug, deleted: false },
      relations: ['file', 'category', 'subCategory'],
    });
  }

  async findAllSlugs(): Promise<string[]> {
    const results = await this.repository.find({
      select: ['slug'],
      where: { deleted: false },
    });
    return results.map((r) => r.slug);
  }

  async findAll(): Promise<Information[]> {
    return await this.repository.find({
      where: { deleted: false },
      relations: ['file', 'category', 'subCategory'],
      order: { created_at: 'DESC' },
    });
  }

  async findByCategoryIdentifier(
    categoryIdentifier: string,
  ): Promise<Information[]> {
    return await this.repository.find({
      where: { category_identifier: categoryIdentifier, deleted: false },
      relations: ['file', 'category', 'subCategory'],
      order: { created_at: 'DESC' },
    });
  }

  async findBySubCategoryIdentifier(
    subCategoryIdentifier: string,
  ): Promise<Information[]> {
    return await this.repository.find({
      where: { sub_category_identifier: subCategoryIdentifier, deleted: false },
      relations: ['file', 'category', 'subCategory'],
      order: { created_at: 'DESC' },
    });
  }

  async update(
    identifier: string,
    data: Partial<Information>,
    categoryName?: string,
    subCategoryName?: string,
  ): Promise<Information | null> {
    const updateData: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (
      data.question ||
      data.category_identifier ||
      data.sub_category_identifier
    ) {
      const currentInfo = await this.findByIdentifier(identifier);

      if (currentInfo) {
        const finalCategoryName = categoryName || currentInfo.category.name;
        const finalSubCategoryName =
          subCategoryName || currentInfo.subCategory.name;
        const finalQuestion = data.question || currentInfo.question;

        const baseSlug = SlugUtil.generateFull(
          finalCategoryName,
          finalSubCategoryName,
          finalQuestion,
        );

        const existingSlugs = await this.findAllSlugs();
        const filteredSlugs = existingSlugs.filter(
          (s) => s !== currentInfo.slug,
        );
        updateData.slug = SlugUtil.generateUnique(baseSlug, filteredSlugs);
      }
    }

    await this.repository.update(
      { identifier, deleted: false },
      { ...updateData, updated_at: new Date() },
    );
    return await this.findByIdentifier(identifier);
  }

  async softDelete(identifier: string): Promise<boolean> {
    const result = await this.repository.update(
      { identifier, deleted: false },
      { deleted: true, updated_at: new Date() },
    );
    return (result.affected ?? 0) > 0;
  }
}
