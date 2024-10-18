import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('app_settings')
export class AppSettings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean', default: true })
  isFirstRun!: boolean;

  @Column({ type: 'varchar', nullable: true })
  adminUsername!: string;
}