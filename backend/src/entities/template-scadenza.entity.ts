import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoRicorrenza {
  MENSILE = 'MENSILE',
  TRIMESTRALE = 'TRIMESTRALE',
  ANNUALE = 'ANNUALE',
  CUSTOM = 'CUSTOM',
}

@Entity('template_scadenze')
export class TemplateScadenza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codice_template', length: 100, unique: true })
  codiceTemplate: string;

  @Column({ length: 255 })
  descrizione: string;

  @Column({
    type: 'enum',
    enum: TipoRicorrenza,
    name: 'tipo_ricorrenza',
  })
  tipoRicorrenza: TipoRicorrenza;

  @Column({ name: 'giorno_scadenza', nullable: true })
  giornoScadenza: number;

  @Column({ name: 'mesi_applicabili', type: 'simple-json', nullable: true })
  mesiApplicabili: number[];

  @Column({ name: 'offset_mesi', default: 0 })
  offsetMesi: number;

  @Column({ name: 'offset_anni', default: 0 })
  offsetAnni: number;

  @Column({ name: 'applicabile_iva_mensile', default: false })
  applicabileIvaMensile: boolean;

  @Column({ name: 'applicabile_iva_trimestrale', default: false })
  applicabileIvaTrimestrale: boolean;

  @Column({ name: 'applicabile_immobili', default: false })
  applicabileImmobili: boolean;

  @Column({ name: 'applicabile_tutti', default: false })
  applicabileTutti: boolean;

  @Column({ default: true })
  attivo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

