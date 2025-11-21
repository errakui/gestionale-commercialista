import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('impostazioni_generali')
export class ImpostazioniGenerali {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, default: 'Studio Commercialista' })
  nomeStudio: string;

  @Column({ type: 'varchar', length: 50, default: 'Europe/Rome' })
  timezone: string;

  @Column({ type: 'varchar', length: 20, default: 'DD/MM/YYYY' })
  formatoData: string;

  @Column({ type: 'varchar', length: 10, default: 'EUR' })
  valuta: string;

  @Column({ type: 'int', default: 7 })
  giorniScadenzeImminenti: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  emailNotifiche: string;

  @Column({ type: 'boolean', default: true })
  notificheEmail: boolean;

  @Column({ type: 'boolean', default: true })
  generaScadenzeAutomatiche: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

