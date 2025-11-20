import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotaCliente } from '../entities/nota-cliente.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateNotaDto, UpdateNotaDto } from './dto/nota.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NotaCliente)
    private notaRepository: Repository<NotaCliente>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async findByCliente(clienteId: number) {
    const cliente = await this.clienteRepository.findOne({ where: { id: clienteId } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} non trovato`);
    }

    return await this.notaRepository.find({
      where: { clienteId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const nota = await this.notaRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!nota) {
      throw new NotFoundException(`Nota con ID ${id} non trovata`);
    }

    return nota;
  }

  async create(clienteId: number, createNotaDto: CreateNotaDto) {
    const cliente = await this.clienteRepository.findOne({ where: { id: clienteId } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} non trovato`);
    }

    const nota = this.notaRepository.create({
      ...createNotaDto,
      clienteId,
    });

    return await this.notaRepository.save(nota);
  }

  async update(id: number, updateNotaDto: UpdateNotaDto) {
    const nota = await this.findOne(id);
    Object.assign(nota, updateNotaDto);
    return await this.notaRepository.save(nota);
  }

  async remove(id: number) {
    const nota = await this.findOne(id);
    await this.notaRepository.remove(nota);
    return { message: 'Nota eliminata con successo' };
  }
}

