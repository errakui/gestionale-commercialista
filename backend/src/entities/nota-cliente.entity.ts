import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('note_clienti')
export class NotaCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_id' })
  clienteId: number;

  @Column({ length: 255 })
  titolo: string;

  @Column({ type: 'text' })
  contenuto: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.note)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;
}

