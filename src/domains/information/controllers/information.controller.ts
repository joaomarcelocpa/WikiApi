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
import { WikiMainCategory, WikiSubCategory } from '../enums/categories.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtUser } from '../../auth/interfaces/jwt-user.interface';

@Controller('information')
@UseGuards(JwtAuthGuard)
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: InformationCreateDto,
    @CurrentUser() user: JwtUser,
  ): Promise<InformationCreateResponseDto> {
    return await this.informationService.create(dto, user.id, user.name);
  }

  @Put(':identifier')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('identifier') identifier: string,
    @Body() dto: InformationUpdateDto,
  ): Promise<InformationUpdateResponseDto> {
    return await this.informationService.update(identifier, dto);
  }

  @Delete(':identifier')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('identifier') identifier: string,
  ): Promise<InformationDeleteResponseDto> {
    return await this.informationService.delete(identifier);
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
    @Query('mainCategory') mainCategory?: WikiMainCategory,
    @Query('subCategory') subCategory?: WikiSubCategory,
  ): Promise<InformationViewResponseDto[]> {
    if (subCategory) {
      return await this.informationService.findBySubCategory(subCategory);
    }

    if (mainCategory) {
      return await this.informationService.findByMainCategory(mainCategory);
    }

    return await this.informationService.findAll();
  }
}
