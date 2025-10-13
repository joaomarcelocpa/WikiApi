import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserCreateResponseDto } from '../dtos/user.create.response.dto';
import { UserUpdateResponseDto } from '../dtos/user.update.response.dto';
import { UserViewResponseDto } from '../dtos/user.view.response.dto';
import { UserDeleteResponseDto } from '../dtos/user.delete.response.dto';
import { UserType } from '../enums/user-type.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: UserCreateDto): Promise<UserCreateResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        `Email ${dto.email} já está cadastrado no sistema`,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      type: dto.type,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async update(id: string, dto: UserUpdateDto): Promise<UserUpdateResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException(
          `Email ${dto.email} já está cadastrado no sistema`,
        );
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      type?: UserType;
    } = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.type !== undefined) updateData.type = dto.type;

    if (dto.password !== undefined) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    if (!updatedUser) {
      throw new NotFoundException(`Falha ao atualizar usuário com ID ${id}`);
    }

    const response: UserUpdateResponseDto = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      type: updatedUser.type,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    };

    return response;
  }

  async delete(id: string): Promise<UserDeleteResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const deleted = await this.userRepository.softDelete(id);

    if (!deleted) {
      throw new BadRequestException(`Falha ao deletar usuário com ID ${id}`);
    }

    const response: UserDeleteResponseDto = {
      id,
      message: 'Usuário deletado com sucesso',
      deleted_at: new Date(),
    };

    return response;
  }

  async findOne(id: string): Promise<UserViewResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const response: UserViewResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return response;
  }

  async findAll(): Promise<UserViewResponseDto[]> {
    const users = await this.userRepository.findAll();

    return users.map((user): UserViewResponseDto => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });
  }

  async findByType(type: UserType): Promise<UserViewResponseDto[]> {
    const users = await this.userRepository.findByType(type);

    return users.map((user): UserViewResponseDto => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });
  }
}
