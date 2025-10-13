import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InformationRepository } from '../repositories/information.repository';
import { InformationCreateDto } from '../dtos/information.create.dto';
import { InformationUpdateDto } from '../dtos/information.update.dto';
import { InformationCreateResponseDto } from '../dtos/information.create.response.dto';
import { InformationUpdateResponseDto } from '../dtos/information.update.response.dto';
import { InformationViewResponseDto } from '../dtos/information.view.response.dto';
import { InformationDeleteResponseDto } from '../dtos/information.delete.response.dto';
import {
  CATEGORY_HIERARCHY,
  WikiMainCategory,
  WikiSubCategory,
} from '../enums/categories.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';

@Injectable()
export class InformationService {
  constructor(
    private readonly informationRepository: InformationRepository,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(
    dto: InformationCreateDto,
    userId: string,
    userName: string,
  ): Promise<InformationCreateResponseDto> {
    this.validateCategoryHierarchy(dto.main_category, dto.sub_category);

    if (dto.file_identifier) {
      await this.validateFileExists(dto.file_identifier);
    }

    const information = await this.informationRepository.create({
      question: dto.question,
      content: dto.content,
      file_identifier: dto.file_identifier,
      main_category: dto.main_category,
      sub_category: dto.sub_category,
      user_identifier: userId,
      user_name: userName,
    });

    return {
      identifier: information.identifier,
      question: information.question,
      content: information.content,
      file: information.file
        ? {
            id: information.file.id,
            originalName: information.file.originalName,
            fileName: information.file.fileName,
            path: information.file.path,
            mimetype: information.file.mimetype,
            size: information.file.size,
            uploaded_at: information.file.uploaded_at,
          }
        : undefined,
      file_identifier: information.file_identifier,
      main_category: information.main_category,
      sub_category: information.sub_category,
      user_identifier: information.user_identifier,
      user_name: information.user_name,
      created_at: information.created_at,
      updated_at: information.updated_at,
    };
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

    if (dto.main_category && dto.sub_category) {
      this.validateCategoryHierarchy(dto.main_category, dto.sub_category);
    }

    if (dto.main_category && !dto.sub_category) {
      this.validateCategoryHierarchy(
        dto.main_category,
        information.sub_category,
      );
    }

    if (!dto.main_category && dto.sub_category) {
      this.validateCategoryHierarchy(
        information.main_category,
        dto.sub_category,
      );
    }

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

    return {
      identifier: updatedInformation.identifier,
      question: updatedInformation.question,
      content: updatedInformation.content,
      file: updatedInformation.file
        ? {
            id: updatedInformation.file.id,
            originalName: updatedInformation.file.originalName,
            fileName: updatedInformation.file.fileName,
            path: updatedInformation.file.path,
            mimetype: updatedInformation.file.mimetype,
            size: updatedInformation.file.size,
            uploaded_at: updatedInformation.file.uploaded_at,
          }
        : undefined,
      file_identifier: updatedInformation.file_identifier,
      main_category: updatedInformation.main_category,
      sub_category: updatedInformation.sub_category,
      user_identifier: updatedInformation.user_identifier,
      user_name: updatedInformation.user_name,
      created_at: updatedInformation.created_at,
      updated_at: updatedInformation.updated_at,
    };
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

    return {
      identifier: information.identifier,
      question: information.question,
      content: information.content,
      file: information.file
        ? {
            id: information.file.id,
            originalName: information.file.originalName,
            fileName: information.file.fileName,
            path: information.file.path,
            mimetype: information.file.mimetype,
            size: information.file.size,
            uploaded_at: information.file.uploaded_at,
          }
        : undefined,
      file_identifier: information.file_identifier,
      main_category: information.main_category,
      sub_category: information.sub_category,
      user_identifier: information.user_identifier,
      user_name: information.user_name,
      created_at: information.created_at,
      updated_at: information.updated_at,
    };
  }

  async findAll(): Promise<InformationViewResponseDto[]> {
    const informations = await this.informationRepository.findAll();

    return informations.map((information): InformationViewResponseDto => {
      return {
        identifier: information.identifier,
        question: information.question,
        content: information.content,
        file: information.file
          ? {
              id: information.file.id,
              originalName: information.file.originalName,
              fileName: information.file.fileName,
              path: information.file.path,
              mimetype: information.file.mimetype,
              size: information.file.size,
              uploaded_at: information.file.uploaded_at,
            }
          : undefined,
        file_identifier: information.file_identifier,
        main_category: information.main_category,
        sub_category: information.sub_category,
        user_identifier: information.user_identifier,
        user_name: information.user_name,
        created_at: information.created_at,
        updated_at: information.updated_at,
      };
    });
  }

  async findByMainCategory(
    mainCategory: WikiMainCategory,
  ): Promise<InformationViewResponseDto[]> {
    const informations =
      await this.informationRepository.findByMainCategory(mainCategory);

    return informations.map((information): InformationViewResponseDto => {
      return {
        identifier: information.identifier,
        question: information.question,
        content: information.content,
        file: information.file
          ? {
              id: information.file.id,
              originalName: information.file.originalName,
              fileName: information.file.fileName,
              path: information.file.path,
              mimetype: information.file.mimetype,
              size: information.file.size,
              uploaded_at: information.file.uploaded_at,
            }
          : undefined,
        file_identifier: information.file_identifier,
        main_category: information.main_category,
        sub_category: information.sub_category,
        user_identifier: information.user_identifier,
        user_name: information.user_name,
        created_at: information.created_at,
        updated_at: information.updated_at,
      };
    });
  }

  async findBySubCategory(
    subCategory: WikiSubCategory,
  ): Promise<InformationViewResponseDto[]> {
    const informations =
      await this.informationRepository.findBySubCategory(subCategory);

    return informations.map((information): InformationViewResponseDto => {
      return {
        identifier: information.identifier,
        question: information.question,
        content: information.content,
        file: information.file
          ? {
              id: information.file.id,
              originalName: information.file.originalName,
              fileName: information.file.fileName,
              path: information.file.path,
              mimetype: information.file.mimetype,
              size: information.file.size,
              uploaded_at: information.file.uploaded_at,
            }
          : undefined,
        file_identifier: information.file_identifier,
        main_category: information.main_category,
        sub_category: information.sub_category,
        user_identifier: information.user_identifier,
        user_name: information.user_name,
        created_at: information.created_at,
        updated_at: information.updated_at,
      };
    });
  }

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
