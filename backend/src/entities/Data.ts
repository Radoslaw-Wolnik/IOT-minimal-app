// src/entities/Data.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Table } from './Table';

@Entity('data')
export class Data {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Table)
  table: Table;

  @Column('json')
  content: object;

  @CreateDateColumn()
  createdAt: Date;
}
