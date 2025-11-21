import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('mandati')
export class Mandato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_id', nullable: true })
  clienteId: number;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  // Dati Cliente (salvati anche se cliente viene eliminato)
  @Column({ name: 'nome_cliente' })
  nomeCliente: string;

  @Column({ name: 'cf_piva_cliente' })
  cfPivaCliente: string;

  @Column({ name: 'indirizzo_cliente', nullable: true })
  indirizzoCliente: string;

  @Column({ name: 'email_cliente', nullable: true })
  emailCliente: string;

  @Column({ name: 'pec_cliente', nullable: true })
  pecCliente: string;

  // Dati Mandato
  @Column({ name: 'tipo_contabilita' })
  tipoContabilita: string;

  @Column()
  compenso: string;

  @Column({ name: 'modalita_pagamento', nullable: true })
  modalitaPagamento: string;

  @Column({ name: 'servizi_inclusi', type: 'text', nullable: true })
  serviziInclusi: string;

  @Column({ name: 'servizi_extra', type: 'text', nullable: true })
  serviziExtra: string;

  @Column({ name: 'data_inizio', type: 'date' })
  dataInizio: Date;

  @Column({ name: 'luogo_data' })
  luogoData: string;

  // Testo completo del mandato
  @Column({ type: 'text' })
  testoMandato: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

