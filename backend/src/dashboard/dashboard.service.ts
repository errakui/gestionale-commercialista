import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimentoCassa, TipoMovimento } from '../entities/movimento-cassa.entity';
import { Scadenza, StatoScadenza } from '../entities/scadenza.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(MovimentoCassa)
    private movimentoRepository: Repository<MovimentoCassa>,
    @InjectRepository(Scadenza)
    private scadenzaRepository: Repository<Scadenza>,
  ) {}

  async getKPI() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN tipo = 'ENTRATA' THEN importo ELSE 0 END), 0) as "totaleEntrate",
        COALESCE(SUM(CASE WHEN tipo = 'USCITA' THEN importo ELSE 0 END), 0) as "totaleUscite",
        COALESCE(SUM(CASE WHEN tipo = 'ENTRATA' THEN COALESCE(importo_iva, 0) ELSE 0 END), 0) as "totaleIvaIncassata",
        COALESCE(SUM(CASE WHEN tipo = 'USCITA' THEN COALESCE(importo_iva, 0) ELSE 0 END), 0) as "totaleIvaVersata",
        COALESCE(SUM(CASE WHEN tipo = 'ENTRATA' THEN COALESCE(importo_ritenuta, 0) ELSE 0 END), 0) as "totaleRitenute",
        COALESCE(SUM(CASE WHEN tipo = 'ENTRATA' THEN COALESCE(imponibile, importo) ELSE 0 END), 0) as "totaleImponibileEntrate",
        COALESCE(SUM(CASE WHEN spesa_interna = true THEN importo ELSE 0 END), 0) as "totaleSpesaStudio"
      FROM movimenti_cassa
      WHERE data_movimento BETWEEN $1 AND $2
    `;

    const result = await this.movimentoRepository.query(query, [
      firstDayOfMonth.toISOString().split('T')[0],
      lastDayOfMonth.toISOString().split('T')[0],
    ]);

    const totaleEntrate = parseFloat(result[0]?.totaleEntrate || 0);
    const totaleUscite = parseFloat(result[0]?.totaleUscite || 0);
    const totaleIvaIncassata = parseFloat(result[0]?.totaleIvaIncassata || 0);
    const totaleIvaVersata = parseFloat(result[0]?.totaleIvaVersata || 0);
    const totaleRitenute = parseFloat(result[0]?.totaleRitenute || 0);
    const totaleImponibileEntrate = parseFloat(result[0]?.totaleImponibileEntrate || 0);
    const totaleSpesaStudio = parseFloat(result[0]?.totaleSpesaStudio || 0);

    // Conta scadenze prossimi 7 giorni
    const dataFine = new Date();
    dataFine.setDate(dataFine.getDate() + 7);

    const scadenzeImminenti = await this.scadenzaRepository.count({
      where: {
        stato: StatoScadenza.DA_FARE,
      },
    });

    return {
      totaleEntrateMeseCorrente: totaleEntrate,
      totaleUsciteMeseCorrente: totaleUscite,
      saldoMeseCorrente: totaleEntrate - totaleUscite,
      totaleIvaIncassata,
      totaleIvaVersata,
      ivaNettoMeseCorrente: totaleIvaIncassata - totaleIvaVersata,
      totaleRitenuteMeseCorrente: totaleRitenute,
      totaleImponibileEntrate,
      totaleSpesaStudio,
      scadenzeImminenti,
    };
  }

  async getScadenzeImminenti(giorni: number = 7) {
    const oggi = new Date();
    const futuro = new Date();
    futuro.setDate(oggi.getDate() + giorni);

    return await this.scadenzaRepository
      .createQueryBuilder('scadenza')
      .leftJoinAndSelect('scadenza.cliente', 'cliente')
      .where('scadenza.stato != :stato', { stato: StatoScadenza.FATTO })
      .andWhere('scadenza.dataScadenza BETWEEN :oggi AND :futuro', {
        oggi: oggi.toISOString().split('T')[0],
        futuro: futuro.toISOString().split('T')[0],
      })
      .orderBy('scadenza.dataScadenza', 'ASC')
      .limit(10)
      .getMany();
  }

  async getScadenzeScadute() {
    const oggi = new Date().toISOString().split('T')[0];

    const scadenze = await this.scadenzaRepository
      .createQueryBuilder('scadenza')
      .leftJoinAndSelect('scadenza.cliente', 'cliente')
      .where('scadenza.stato != :stato', { stato: StatoScadenza.FATTO })
      .andWhere('scadenza.dataScadenza < :oggi', { oggi })
      .orderBy('scadenza.dataScadenza', 'ASC')
      .getMany();

    // Raggruppa per cliente
    const clientiConScadenzeArretrate = {};
    scadenze.forEach(scadenza => {
      const clienteKey = scadenza.clienteId || 'studio';
      if (!clientiConScadenzeArretrate[clienteKey]) {
        clientiConScadenzeArretrate[clienteKey] = {
          cliente: scadenza.cliente || { ragioneSociale: 'Studio' },
          scadenze: [],
        };
      }
      clientiConScadenzeArretrate[clienteKey].scadenze.push(scadenza);
    });

    return {
      numeroScadenzeScadute: scadenze.length,
      clientiConScadenzeArretrate: Object.values(clientiConScadenzeArretrate),
    };
  }

  async getFlussiCassaUltimi12Mesi() {
    const now = new Date();
    const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

    const query = `
      SELECT 
        EXTRACT(YEAR FROM data_movimento)::integer as anno,
        EXTRACT(MONTH FROM data_movimento)::integer as mese,
        SUM(CASE WHEN tipo = 'ENTRATA' THEN importo ELSE 0 END) as entrate,
        SUM(CASE WHEN tipo = 'USCITA' THEN importo ELSE 0 END) as uscite
      FROM movimenti_cassa
      WHERE data_movimento >= $1
      GROUP BY EXTRACT(YEAR FROM data_movimento), EXTRACT(MONTH FROM data_movimento)
      ORDER BY anno, mese
    `;

    const results = await this.movimentoRepository.query(query, [
      startDate.toISOString().split('T')[0],
    ]);

    return results.map(r => ({
      anno: r.anno,
      mese: r.mese,
      entrate: parseFloat(r.entrate),
      uscite: parseFloat(r.uscite),
    }));
  }

  async getUltimiMovimenti(limit: number = 5) {
    return await this.movimentoRepository.find({
      relations: ['cliente'],
      order: { dataMovimento: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async getMiglioriClienti(anno?: number) {
    const currentYear = anno || new Date().getFullYear();
    
    const query = `
      SELECT 
        c.id,
        c.ragione_sociale as "ragioneSociale",
        c.nome,
        c.cognome,
        COALESCE(SUM(m.importo), 0) as "totaleEntrate"
      FROM clienti c
      LEFT JOIN movimenti_cassa m ON c.id = m.cliente_id 
        AND m.tipo = 'ENTRATA'
        AND EXTRACT(YEAR FROM m.data_movimento) = $1
      WHERE c.attivo = true
      GROUP BY c.id, c.ragione_sociale, c.nome, c.cognome
      HAVING SUM(m.importo) > 0
      ORDER BY "totaleEntrate" DESC
      LIMIT 5
    `;

    const results = await this.movimentoRepository.query(query, [currentYear]);

    return results.map(r => ({
      id: r.id,
      nome: r.ragioneSociale || `${r.nome || ''} ${r.cognome || ''}`.trim(),
      totaleEntrate: parseFloat(r.totaleEntrate),
    }));
  }

  async getSpesePrincipali(anno?: number) {
    const currentYear = anno || new Date().getFullYear();
    
    const query = `
      SELECT 
        COALESCE(categoria, 'Senza Categoria') as categoria,
        SUM(importo) as totale,
        COUNT(*) as numero
      FROM movimenti_cassa
      WHERE tipo = 'USCITA'
        AND EXTRACT(YEAR FROM data_movimento) = $1
      GROUP BY categoria
      ORDER BY totale DESC
      LIMIT 10
    `;

    const results = await this.movimentoRepository.query(query, [currentYear]);

    return results.map(r => ({
      categoria: r.categoria,
      totale: parseFloat(r.totale),
      numero: parseInt(r.numero),
    }));
  }
}

