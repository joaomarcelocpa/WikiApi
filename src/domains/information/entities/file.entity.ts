import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 500 })
  path: string;

  @Column({ type: 'varchar', length: 100 })
  mimetype: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date;
}
