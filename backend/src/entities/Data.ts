import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Table } from './Table';

@Entity('data')
export class Data {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Table, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'table_id' })
  table!: Table;

  @Column('json')
  content!: object;

  @CreateDateColumn()
  createdAt!: Date;
}