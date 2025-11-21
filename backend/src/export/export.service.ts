import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { MovimentoCassa } from '../entities/movimento-cassa.entity';
import { Scadenza } from '../entities/scadenza.entity';
import * as ExcelJS from 'exceljs';
const PDFDocument = require('pdfkit');

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

  async exportCliente(clienteId: number, format: 'excel' | 'pdf' = 'excel') {
    // Recupera il cliente con tutti i suoi dati
    const cliente = await this.clienteRepository.findOne({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new Error('Cliente non trovato');
    }

    // Recupera tutti i movimenti del cliente
    const movimenti = await this.movimentoRepository.find({
      where: { clienteId },
      order: { dataMovimento: 'DESC' },
    });

    // Calcola i totali
    const totaleEntrate = movimenti
      .filter(m => m.tipo === 'ENTRATA')
      .reduce((sum, m) => sum + Number(m.importo), 0);

    const totaleUscite = movimenti
      .filter(m => m.tipo === 'USCITA')
      .reduce((sum, m) => sum + Number(m.importo), 0);

    const totaleImponibile = movimenti
      .reduce((sum, m) => sum + (m.imponibile ? Number(m.imponibile) : 0), 0);

    const totaleIva = movimenti
      .reduce((sum, m) => sum + (m.importoIva ? Number(m.importoIva) : 0), 0);

    const totaleRitenuta = movimenti
      .reduce((sum, m) => sum + (m.importoRitenuta ? Number(m.importoRitenuta) : 0), 0);

    const saldo = totaleEntrate - totaleUscite;

    // Crea Excel
    const workbook = new ExcelJS.Workbook();

    // FOGLIO 1: Dati Cliente
    const datiSheet = workbook.addWorksheet('Dati Cliente');
    
    datiSheet.columns = [
      { header: 'Campo', key: 'campo', width: 30 },
      { header: 'Valore', key: 'valore', width: 50 },
    ];

    const nomeCompleto = cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`;
    
    datiSheet.addRow({ campo: 'Cliente', valore: nomeCompleto });
    datiSheet.addRow({ campo: 'Tipo', valore: cliente.tipoCliente });
    datiSheet.addRow({ campo: 'Codice Fiscale', valore: cliente.codiceFiscale || '-' });
    datiSheet.addRow({ campo: 'Partita IVA', valore: cliente.partitaIva || '-' });
    datiSheet.addRow({ campo: 'Email', valore: cliente.email || '-' });
    datiSheet.addRow({ campo: 'Telefono', valore: cliente.telefono || '-' });
    datiSheet.addRow({ campo: 'Indirizzo', valore: cliente.indirizzo || '-' });
    datiSheet.addRow({ campo: 'CAP', valore: cliente.cap || '-' });
    datiSheet.addRow({ campo: 'Città', valore: cliente.citta || '-' });
    datiSheet.addRow({ campo: 'Provincia', valore: cliente.provincia || '-' });
    datiSheet.addRow({ campo: '', valore: '' });
    datiSheet.addRow({ campo: 'Regime Fiscale', valore: cliente.regimeFiscale || '-' });
    datiSheet.addRow({ campo: 'Soggetto IVA', valore: cliente.soggettoIva ? 'Sì' : 'No' });
    datiSheet.addRow({ campo: 'Aliquota IVA (%)', valore: cliente.aliquotaIva || '-' });
    datiSheet.addRow({ campo: 'Soggetto Ritenuta', valore: cliente.soggettoRitenuta ? 'Sì' : 'No' });
    datiSheet.addRow({ campo: 'Aliquota Ritenuta (%)', valore: cliente.aliquotaRitenuta || '-' });

    // FOGLIO 2: Riepilogo Finanziario
    const riepilogoSheet = workbook.addWorksheet('Riepilogo');
    
    riepilogoSheet.columns = [
      { header: 'Voce', key: 'voce', width: 30 },
      { header: 'Importo (€)', key: 'importo', width: 20 },
    ];

    riepilogoSheet.addRow({ voce: 'Totale Entrate', importo: totaleEntrate.toFixed(2) });
    riepilogoSheet.addRow({ voce: 'Totale Uscite', importo: totaleUscite.toFixed(2) });
    riepilogoSheet.addRow({ voce: 'Saldo', importo: saldo.toFixed(2) });
    riepilogoSheet.addRow({ voce: '', importo: '' });
    riepilogoSheet.addRow({ voce: 'Totale Imponibile', importo: totaleImponibile.toFixed(2) });
    riepilogoSheet.addRow({ voce: 'Totale IVA Raccolta', importo: totaleIva.toFixed(2) });
    riepilogoSheet.addRow({ voce: 'Totale Ritenute', importo: totaleRitenuta.toFixed(2) });

    // FOGLIO 3: Movimenti
    const movimentiSheet = workbook.addWorksheet('Movimenti');

    movimentiSheet.columns = [
      { header: 'Data', key: 'data', width: 12 },
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Categoria', key: 'categoria', width: 20 },
      { header: 'Descrizione', key: 'descrizione', width: 40 },
      { header: 'Importo (€)', key: 'importo', width: 15 },
      { header: 'Imponibile (€)', key: 'imponibile', width: 15 },
      { header: 'IVA (€)', key: 'iva', width: 12 },
      { header: 'Ritenuta (€)', key: 'ritenuta', width: 12 },
      { header: 'Note', key: 'note', width: 30 },
    ];

    movimenti.forEach(movimento => {
      movimentiSheet.addRow({
        data: movimento.dataMovimento,
        tipo: movimento.tipo,
        categoria: movimento.categoria || '-',
        descrizione: movimento.descrizione,
        importo: Number(movimento.importo).toFixed(2),
        imponibile: movimento.imponibile ? Number(movimento.imponibile).toFixed(2) : '-',
        iva: movimento.importoIva ? Number(movimento.importoIva).toFixed(2) : '-',
        ritenuta: movimento.importoRitenuta ? Number(movimento.importoRitenuta).toFixed(2) : '-',
        note: movimento.note || '-',
      });
    });

    // GENERA PDF
    if (format === 'pdf') {
      return await this.generateClientePDF(cliente, movimenti, {
        totaleEntrate,
        totaleUscite,
        totaleImponibile,
        totaleIva,
        totaleRitenuta,
        saldo,
      });
    }

    // GENERA EXCEL
    return await workbook.xlsx.writeBuffer();
  }

  private async generateClientePDF(cliente: Cliente, movimenti: MovimentoCassa[], totali: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const nomeCompleto = cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`;

        // INTESTAZIONE
        doc.fontSize(20).font('Helvetica-Bold').text('ESTRATTO CONTO CLIENTE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).font('Helvetica-Bold').text(nomeCompleto, { align: 'center' });
        doc.moveDown();

        // DATI CLIENTE
        doc.fontSize(10).font('Helvetica');
        if (cliente.codiceFiscale) doc.text(`CF: ${cliente.codiceFiscale}`);
        if (cliente.partitaIva) doc.text(`P.IVA: ${cliente.partitaIva}`);
        if (cliente.email) doc.text(`Email: ${cliente.email}`);
        if (cliente.telefono) doc.text(`Tel: ${cliente.telefono}`);
        if (cliente.indirizzo) doc.text(`Indirizzo: ${cliente.indirizzo}, ${cliente.cap || ''} ${cliente.citta || ''} (${cliente.provincia || ''})`);
        doc.moveDown(2);

        // TABELLA MOVIMENTI
        doc.fontSize(14).font('Helvetica-Bold').text('Movimenti', { underline: true });
        doc.moveDown();

        // Header tabella
        const tableTop = doc.y;
        const col1X = 50;
        const col2X = 110;
        const col3X = 160;
        const col4X = 320;
        const col5X = 385;
        const col6X = 450;
        const col7X = 515;
        const rowHeight = 20;

        doc.fontSize(8).font('Helvetica-Bold');
        doc.text('Data', col1X, tableTop, { width: 55, continued: false });
        doc.text('Tipo', col2X, tableTop, { width: 45, continued: false });
        doc.text('Descrizione', col3X, tableTop, { width: 155, continued: false });
        doc.text('Imp.', col4X, tableTop, { width: 60, align: 'right', continued: false });
        doc.text('IVA', col5X, tableTop, { width: 60, align: 'right', continued: false });
        doc.text('Rit.', col6X, tableTop, { width: 60, align: 'right', continued: false });
        doc.text('Tot.', col7X, tableTop, { width: 60, align: 'right', continued: false });

        // Linea sotto header
        doc.moveTo(col1X, tableTop + 12).lineTo(570, tableTop + 12).stroke();

        let currentY = tableTop + rowHeight;
        doc.fontSize(7).font('Helvetica');

        // Righe movimenti
        movimenti.forEach((mov, index) => {
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }

          const dataStr = new Date(mov.dataMovimento).toLocaleDateString('it-IT');
          const tipoStr = mov.tipo === 'ENTRATA' ? 'ENT' : 'USC';
          const descStr = mov.descrizione.substring(0, 30);
          const impStr = (mov.imponibile || mov.importo) ? Number(mov.imponibile || mov.importo).toFixed(2) : '0.00';
          const ivaStr = mov.importoIva ? Number(mov.importoIva).toFixed(2) : '0.00';
          const ritStr = mov.importoRitenuta ? Number(mov.importoRitenuta).toFixed(2) : '0.00';
          // Calcola totale: per entrate = importo - ritenuta, per uscite = importo
          const importoNum = Number(mov.importo) || 0;
          const ritenutaNum = Number(mov.importoRitenuta) || 0;
          const totStr = mov.tipo === 'ENTRATA' 
            ? (importoNum - ritenutaNum).toFixed(2)
            : importoNum.toFixed(2);

          doc.text(dataStr, col1X, currentY, { width: 55, continued: false });
          doc.text(tipoStr, col2X, currentY, { width: 45, continued: false });
          doc.text(descStr, col3X, currentY, { width: 155, continued: false });
          doc.text(impStr, col4X, currentY, { width: 60, align: 'right', continued: false });
          doc.text(ivaStr, col5X, currentY, { width: 60, align: 'right', continued: false });
          doc.text(ritStr, col6X, currentY, { width: 60, align: 'right', continued: false });
          doc.text(totStr, col7X, currentY, { width: 60, align: 'right', continued: false });

          currentY += rowHeight;

          // Linea separatrice ogni 5 righe
          if ((index + 1) % 5 === 0) {
            doc.moveTo(col1X, currentY - 5).lineTo(570, currentY - 5).strokeColor('#EEEEEE').stroke().strokeColor('#000000');
          }
        });

        // TOTALI
        currentY += 10;
        doc.moveTo(col1X, currentY).lineTo(570, currentY).lineWidth(2).stroke().lineWidth(1);
        currentY += 15;

        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('TOTALI', col1X, currentY, { width: 265, continued: false });
        doc.text(totali.totaleImponibile.toFixed(2), col4X, currentY, { width: 60, align: 'right', continued: false });
        doc.text(totali.totaleIva.toFixed(2), col5X, currentY, { width: 60, align: 'right', continued: false });
        doc.text(totali.totaleRitenuta.toFixed(2), col6X, currentY, { width: 60, align: 'right', continued: false });
        doc.text(totali.saldo.toFixed(2), col7X, currentY, { width: 60, align: 'right', continued: false });

        currentY += 30;
        doc.fontSize(10);
        doc.text(`Totale Entrate: € ${totali.totaleEntrate.toFixed(2)}`, col1X, currentY);
        currentY += 15;
        doc.text(`Totale Uscite: € ${totali.totaleUscite.toFixed(2)}`, col1X, currentY);
        currentY += 15;
        doc.font('Helvetica-Bold').text(`Saldo: € ${totali.saldo.toFixed(2)}`, col1X, currentY);

        // Footer
        doc.fontSize(8).font('Helvetica').text(
          `Documento generato il ${new Date().toLocaleDateString('it-IT')} alle ${new Date().toLocaleTimeString('it-IT')}`,
          50,
          750,
          { align: 'center' }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async exportMandato(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const { datiStudio, datiCliente, datiMandato } = data;

        // INTESTAZIONE
        doc.fontSize(18).font('Helvetica-Bold').text('MANDATO DI INCARICO PROFESSIONALE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text('Tra Commercialista e Cliente', { align: 'center' });
        doc.moveDown(2);

        // PARTI
        doc.fontSize(11).font('Helvetica-Bold').text('Tra:');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica-Bold').text(datiStudio.nome);
        doc.fontSize(9).font('Helvetica').text(`P.IVA: ${datiStudio.piva}`);
        doc.text(`Sede legale: ${datiStudio.sede}`);
        doc.text(`Email: ${datiStudio.email}`);
        if (datiStudio.pec) doc.text(`PEC: ${datiStudio.pec}`);
        doc.moveDown();

        doc.fontSize(11).font('Helvetica-Bold').text('E', { align: 'center' });
        doc.moveDown();

        doc.fontSize(11).font('Helvetica-Bold').text('E');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica-Bold').text(datiCliente.nome);
        doc.fontSize(9).font('Helvetica').text(`Codice Fiscale / P.IVA: ${datiCliente.cfPiva}`);
        if (datiCliente.indirizzo) doc.text(`Indirizzo: ${datiCliente.indirizzo}`);
        if (datiCliente.email) doc.text(`Email: ${datiCliente.email}`);
        if (datiCliente.pec) doc.text(`PEC: ${datiCliente.pec}`);
        doc.moveDown(2);

        // SEZIONI DEL MANDATO
        doc.fontSize(12).font('Helvetica-Bold').text('1. Oggetto dell\'incarico', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').text(
          datiMandato.serviziInclusi || 'Gestione contabilità e adempimenti fiscali secondo le disposizioni di legge.'
        );
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('2. Durata dell\'incarico', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').text('Annuale, con rinnovo automatico salvo disdetta con 30 giorni di preavviso.');
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('3. Compenso e pagamenti', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica');
        doc.text(`Tipo contabilità: ${datiMandato.tipoContabilita}`);
        doc.text(`Compenso: ${datiMandato.compenso}`);
        if (datiMandato.modalitaPagamento) {
          doc.text(`Modalità pagamento: ${datiMandato.modalitaPagamento}`);
        }
        if (datiMandato.serviziExtra) {
          doc.text(`Servizi extra: ${datiMandato.serviziExtra}`);
        }
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('4. Obblighi del cliente', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica');
        doc.text('– Fornire documenti in modo completo e nei tempi stabiliti', { indent: 20 });
        doc.text('– Comunicare tempestivamente variazioni fiscali, societarie o di attività', { indent: 20 });
        doc.text('– Collaborare correttamente con il professionista', { indent: 20 });
        doc.text('– Pagare puntualmente i compensi pattuiti', { indent: 20 });
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('5. Responsabilità del Professionista', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').text(
          'Il professionista si impegna a svolgere l\'incarico con la massima diligenza professionale, escludendo ogni responsabilità per ritardi o conseguenze derivanti da documentazione mancante, incompleta o errata fornita dal cliente.'
        );
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('6. Trattamento dati (GDPR)', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').text(
          'Il trattamento dei dati personali è effettuato in conformità al Regolamento UE 2016/679 (GDPR) e alla normativa italiana in materia di privacy.'
        );
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('7. Recesso', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').text(
          'Ciascuna parte può recedere dal presente incarico con preavviso di 30 giorni, comunicato per iscritto. Restano comunque dovuti i compensi maturati fino alla data di recesso.'
        );
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('8. Foro competente', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').text(
          'Per qualsiasi controversia derivante dal presente mandato, è competente il Foro della sede dello Studio Commercialista Circhetta Piero, salvo diversi accordi scritti tra le parti.'
        );
        doc.moveDown(1.5);

        doc.fontSize(12).font('Helvetica-Bold').text('9. Accettazione', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').text(`Luogo e data: ${datiMandato.luogoData}`);
        doc.moveDown(2);

        // FIRME
        doc.fontSize(9).font('Helvetica').text('Firma del Professionista');
        doc.moveDown(1);
        doc.text('_________________________');
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').text(datiStudio.nome);
        doc.moveDown(2);
        
        doc.font('Helvetica').text('Firma del Cliente');
        doc.moveDown(1);
        doc.text('_________________________');
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').text(datiCliente.nome);

        // Footer
        doc.fontSize(8).font('Helvetica').text(
          `Documento generato il ${new Date().toLocaleDateString('it-IT')} alle ${new Date().toLocaleTimeString('it-IT')}`,
          50,
          750,
          { align: 'center' }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

