import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Scadenza } from './scadenza.entity';
import { MovimentoCassa } from './movimento-cassa.entity';
import { NotaCliente } from './nota-cliente.entity';

export enum TipoCliente {
  DITTA_INDIVIDUALE = 'DITTA_INDIVIDUALE',
  SRL = 'SRL',
  SNC = 'SNC',
  LIBERO_PROF = 'LIBERO_PROF',
  PRIVATO = 'PRIVATO',
}

export enum PeriodicitaIva {
  MENSILE = 'MENSILE',
  TRIMESTRALE = 'TRIMESTRALE',
  NESSUNA = 'NESSUNA',
}

@Entity('clienti')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TipoCliente,
    name: 'tipo_cliente',
  })
  tipoCliente: TipoCliente;

  @Column({ name: 'ragione_sociale', length: 255, nullable: true })
  ragioneSociale: string;

  @Column({ length: 100, nullable: true })
  nome: string;

  @Column({ length: 100, nullable: true })
  cognome: string;

  @Column({ name: 'codice_fiscale', length: 16, nullable: true })
  codiceFiscale: string;

  @Column({ name: 'partita_iva', length: 11, nullable: true })
  partitaIva: string;

  @Column({ length: 255, nullable: true })
  indirizzo: string;

  @Column({ length: 10, nullable: true })
  cap: string;

  @Column({ length: 100, nullable: true })
  citta: string;

  @Column({ length: 2, nullable: true })
  provincia: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  pec: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  @Column({ name: 'regime_fiscale', length: 100, nullable: true })
  regimeFiscale: string;

  @Column({
    type: 'enum',
    enum: PeriodicitaIva,
    name: 'periodicita_iva',
    default: PeriodicitaIva.NESSUNA,
  })
  periodicitaIva: PeriodicitaIva;

  @Column({ name: 'ha_immobili', default: false })
  haImmobili: boolean;

  // ===== NUOVI CAMPI FISCALI =====
  
  @Column({ name: 'esente_iva', default: false })
  esenteIva: boolean;

  @Column({ name: 'soggetto_iva', default: true })
  soggettoIva: boolean;

  @Column({ name: 'aliquota_iva', type: 'decimal', precision: 5, scale: 2, default: 22.00 })
  aliquotaIva: number;

  @Column({ name: 'esente_ritenuta', default: false })
  esenteRitenuta: boolean;

  @Column({ name: 'soggetto_ritenuta', default: false })
  soggettoRitenuta: boolean;

  @Column({ name: 'aliquota_ritenuta', type: 'decimal', precision: 5, scale: 2, default: 20.00 })
  aliquotaRitenuta: number;

  // ===== FINE CAMPI FISCALI =====

  @Column({ default: true })
  attivo: boolean;

  @Column({ type: 'text', name: 'note_interne', nullable: true })
  noteInterne: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Scadenza, (scadenza) => scadenza.cliente)
  scadenze: Scadenza[];

  @OneToMany(() => MovimentoCassa, (movimento) => movimento.cliente)
  movimenti: MovimentoCassa[];

  @OneToMany(() => NotaCliente, (nota) => nota.cliente)
  note: NotaCliente[];
}

