import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InformationRepository } from '../repositories/information.repository';
import { InformationCreateDto } from '../dtos/information.create.dto';
import { InformationUpdateDto } from '../dtos/information.update.dto';
import { InformationCreateResponseDto } from '../dtos/information.create.response.dto';
import { InformationUpdateResponseDto } from '../dtos/information.update.response.dto';
import { InformationViewResponseDto } from '../dtos/information.view.response.dto';
import { InformationDeleteResponseDto } from '../dtos/information.delete.response.dto';
import {
  WikiMainCategory,
  WikiSubCategory,
  CATEGORY_HIERARCHY,
} from '../enums/categories.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class InformationService {
  constructor(
    private readonly informationRepository: InformationRepository,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(
    dto: InformationCreateDto,
  ): Promise<InformationCreateResponseDto> {
    // Valida se a subcategoria pertence à categoria principal
    this.validateCategoryHierarchy(dto.main_category, dto.sub_category);

    // Valida se o arquivo existe, se informado
    if (dto.file_identifier) {
      await this.validateFileExists(dto.file_identifier);
    }

    const identifier = createId();

    const information = await this.informationRepository.create({
      identifier,
      question: dto.question,
      content: dto.content,
      file_identifier: dto.file_identifier,
      main_category: dto.main_category,
      sub_category: dto.sub_category,
    });

    return information;
  }

  async update(
    identifier: string,
    dto: InformationUpdateDto,
  ): Promise<InformationUpdateResponseDto> {
    const information =
      await this.informationRepository.findByIdentifier(identifier);

    if (!information) {
      throw new NotFoundException(
        `Informação com identificador ${identifier} não encontrada`,
      );
    }

    // Valida hierarquia de categorias se ambas forem informadas
    if (dto.main_category && dto.sub_category) {
      this.validateCategoryHierarchy(dto.main_category, dto.sub_category);
    }

    // Se apenas a main_category for atualizada, valida se a sub_category atual é compatível
    if (dto.main_category && !dto.sub_category) {
      this.validateCategoryHierarchy(
        dto.main_category,
        information.sub_category,
      );
    }

    // Se apenas a sub_category for atualizada, valida se é compatível com a main_category atual
    if (!dto.main_category && dto.sub_category) {
      this.validateCategoryHierarchy(
        information.main_category,
        dto.sub_category,
      );
    }

    // Valida arquivo se informado e não for undefined
    if (dto.file_identifier !== undefined && dto.file_identifier !== null) {
      await this.validateFileExists(dto.file_identifier);
    }

    const updatedInformation = await this.informationRepository.update(
      identifier,
      dto,
    );

    if (!updatedInformation) {
      throw new NotFoundException(
        `Falha ao atualizar informação com identificador ${identifier}`,
      );
    }

    return updatedInformation;
  }

  async delete(identifier: string): Promise<InformationDeleteResponseDto> {
    const information =
      await this.informationRepository.findByIdentifier(identifier);

    if (!information) {
      throw new NotFoundException(
        `Informação com identificador ${identifier} não encontrada`,
      );
    }

    const deleted = await this.informationRepository.softDelete(identifier);

    if (!deleted) {
      throw new BadRequestException(
        `Falha ao deletar informação com identificador ${identifier}`,
      );
    }

    return {
      identifier,
      message: 'Informação deletada com sucesso',
      deleted_at: new Date(),
    };
  }

  async findOne(identifier: string): Promise<InformationViewResponseDto> {
    const information =
      await this.informationRepository.findByIdentifier(identifier);

    if (!information) {
      throw new NotFoundException(
        `Informação com identificador ${identifier} não encontrada`,
      );
    }

    return information;
  }

  async findAll(): Promise<InformationViewResponseDto[]> {
    return await this.informationRepository.findAll();
  }

  async findByMainCategory(
    mainCategory: WikiMainCategory,
  ): Promise<InformationViewResponseDto[]> {
    return await this.informationRepository.findByMainCategory(mainCategory);
  }

  async findBySubCategory(
    subCategory: WikiSubCategory,
  ): Promise<InformationViewResponseDto[]> {
    return await this.informationRepository.findBySubCategory(subCategory);
  }

  // Métodos auxiliares privados
  private validateCategoryHierarchy(
    mainCategory: WikiMainCategory,
    subCategory: WikiSubCategory,
  ): void {
    const validSubCategories = CATEGORY_HIERARCHY[mainCategory];

    if (!validSubCategories || !validSubCategories.includes(subCategory)) {
      throw new BadRequestException(
        `A subcategoria ${subCategory} não pertence à categoria principal ${mainCategory}`,
      );
    }
  }

  private async validateFileExists(fileId: number): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException(`Arquivo com ID ${fileId} não encontrado`);
    }
  }
}
