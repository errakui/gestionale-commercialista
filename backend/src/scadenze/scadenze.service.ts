import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThanOrEqual } from 'typeorm';
import { Scadenza, StatoScadenza } from '../entities/scadenza.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateScadenzaDto, UpdateScadenzaDto, FilterScadenzaDto } from './dto/scadenza.dto';
import { TipoMovimento } from '../entities/movimento-cassa.entity';

@Injectable()
export class ScadenzeService {
  constructor(
    @InjectRepository(Scadenza)
    private scadenzaRepository: Repository<Scadenza>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(filters: FilterScadenzaDto) {
    const query = this.scadenzaRepository
      .createQueryBuilder('scadenza')
      .leftJoinAndSelect('scadenza.cliente', 'cliente');

    if (filters.clienteId) {
      query.andWhere('scadenza.clienteId = :clienteId', { clienteId: filters.clienteId });
    }

    if (filters.stato) {
      query.andWhere('scadenza.stato = :stato', { stato: filters.stato });
    }

    if (filters.tipoScadenza) {
      query.andWhere('scadenza.tipoScadenza LIKE :tipo', { tipo: `%${filters.tipoScadenza}%` });
    }

    if (filters.dataInizio && filters.dataFine) {
      query.andWhere('scadenza.dataScadenza BETWEEN :dataInizio AND :dataFine', {
        dataInizio: filters.dataInizio,
        dataFine: filters.dataFine,
      });
    } else if (filters.mese && filters.anno) {
      const startDate = new Date(filters.anno, filters.mese - 1, 1);
      const endDate = new Date(filters.anno, filters.mese, 0);
      query.andWhere('scadenza.dataScadenza BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    query.orderBy('scadenza.dataScadenza', 'ASC');

    return await query.getMany();
  }

  async findImminenti(giorni: number = 7) {
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
      .getMany();
  }

  async findScadute() {
    const oggi = new Date().toISOString().split('T')[0];

    return await this.scadenzaRepository
      .createQueryBuilder('scadenza')
      .leftJoinAndSelect('scadenza.cliente', 'cliente')
      .where('scadenza.stato != :stato', { stato: StatoScadenza.FATTO })
      .andWhere('scadenza.dataScadenza < :oggi', { oggi })
      .orderBy('scadenza.dataScadenza', 'ASC')
      .getMany();
  }

  async findOne(id: number) {
    const scadenza = await this.scadenzaRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!scadenza) {
      throw new NotFoundException(`Scadenza con ID ${id} non trovata`);
    }

    return scadenza;
  }

  async create(createScadenzaDto: CreateScadenzaDto) {
    const scadenza = this.scadenzaRepository.create(createScadenzaDto);
    return await this.scadenzaRepository.save(scadenza);
  }

  async update(id: number, updateScadenzaDto: UpdateScadenzaDto) {
    const scadenza = await this.findOne(id);
    Object.assign(scadenza, updateScadenzaDto);
    return await this.scadenzaRepository.save(scadenza);
  }

  async remove(id: number) {
    const scadenza = await this.findOne(id);
    await this.scadenzaRepository.remove(scadenza);
    return { message: 'Scadenza eliminata con successo' };
  }

  async completa(id: number) {
    const scadenza = await this.findOne(id);
    scadenza.stato = StatoScadenza.FATTO;
    await this.scadenzaRepository.save(scadenza);

    // Genera suggerimento per movimento di cassa
    const suggerimento = await this.generateMovimentoSuggestion(scadenza);

    return {
      scadenza,
      suggerimentoMovimento: suggerimento,
    };
  }

  private async generateMovimentoSuggestion(scadenza: Scadenza) {
    // Identifica se la scadenza richiede un pagamento
    const tipiPagamento = [
      'IVA',
      'IMU',
      'F24',
      'INPS',
      'Redditi',
      'Tributi',
      'Imposte',
    ];

    const richiedePagamento = tipiPagamento.some(tipo =>
      scadenza.tipoScadenza.toUpperCase().includes(tipo)
    );

    if (!richiedePagamento) {
      return null;
    }

    // Genera suggerimento
    return {
      tipo: TipoMovimento.USCITA,
      categoria: 'Imposte e Tributi',
      clienteId: scadenza.clienteId,
      descrizione: `Pagamento ${scadenza.tipoScadenza}`,
      dataMovimento: new Date().toISOString().split('T')[0],
      scadenzaId: scadenza.id,
      metodoPagamento: 'F24',
      note: `Generato automaticamente da scadenza #${scadenza.id}`,
    };
  }

  async getCalendarData(mese: number, anno: number) {
    const startDate = new Date(anno, mese - 1, 1);
    const endDate = new Date(anno, mese, 0);

    const scadenze = await this.scadenzaRepository
      .createQueryBuilder('scadenza')
      .leftJoinAndSelect('scadenza.cliente', 'cliente')
      .where('scadenza.dataScadenza BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
      .orderBy('scadenza.dataScadenza', 'ASC')
      .getMany();

    // Raggruppa per giorno
    const calendar = {};
    scadenze.forEach(scadenza => {
      const day = new Date(scadenza.dataScadenza).getDate();
      if (!calendar[day]) {
        calendar[day] = [];
      }
      calendar[day].push(scadenza);
    });

    return calendar;
  }
}

