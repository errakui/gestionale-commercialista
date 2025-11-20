import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimentoCassa, TipoMovimento } from '../entities/movimento-cassa.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateMovimentoDto, UpdateMovimentoDto, FilterMovimentoDto } from './dto/movimento.dto';

@Injectable()
export class MovimentiService {
  constructor(
    @InjectRepository(MovimentoCassa)
    private movimentoRepository: Repository<MovimentoCassa>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(filters: FilterMovimentoDto) {
    const query = this.movimentoRepository
      .createQueryBuilder('movimento')
      .leftJoinAndSelect('movimento.cliente', 'cliente');

    if (filters.clienteId) {
      query.andWhere('movimento.clienteId = :clienteId', { clienteId: filters.clienteId });
    }

    if (filters.tipo) {
      query.andWhere('movimento.tipo = :tipo', { tipo: filters.tipo });
    }

    if (filters.categoria) {
      query.andWhere('movimento.categoria = :categoria', { categoria: filters.categoria });
    }

    if (filters.spesaInterna !== undefined) {
      query.andWhere('movimento.spesaInterna = :spesaInterna', { spesaInterna: filters.spesaInterna });
    }

    if (filters.dataInizio && filters.dataFine) {
      query.andWhere('movimento.dataMovimento BETWEEN :dataInizio AND :dataFine', {
        dataInizio: filters.dataInizio,
        dataFine: filters.dataFine,
      });
    } else if (filters.mese && filters.anno) {
      const startDate = new Date(filters.anno, filters.mese - 1, 1);
      const endDate = new Date(filters.anno, filters.mese, 0);
      query.andWhere('movimento.dataMovimento BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
    }

    query.orderBy('movimento.dataMovimento', 'DESC');

    return await query.getMany();
  }

  async findOne(id: number) {
    const movimento = await this.movimentoRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!movimento) {
      throw new NotFoundException(`Movimento con ID ${id} non trovato`);
    }

    return movimento;
  }

  async create(createMovimentoDto: CreateMovimentoDto) {
    // Se è presente un cliente e non sono già stati calcolati i valori fiscali, li calcoliamo
    if (createMovimentoDto.clienteId && !createMovimentoDto.imponibile) {
      const cliente = await this.clienteRepository.findOne({ 
        where: { id: createMovimentoDto.clienteId } 
      });
      
      if (cliente) {
        const calcoloFiscale = this.calcolaValoriFiscali(
          createMovimentoDto.importo,
          cliente,
          createMovimentoDto.tipo
        );
        
        Object.assign(createMovimentoDto, calcoloFiscale);
      }
    }

    const movimento = this.movimentoRepository.create(createMovimentoDto);
    return await this.movimentoRepository.save(movimento);
  }

  /**
   * Calcola automaticamente i valori fiscali in base alle regole del cliente
   */
  private calcolaValoriFiscali(importoTotale: number, cliente: Cliente, tipo: TipoMovimento) {
    let imponibile = importoTotale;
    let importoIva = null;
    let aliquotaIva = null;
    let importoRitenuta = null;
    let aliquotaRitenuta = null;

    // Per le entrate
    if (tipo === TipoMovimento.ENTRATA) {
      // Calcolo IVA
      if (cliente.soggettoIva && !cliente.esenteIva) {
        aliquotaIva = cliente.aliquotaIva || 22;
        // Se l'importo include IVA, scorporiamo
        imponibile = importoTotale / (1 + aliquotaIva / 100);
        importoIva = importoTotale - imponibile;
      }

      // Calcolo Ritenuta d'acconto
      if (cliente.soggettoRitenuta && !cliente.esenteRitenuta) {
        aliquotaRitenuta = cliente.aliquotaRitenuta || 20;
        importoRitenuta = imponibile * (aliquotaRitenuta / 100);
      }
    }

    return {
      imponibile: Math.round(imponibile * 100) / 100,
      importoIva: importoIva ? Math.round(importoIva * 100) / 100 : null,
      aliquotaIva,
      importoRitenuta: importoRitenuta ? Math.round(importoRitenuta * 100) / 100 : null,
      aliquotaRitenuta,
    };
  }

  async update(id: number, updateMovimentoDto: UpdateMovimentoDto) {
    const movimento = await this.findOne(id);
    Object.assign(movimento, updateMovimentoDto);
    return await this.movimentoRepository.save(movimento);
  }

  async remove(id: number) {
    const movimento = await this.findOne(id);
    await this.movimentoRepository.remove(movimento);
    return { message: 'Movimento eliminato con successo' };
  }

  async getSummary(filters: FilterMovimentoDto) {
    const movimenti = await this.findAll(filters);

    const totaleEntrate = movimenti
      .filter(m => m.tipo === TipoMovimento.ENTRATA)
      .reduce((sum, m) => sum + Number(m.importo), 0);

    const totaleUscite = movimenti
      .filter(m => m.tipo === TipoMovimento.USCITA)
      .reduce((sum, m) => sum + Number(m.importo), 0);

    // Calcolo valori fiscali aggregati
    const totaleIva = movimenti
      .reduce((sum, m) => sum + Number(m.importoIva || 0), 0);

    const totaleRitenute = movimenti
      .filter(m => m.tipo === TipoMovimento.ENTRATA)
      .reduce((sum, m) => sum + Number(m.importoRitenuta || 0), 0);

    const totaleImponibile = movimenti
      .reduce((sum, m) => sum + Number(m.imponibile || m.importo), 0);

    return {
      totaleEntrate,
      totaleUscite,
      saldo: totaleEntrate - totaleUscite,
      numeroMovimenti: movimenti.length,
      totaleIva,
      totaleRitenute,
      totaleImponibile,
    };
  }

  async getMonthlyTrend(anno: number, clienteId?: number) {
    const query = `
      SELECT 
        MONTH(data_movimento) as mese,
        SUM(CASE WHEN tipo = 'ENTRATA' THEN importo ELSE 0 END) as entrate,
        SUM(CASE WHEN tipo = 'USCITA' THEN importo ELSE 0 END) as uscite
      FROM movimenti_cassa
      WHERE YEAR(data_movimento) = ?
        ${clienteId ? 'AND cliente_id = ?' : ''}
      GROUP BY MONTH(data_movimento)
      ORDER BY mese
    `;

    const params = clienteId ? [anno, clienteId] : [anno];
    const results = await this.movimentoRepository.query(query, params);

    // Riempi tutti i mesi (anche quelli senza dati)
    const monthlyData = [];
    for (let i = 1; i <= 12; i++) {
      const found = results.find(r => r.mese === i);
      monthlyData.push({
        mese: i,
        entrate: found ? parseFloat(found.entrate) : 0,
        uscite: found ? parseFloat(found.uscite) : 0,
      });
    }

    return monthlyData;
  }
}

