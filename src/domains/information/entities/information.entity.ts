import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { File } from './file.entity';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../category/entities/subcategory.entity';

@Entity('information')
export class Information {
  @PrimaryColumn({ type: 'varchar' })
  identifier: string;

  @Column({ type: 'varchar' })
  question: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @ManyToOne(() => File, { nullable: true, eager: true })
  @JoinColumn({ name: 'file_identifier' })
  file: File;

  @Column({ nullable: true })
  file_identifier: number;

  @Column({ type: 'varchar' })
  category_identifier: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_identifier' })
  category: Category;

  @Column({ type: 'varchar' })
  sub_category_identifier: string;

  @ManyToOne(() => SubCategory, { eager: true })
  @JoinColumn({ name: 'sub_category_identifier' })
  subCategory: SubCategory;

  @Column({ type: 'varchar' })
  user_identifier: string;

  @Column({ type: 'varchar' })
  user_name: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}
