import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserType } from '../enums/user-type.enum';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const entity = this.repository.create({
      id: createId(),
      ...user,
    });
    return await this.repository.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id, deleted: false },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email, deleted: false },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      where: { deleted: false },
      order: { created_at: 'DESC' },
    });
  }

  async findByType(type: UserType): Promise<User[]> {
    return await this.repository.find({
      where: { type, deleted: false },
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const updateData: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    await this.repository.update(
      { id, deleted: false },
      { ...updateData, updated_at: new Date() },
    );

    return await this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(
      { id, deleted: false },
      { deleted: true, updated_at: new Date() },
    );
    return (result.affected ?? 0) > 0;
  }
}
