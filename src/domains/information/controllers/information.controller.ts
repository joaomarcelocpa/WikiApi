import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InformationService } from '../services/information.service';
import { InformationCreateDto } from '../dtos/information.create.dto';
import { InformationUpdateDto } from '../dtos/information.update.dto';
import { InformationCreateResponseDto } from '../dtos/information.create.response.dto';
import { InformationUpdateResponseDto } from '../dtos/information.update.response.dto';
import { InformationViewResponseDto } from '../dtos/information.view.response.dto';
import { InformationDeleteResponseDto } from '../dtos/information.delete.response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtUser } from '../../auth/interfaces/jwt-user.interface';

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: InformationCreateDto,
    @CurrentUser() user: JwtUser,
  ): Promise<InformationCreateResponseDto> {
    return await this.informationService.create(dto, user.id, user.name);
  }

  @Put(':identifier')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('identifier') identifier: string,
    @Body() dto: InformationUpdateDto,
  ): Promise<InformationUpdateResponseDto> {
    return await this.informationService.update(identifier, dto);
  }

  @Delete(':identifier')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('identifier') identifier: string,
  ): Promise<InformationDeleteResponseDto> {
    return await this.informationService.delete(identifier);
  }

  @Get('slug/*')
  @HttpCode(HttpStatus.OK)
  async findBySlug(
    @Param('0') slug: string,
  ): Promise<InformationViewResponseDto> {
    return await this.informationService.findBySlug(slug);
  }

  @Get(':identifier')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('identifier') identifier: string,
  ): Promise<InformationViewResponseDto> {
    return await this.informationService.findOne(identifier);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('categoryIdentifier') categoryIdentifier?: string,
    @Query('subCategoryIdentifier') subCategoryIdentifier?: string,
  ): Promise<InformationViewResponseDto[]> {
    if (subCategoryIdentifier) {
      return await this.informationService.findBySubCategory(
        subCategoryIdentifier,
      );
    }
    if (categoryIdentifier) {
      return await this.informationService.findByCategory(categoryIdentifier);
    }
    return await this.informationService.findAll();
  }
}
