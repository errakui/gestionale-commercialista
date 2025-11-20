import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { MovimentoCassa } from '../entities/movimento-cassa.entity';
import { Scadenza } from '../entities/scadenza.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(MovimentoCassa)
    private movimentoRepository: Repository<MovimentoCassa>,
    @InjectRepository(Scadenza)
    private scadenzaRepository: Repository<Scadenza>,
  ) {}

  async exportClienti(format: 'csv' | 'excel' = 'csv') {
    const clienti = await this.clienteRepository.find({
      order: { ragioneSociale: 'ASC' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clienti');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tipo Cliente', key: 'tipoCliente', width: 20 },
      { header: 'Ragione Sociale', key: 'ragioneSociale', width: 40 },
      { header: 'Nome', key: 'nome', width: 20 },
      { header: 'Cognome', key: 'cognome', width: 20 },
      { header: 'Codice Fiscale', key: 'codiceFiscale', width: 16 },
      { header: 'Partita IVA', key: 'partitaIva', width: 11 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'PEC', key: 'pec', width: 30 },
      { header: 'Telefono', key: 'telefono', width: 15 },
      { header: 'Indirizzo', key: 'indirizzo', width: 40 },
      { header: 'CAP', key: 'cap', width: 10 },
      { header: 'Città', key: 'citta', width: 20 },
      { header: 'Provincia', key: 'provincia', width: 5 },
      { header: 'Regime Fiscale', key: 'regimeFiscale', width: 20 },
      { header: 'Periodicità IVA', key: 'periodicitaIva', width: 15 },
      { header: 'Ha Immobili', key: 'haImmobili', width: 12 },
      { header: 'Esente IVA', key: 'esenteIva', width: 12 },
      { header: 'Soggetto IVA', key: 'soggettoIva', width: 12 },
      { header: 'Aliq. IVA (%)', key: 'aliquotaIva', width: 12 },
      { header: 'Esente Ritenuta', key: 'esenteRitenuta', width: 15 },
      { header: 'Sogg. Ritenuta', key: 'soggettoRitenuta', width: 15 },
      { header: 'Aliq. Ritenuta (%)', key: 'aliquotaRitenuta', width: 15 },
      { header: 'Attivo', key: 'attivo', width: 10 },
    ];

    clienti.forEach(cliente => {
      worksheet.addRow({
        id: cliente.id,
        tipoCliente: cliente.tipoCliente,
        ragioneSociale: cliente.ragioneSociale,
        nome: cliente.nome,
        cognome: cliente.cognome,
        codiceFiscale: cliente.codiceFiscale,
        partitaIva: cliente.partitaIva,
        email: cliente.email,
        pec: cliente.pec,
        telefono: cliente.telefono,
        indirizzo: cliente.indirizzo,
        cap: cliente.cap,
        citta: cliente.citta,
        provincia: cliente.provincia,
        regimeFiscale: cliente.regimeFiscale,
        periodicitaIva: cliente.periodicitaIva,
        haImmobili: cliente.haImmobili ? 'Sì' : 'No',
        esenteIva: cliente.esenteIva ? 'Sì' : 'No',
        soggettoIva: cliente.soggettoIva ? 'Sì' : 'No',
        aliquotaIva: cliente.aliquotaIva ? Number(cliente.aliquotaIva) : null,
        esenteRitenuta: cliente.esenteRitenuta ? 'Sì' : 'No',
        soggettoRitenuta: cliente.soggettoRitenuta ? 'Sì' : 'No',
        aliquotaRitenuta: cliente.aliquotaRitenuta ? Number(cliente.aliquotaRitenuta) : null,
        attivo: cliente.attivo ? 'Sì' : 'No',
      });
    });

    if (format === 'csv') {
      return await workbook.csv.writeBuffer();
    } else {
      return await workbook.xlsx.writeBuffer();
    }
  }

  async exportMovimenti(filters: any, format: 'csv' | 'excel' = 'csv') {
    const query = this.movimentoRepository
      .createQueryBuilder('movimento')
      .leftJoinAndSelect('movimento.cliente', 'cliente');

    if (filters.dataInizio && filters.dataFine) {
      query.andWhere('movimento.dataMovimento BETWEEN :dataInizio AND :dataFine', {
        dataInizio: filters.dataInizio,
        dataFine: filters.dataFine,
      });
    }

    if (filters.tipo) {
      query.andWhere('movimento.tipo = :tipo', { tipo: filters.tipo });
    }

    query.orderBy('movimento.dataMovimento', 'DESC');

    const movimenti = await query.getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movimenti Cassa');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Data', key: 'dataMovimento', width: 12 },
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Cliente', key: 'cliente', width: 40 },
      { header: 'Categoria', key: 'categoria', width: 20 },
      { header: 'Descrizione', key: 'descrizione', width: 50 },
      { header: 'Importo Totale (€)', key: 'importo', width: 15 },
      { header: 'Imponibile (€)', key: 'imponibile', width: 15 },
      { header: 'IVA (€)', key: 'importoIva', width: 12 },
      { header: 'Aliquota IVA (%)', key: 'aliquotaIva', width: 15 },
      { header: 'Ritenuta (€)', key: 'importoRitenuta', width: 12 },
      { header: 'Aliq. Ritenuta (%)', key: 'aliquotaRitenuta', width: 15 },
      { header: 'Non Imponibile (€)', key: 'nonImponibile', width: 15 },
      { header: 'Spesa Interna', key: 'spesaInterna', width: 12 },
      { header: 'Metodo Pagamento', key: 'metodoPagamento', width: 20 },
      { header: 'Note', key: 'note', width: 40 },
    ];

    movimenti.forEach(movimento => {
      worksheet.addRow({
        id: movimento.id,
        dataMovimento: movimento.dataMovimento,
        tipo: movimento.tipo,
        cliente: movimento.cliente ? (movimento.cliente.ragioneSociale || `${movimento.cliente.nome} ${movimento.cliente.cognome}`) : 'Studio',
        categoria: movimento.categoria,
        descrizione: movimento.descrizione,
        importo: Number(movimento.importo),
        imponibile: movimento.imponibile ? Number(movimento.imponibile) : null,
        importoIva: movimento.importoIva ? Number(movimento.importoIva) : null,
        aliquotaIva: movimento.aliquotaIva ? Number(movimento.aliquotaIva) : null,
        importoRitenuta: movimento.importoRitenuta ? Number(movimento.importoRitenuta) : null,
        aliquotaRitenuta: movimento.aliquotaRitenuta ? Number(movimento.aliquotaRitenuta) : null,
        nonImponibile: movimento.nonImponibile ? Number(movimento.nonImponibile) : null,
        spesaInterna: movimento.spesaInterna ? 'Sì' : 'No',
        metodoPagamento: movimento.metodoPagamento,
        note: movimento.note,
      });
    });

    if (format === 'csv') {
      return await workbook.csv.writeBuffer();
    } else {
      return await workbook.xlsx.writeBuffer();
    }
  }

  async exportScadenze(filters: any, format: 'csv' | 'excel' = 'csv') {
    const query = this.scadenzaRepository
      .createQueryBuilder('scadenza')
      .leftJoinAndSelect('scadenza.cliente', 'cliente');

    if (filters.dataInizio && filters.dataFine) {
      query.andWhere('scadenza.dataScadenza BETWEEN :dataInizio AND :dataFine', {
        dataInizio: filters.dataInizio,
        dataFine: filters.dataFine,
      });
    }

    if (filters.stato) {
      query.andWhere('scadenza.stato = :stato', { stato: filters.stato });
    }

    query.orderBy('scadenza.dataScadenza', 'ASC');

    const scadenze = await query.getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scadenze');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Data Scadenza', key: 'dataScadenza', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 40 },
      { header: 'Tipo Scadenza', key: 'tipoScadenza', width: 40 },
      { header: 'Stato', key: 'stato', width: 15 },
      { header: 'Note', key: 'note', width: 50 },
    ];

    scadenze.forEach(scadenza => {
      worksheet.addRow({
        id: scadenza.id,
        dataScadenza: scadenza.dataScadenza,
        cliente: scadenza.cliente ? (scadenza.cliente.ragioneSociale || `${scadenza.cliente.nome} ${scadenza.cliente.cognome}`) : 'Studio',
        tipoScadenza: scadenza.tipoScadenza,
        stato: scadenza.stato,
        note: scadenza.note,
      });
    });

    if (format === 'csv') {
      return await workbook.csv.writeBuffer();
    } else {
      return await workbook.xlsx.writeBuffer();
    }
  }
}

