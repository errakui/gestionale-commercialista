import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

export enum StatoScadenza {
  DA_FARE = 'DA_FARE',
  IN_CORSO = 'IN_CORSO',
  FATTO = 'FATTO',
}

@Entity('scadenze')
export class Scadenza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_id', nullable: true })
  clienteId: number;

  @Column({ name: 'data_scadenza', type: 'date' })
  dataScadenza: Date;

  @Column({ name: 'tipo_scadenza', length: 255 })
  tipoScadenza: string;

  @Column({
    type: 'enum',
    enum: StatoScadenza,
    default: StatoScadenza.DA_FARE,
  })
  stato: StatoScadenza;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'movimento_cassa_id', nullable: true })
  movimentoCassaId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.scadenze, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;
}

