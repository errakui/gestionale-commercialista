import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Cliente, PeriodicitaIva } from '../entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto, FilterClienteDto } from './dto/cliente.dto';
import { ScadenzeGeneratorService } from './scadenze-generator.service';

@Injectable()
export class ClientiService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private scadenzeGenerator: ScadenzeGeneratorService,
  ) {}

  async findAll(filters: FilterClienteDto) {
    const query = this.clienteRepository.createQueryBuilder('cliente');

    if (filters.search) {
      query.andWhere(
        '(cliente.ragioneSociale LIKE :search OR cliente.nome LIKE :search OR cliente.cognome LIKE :search OR cliente.codiceFiscale LIKE :search OR cliente.partitaIva LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.attivo !== undefined) {
      query.andWhere('cliente.attivo = :attivo', { attivo: filters.attivo });
    }

    if (filters.regimeFiscale) {
      query.andWhere('cliente.regimeFiscale = :regimeFiscale', { regimeFiscale: filters.regimeFiscale });
    }

    if (filters.periodicitaIva) {
      query.andWhere('cliente.periodicitaIva = :periodicitaIva', { periodicitaIva: filters.periodicitaIva });
    }

    query.orderBy('cliente.ragioneSociale', 'ASC');

    return await query.getMany();
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['scadenze', 'movimenti', 'note'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} non trovato`);
    }

    return cliente;
  }

  async create(createClienteDto: CreateClienteDto) {
    const cliente = this.clienteRepository.create(createClienteDto);
    const savedCliente = await this.clienteRepository.save(cliente);

    // Genera automaticamente le scadenze
    await this.scadenzeGenerator.generateScadenzeForCliente(savedCliente);

    return savedCliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    
    const oldPeriodicitaIva = cliente.periodicitaIva;
    const oldHaImmobili = cliente.haImmobili;

    Object.assign(cliente, updateClienteDto);
    const updated = await this.clienteRepository.save(cliente);

    // Rigenera scadenze se sono cambiate le caratteristiche fiscali
    if (
      updateClienteDto.periodicitaIva && updateClienteDto.periodicitaIva !== oldPeriodicitaIva ||
      updateClienteDto.haImmobili !== undefined && updateClienteDto.haImmobili !== oldHaImmobili
    ) {
      await this.scadenzeGenerator.regenerateScadenzeForCliente(updated);
    }

    return updated;
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    cliente.attivo = false;
    return await this.clienteRepository.save(cliente);
  }

  async getStatistics(clienteId: number, year?: number) {
    const currentYear = year || new Date().getFullYear();
    
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN tipo = 'ENTRATA' THEN importo ELSE 0 END), 0) as totaleEntrate,
        COALESCE(SUM(CASE WHEN tipo = 'USCITA' THEN importo ELSE 0 END), 0) as totaleUscite
      FROM movimenti_cassa
      WHERE cliente_id = ? 
        AND YEAR(data_movimento) = ?
    `;

    const movimentiStats = await this.clienteRepository.query(query, [clienteId, currentYear]);

    const scadenzeQuery = `
      SELECT COUNT(*) as count
      FROM scadenze
      WHERE cliente_id = ?
        AND stato = 'DA_FARE'
        AND data_scadenza BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `;

    const scadenzeStats = await this.clienteRepository.query(scadenzeQuery, [clienteId]);

    return {
      totaleEntrate: parseFloat(movimentiStats[0]?.totaleEntrate || 0),
      totaleUscite: parseFloat(movimentiStats[0]?.totaleUscite || 0),
      saldo: parseFloat(movimentiStats[0]?.totaleEntrate || 0) - parseFloat(movimentiStats[0]?.totaleUscite || 0),
      scadenzeProssimi30Giorni: parseInt(scadenzeStats[0]?.count || 0),
    };
  }
}

