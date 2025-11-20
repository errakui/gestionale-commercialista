import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

export enum TipoMovimento {
  ENTRATA = 'ENTRATA',
  USCITA = 'USCITA',
}

@Entity('movimenti_cassa')
export class MovimentoCassa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_id', nullable: true })
  clienteId: number;

  @Column({ name: 'data_movimento', type: 'date' })
  dataMovimento: Date;

  @Column({
    type: 'enum',
    enum: TipoMovimento,
  })
  tipo: TipoMovimento;

  @Column({ length: 100, nullable: true })
  categoria: string;

  @Column({ type: 'text' })
  descrizione: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  importo: number;

  // ===== CAMPI FISCALI =====

  @Column({ name: 'imponibile', type: 'decimal', precision: 10, scale: 2, nullable: true })
  imponibile: number;

  @Column({ name: 'importo_iva', type: 'decimal', precision: 10, scale: 2, nullable: true })
  importoIva: number;

  @Column({ name: 'aliquota_iva', type: 'decimal', precision: 5, scale: 2, nullable: true })
  aliquotaIva: number;

  @Column({ name: 'importo_ritenuta', type: 'decimal', precision: 10, scale: 2, nullable: true })
  importoRitenuta: number;

  @Column({ name: 'aliquota_ritenuta', type: 'decimal', precision: 5, scale: 2, nullable: true })
  aliquotaRitenuta: number;

  @Column({ name: 'non_imponibile', type: 'decimal', precision: 10, scale: 2, nullable: true })
  nonImponibile: number;

  @Column({ name: 'spesa_interna', default: false })
  spesaInterna: boolean;

  // ===== FINE CAMPI FISCALI =====

  @Column({ name: 'metodo_pagamento', length: 50, nullable: true })
  metodoPagamento: string;

  @Column({ name: 'scadenza_id', nullable: true })
  scadenzaId: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.movimenti, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;
}

