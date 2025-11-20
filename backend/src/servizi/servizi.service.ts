import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServizioPredefinito } from '../entities/servizio-predefinito.entity';
import { MovimentoCassa, TipoMovimento } from '../entities/movimento-cassa.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateServizioDto, UpdateServizioDto, GeneraMovimentoDaServizioDto } from './dto/servizio.dto';

@Injectable()
export class ServiziService {
  constructor(
    @InjectRepository(ServizioPredefinito)
    private servizioRepository: Repository<ServizioPredefinito>,
    @InjectRepository(MovimentoCassa)
    private movimentoRepository: Repository<MovimentoCassa>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(attivo?: boolean) {
    const query = this.servizioRepository.createQueryBuilder('servizio');

    if (attivo !== undefined) {
      query.where('servizio.attivo = :attivo', { attivo });
    }

    return await query.orderBy('servizio.nome', 'ASC').getMany();
  }

  async findOne(id: number) {
    const servizio = await this.servizioRepository.findOne({ where: { id } });
    if (!servizio) {
      throw new NotFoundException(`Servizio con ID ${id} non trovato`);
    }
    return servizio;
  }

  async create(createServizioDto: CreateServizioDto) {
    const servizio = this.servizioRepository.create(createServizioDto);
    return await this.servizioRepository.save(servizio);
  }

  async update(id: number, updateServizioDto: UpdateServizioDto) {
    const servizio = await this.findOne(id);
    Object.assign(servizio, updateServizioDto);
    return await this.servizioRepository.save(servizio);
  }

  async remove(id: number) {
    const servizio = await this.findOne(id);
    servizio.attivo = false;
    return await this.servizioRepository.save(servizio);
  }

  /**
   * Genera un movimento da un servizio predefinito, applicando le regole fiscali del cliente
   */
  async generaMovimentoDaServizio(dto: GeneraMovimentoDaServizioDto) {
    const servizio = await this.findOne(dto.servizioId);
    const cliente = await this.clienteRepository.findOne({ where: { id: dto.clienteId } });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${dto.clienteId} non trovato`);
    }

    // Calcola i valori fiscali basandosi sulle regole del cliente
    const importoBase = servizio.importo;
    let imponibile = importoBase;
    let importoIva = 0;
    let aliquotaIva = null;
    let importoRitenuta = 0;
    let aliquotaRitenuta = null;
    let importoTotale = importoBase;

    // Applica IVA se il cliente è soggetto a IVA e il servizio prevede l'IVA
    if (cliente.soggettoIva && !cliente.esenteIva && servizio.applicaIva) {
      aliquotaIva = cliente.aliquotaIva || servizio.aliquotaIva;
      importoIva = (imponibile * aliquotaIva) / 100;
      importoTotale = imponibile + importoIva;
    }

    // Applica ritenuta se il cliente è soggetto a ritenuta e il servizio prevede la ritenuta
    if (cliente.soggettoRitenuta && !cliente.esenteRitenuta && servizio.applicaRitenuta) {
      aliquotaRitenuta = cliente.aliquotaRitenuta || servizio.aliquotaRitenuta;
      importoRitenuta = (imponibile * aliquotaRitenuta) / 100;
    }

    // Crea il movimento
    const movimento = this.movimentoRepository.create({
      clienteId: cliente.id,
      dataMovimento: new Date(dto.dataMovimento),
      tipo: TipoMovimento.ENTRATA,
      categoria: servizio.categoria,
      descrizione: servizio.descrizione || servizio.nome,
      importo: importoTotale,
      imponibile: imponibile,
      importoIva: importoIva > 0 ? importoIva : null,
      aliquotaIva: aliquotaIva,
      importoRitenuta: importoRitenuta > 0 ? importoRitenuta : null,
      aliquotaRitenuta: aliquotaRitenuta,
      metodoPagamento: dto.metodoPagamento,
      note: dto.note,
      spesaInterna: false,
    });

    return await this.movimentoRepository.save(movimento);
  }
}

