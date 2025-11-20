import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('servizi_predefiniti')
export class ServizioPredefinito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descrizione: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  importo: number;

  @Column({ length: 100, nullable: true })
  categoria: string;

  @Column({ default: true })
  attivo: boolean;

  // Campi fiscali di default per il servizio
  @Column({ name: 'applica_iva', default: true })
  applicaIva: boolean;

  @Column({ name: 'aliquota_iva', type: 'decimal', precision: 5, scale: 2, default: 22.00 })
  aliquotaIva: number;

  @Column({ name: 'applica_ritenuta', default: false })
  applicaRitenuta: boolean;

  @Column({ name: 'aliquota_ritenuta', type: 'decimal', precision: 5, scale: 2, default: 20.00 })
  aliquotaRitenuta: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

