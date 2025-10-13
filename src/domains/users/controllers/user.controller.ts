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
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserCreateResponseDto } from '../dtos/user.create.response.dto';
import { UserUpdateResponseDto } from '../dtos/user.update.response.dto';
import { UserViewResponseDto } from '../dtos/user.view.response.dto';
import { UserDeleteResponseDto } from '../dtos/user.delete.response.dto';
import { UserType } from '../enums/user-type.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: UserCreateDto): Promise<UserCreateResponseDto> {
    return await this.userService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UserUpdateDto,
  ): Promise<UserUpdateResponseDto> {
    return await this.userService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<UserDeleteResponseDto> {
    return await this.userService.delete(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UserViewResponseDto> {
    return await this.userService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('type') type?: UserType,
  ): Promise<UserViewResponseDto[]> {
    if (type) {
      return await this.userService.findByType(type);
    }

    return await this.userService.findAll();
  }
}
