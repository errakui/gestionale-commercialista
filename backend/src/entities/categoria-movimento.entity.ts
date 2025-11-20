import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('categorie_movimento')
export class CategoriaMovimento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descrizione: string;

  @Column({ default: true })
  attiva: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

