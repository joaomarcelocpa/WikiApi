import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { File } from './file.entity';
import { WikiMainCategory, WikiSubCategory } from '../enums/categories.enum';

@Entity('information')
export class Information {
  @PrimaryColumn({ type: 'varchar' })
  identifier: string;

  @Column({ type: 'varchar' })
  question: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => File, { nullable: true, eager: true })
  @JoinColumn({ name: 'file_identifier' })
  file: File;

  @Column({ nullable: true })
  file_identifier: number;

  @Column({ type: 'varchar' })
  main_category: WikiMainCategory;

  @Column({ type: 'varchar' })
  sub_category: WikiSubCategory;

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
