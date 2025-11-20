import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, PeriodicitaIva } from '../entities/cliente.entity';
import { Scadenza, StatoScadenza } from '../entities/scadenza.entity';
import { TemplateScadenza, TipoRicorrenza } from '../entities/template-scadenza.entity';

@Injectable()
export class ScadenzeGeneratorService {
  constructor(
    @InjectRepository(Scadenza)
    private scadenzaRepository: Repository<Scadenza>,
    @InjectRepository(TemplateScadenza)
    private templateRepository: Repository<TemplateScadenza>,
  ) {}

  async generateScadenzeForCliente(cliente: Cliente) {
    const templates = await this.getApplicableTemplates(cliente);
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    for (const template of templates) {
      // Genera scadenze per l'anno corrente e successivo
      await this.generateScadenzeFromTemplate(cliente, template, currentYear);
      await this.generateScadenzeFromTemplate(cliente, template, nextYear);
    }
  }

  async regenerateScadenzeForCliente(cliente: Cliente) {
    // Elimina solo le scadenze future non completate
    await this.scadenzaRepository
      .createQueryBuilder()
      .delete()
      .where('cliente_id = :clienteId', { clienteId: cliente.id })
      .andWhere('stato != :stato', { stato: StatoScadenza.FATTO })
      .andWhere('data_scadenza >= CURRENT_DATE')
      .execute();

    // Rigenera
    await this.generateScadenzeForCliente(cliente);
  }

  private async getApplicableTemplates(cliente: Cliente): Promise<TemplateScadenza[]> {
    const query = this.templateRepository
      .createQueryBuilder('template')
      .where('template.attivo = :attivo', { attivo: true });

    // Logica di applicabilità
    query.andWhere(
      '(template.applicabileTutti = true ' +
      'OR (template.applicabileIvaMensile = true AND :periodicitaIva = :mensile) ' +
      'OR (template.applicabileIvaTrimestrale = true AND :periodicitaIva = :trimestrale) ' +
      'OR (template.applicabileImmobili = true AND :haImmobili = true))',
      {
        mensile: PeriodicitaIva.MENSILE,
        periodicitaIva: cliente.periodicitaIva,
        trimestrale: PeriodicitaIva.TRIMESTRALE,
        haImmobili: cliente.haImmobili,
      }
    );

    return await query.getMany();
  }

  private async generateScadenzeFromTemplate(
    cliente: Cliente,
    template: TemplateScadenza,
    year: number
  ) {
    const mesi = template.mesiApplicabili || [];

    for (const mese of mesi) {
      const dataScadenza = new Date(
        year + template.offsetAnni,
        mese - 1 + template.offsetMesi,
        template.giornoScadenza || 1
      );

      // Non creare scadenze nel passato
      if (dataScadenza < new Date()) {
        continue;
      }

      // Verifica se esiste già
      const exists = await this.scadenzaRepository.findOne({
        where: {
          clienteId: cliente.id,
          dataScadenza: dataScadenza,
          tipoScadenza: template.descrizione,
        },
      });

      if (!exists) {
        const scadenza = this.scadenzaRepository.create({
          clienteId: cliente.id,
          dataScadenza: dataScadenza,
          tipoScadenza: template.descrizione,
          stato: StatoScadenza.DA_FARE,
        });

        await this.scadenzaRepository.save(scadenza);
      }
    }
  }
}

