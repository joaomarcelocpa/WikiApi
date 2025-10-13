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
  // UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserCreateResponseDto } from '../dtos/user.create.response.dto';
import { UserUpdateResponseDto } from '../dtos/user.update.response.dto';
import { UserViewResponseDto } from '../dtos/user.view.response.dto';
import { UserDeleteResponseDto } from '../dtos/user.delete.response.dto';
import { UserType } from '../enums/user-type.enum';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtUser } from '../../auth/interfaces/jwt-user.interface';

@Controller('users')
// @UseGuards(JwtAuthGuard)
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

  @Get('me/profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@CurrentUser() user: JwtUser): JwtUser {
    return user;
  }
}
