import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extname } from 'path';
import { createId } from '@paralleldrive/cuid2';
import { InformationRepository } from '../repositories/information.repository';
import { InformationCreateDto } from '../dtos/information.create.dto';
import { InformationUpdateDto } from '../dtos/information.update.dto';
import { InformationCreateResponseDto } from '../dtos/information.create.response.dto';
import { InformationUpdateResponseDto } from '../dtos/information.update.response.dto';
import { InformationViewResponseDto } from '../dtos/information.view.response.dto';
import { InformationDeleteResponseDto } from '../dtos/information.delete.response.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../category/entities/subcategory.entity';
import { Information } from '../entities/information.entity';
import { S3Service } from '../../../modules/s3/s3.service';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Injectable()
export class InformationService {
  constructor(
    private readonly informationRepository: InformationRepository,
    private readonly s3Service: S3Service,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(
    dto: InformationCreateDto,
    userId: string,
    userName: string,
    file?: Express.Multer.File,
  ): Promise<InformationCreateResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { identifier: dto.category_identifier, deleted: false },
    });

    if (!category) {
      throw new NotFoundException(
        `Categoria com identificador ${dto.category_identifier} não encontrada`,
      );
    }

    const subCategory = await this.subCategoryRepository.findOne({
      where: {
        identifier: dto.sub_category_identifier,
        deleted: false,
        category_identifier: dto.category_identifier,
      },
    });

    if (!subCategory) {
      throw new BadRequestException(
        `Subcategoria com identificador ${dto.sub_category_identifier} não encontrada ou não pertence à categoria selecionada`,
      );
    }

    const informationId = createId();
    let fileIdentifier: number | undefined = dto.file_identifier;

    if (file) {
      if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          `Tipo de arquivo não suportado. Use: jpeg, png, webp ou gif`,
        );
      }

      const ext = extname(file.originalname);
      const fileName = `${createId()}${ext}`;
      const key = `information/${informationId}/${fileName}`;

      const url = await this.s3Service.upload(file.buffer, key, file.mimetype);

      const savedFile = await this.fileRepository.save(
        this.fileRepository.create({
          originalName: file.originalname,
          fileName,
          path: url,
          mimetype: file.mimetype,
          size: file.size,
        }),
      );

      fileIdentifier = savedFile.id;
    } else if (dto.file_identifier) {
      await this.validateFileExists(dto.file_identifier);
    }

    const information = await this.informationRepository.create(
      {
        identifier: informationId,
        question: dto.question,
        content: dto.content,
        file_identifier: fileIdentifier,
        category_identifier: dto.category_identifier,
        sub_category_identifier: dto.sub_category_identifier,
        user_identifier: userId,
        user_name: userName,
      },
      category.name,
      subCategory.name,
    );

    return this.mapToResponse(information);
  }

  async update(
    identifier: string,
    dto: InformationUpdateDto,
    file?: Express.Multer.File,
  ): Promise<InformationUpdateResponseDto> {
    const information =
      await this.informationRepository.findByIdentifier(identifier);

    if (!information) {
      throw new NotFoundException(
        `Informação com identificador ${identifier} não encontrada`,
      );
    }

    let categoryName: string | undefined;
    let subCategoryName: string | undefined;

    if (dto.category_identifier) {
      const category = await this.categoryRepository.findOne({
        where: { identifier: dto.category_identifier, deleted: false },
      });

      if (!category) {
        throw new NotFoundException(
          `Categoria com identificador ${dto.category_identifier} não encontrada`,
        );
      }
      categoryName = category.name;
    }

    if (dto.sub_category_identifier) {
      const categoryId =
        dto.category_identifier || information.category_identifier;

      const subCategory = await this.subCategoryRepository.findOne({
        where: {
          identifier: dto.sub_category_identifier,
          deleted: false,
          category_identifier: categoryId,
        },
      });

      if (!subCategory) {
        throw new BadRequestException(
          `Subcategoria com identificador ${dto.sub_category_identifier} não encontrada ou não pertence à categoria selecionada`,
        );
      }
      subCategoryName = subCategory.name;
    }

    if (file) {
      if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          `Tipo de arquivo não suportado. Use: jpeg, png, webp ou gif`,
        );
      }

      const ext = extname(file.originalname);
      const fileName = `${createId()}${ext}`;
      const key = `information/${identifier}/${fileName}`;
      const url = await this.s3Service.upload(file.buffer, key, file.mimetype);

      const savedFile = await this.fileRepository.save(
        this.fileRepository.create({
          originalName: file.originalname,
          fileName,
          path: url,
          mimetype: file.mimetype,
          size: file.size,
        }),
      );

      dto.file_identifier = savedFile.id;
    } else if (dto.file_identifier !== undefined && dto.file_identifier !== null) {
      await this.validateFileExists(dto.file_identifier);
    }

    const updatedInformation = await this.informationRepository.update(
      identifier,
      dto,
      categoryName,
      subCategoryName,
    );

    if (!updatedInformation) {
      throw new NotFoundException(
        `Falha ao atualizar informação com identificador ${identifier}`,
      );
    }

    return this.mapToResponse(updatedInformation);
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

    return this.mapToResponse(information);
  }

  async findAll(): Promise<InformationViewResponseDto[]> {
    const informations = await this.informationRepository.findAll();
    return informations.map((info) => this.mapToResponse(info));
  }

  async search(query: string): Promise<InformationViewResponseDto[]> {
    if (!query.trim()) return [];
    const informations = await this.informationRepository.search(query.trim());
    return informations.map((info) => this.mapToResponse(info));
  }

  async findByCategory(
    categoryIdentifier: string,
  ): Promise<InformationViewResponseDto[]> {
    const informations =
      await this.informationRepository.findByCategoryIdentifier(
        categoryIdentifier,
      );
    return informations.map((info) => this.mapToResponse(info));
  }

  async findBySubCategory(
    subCategoryIdentifier: string,
  ): Promise<InformationViewResponseDto[]> {
    const informations =
      await this.informationRepository.findBySubCategoryIdentifier(
        subCategoryIdentifier,
      );
    return informations.map((info) => this.mapToResponse(info));
  }

  async findBySlug(slug: string): Promise<InformationViewResponseDto> {
    const information = await this.informationRepository.findBySlug(slug);

    if (!information) {
      throw new NotFoundException(`Informação com slug ${slug} não encontrada`);
    }

    return this.mapToResponse(information);
  }

  private async validateFileExists(fileId: number): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException(`Arquivo com ID ${fileId} não encontrado`);
    }
  }

  private mapToResponse(information: Information): InformationViewResponseDto {
    return {
      identifier: information.identifier,
      question: information.question,
      content: information.content,
      slug: information.slug,
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
      category_identifier: information.category_identifier,
      category: {
        identifier: information.category.identifier,
        name: information.category.name,
      },
      sub_category_identifier: information.sub_category_identifier,
      subCategory: {
        identifier: information.subCategory.identifier,
        name: information.subCategory.name,
        category_identifier: information.subCategory.category_identifier,
      },
      user_identifier: information.user_identifier,
      user_name: information.user_name,
      created_at: information.created_at,
      updated_at: information.updated_at,
    };
  }
}
