import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Information } from '../entities/information.entity';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class InformationRepository {
  constructor(
    @InjectRepository(Information)
    private readonly repository: Repository<Information>,
  ) {}

  async create(information: Partial<Information>): Promise<Information> {
    const entity = this.repository.create({
      identifier: createId(),
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
  ): Promise<Information | null> {
    const updateData: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
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
