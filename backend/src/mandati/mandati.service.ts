import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mandato } from '../entities/mandato.entity';
import { CreateMandatoDto, UpdateMandatoDto } from './dto/mandato.dto';

@Injectable()
export class MandatiService {
  constructor(
    @InjectRepository(Mandato)
    private mandatoRepository: Repository<Mandato>,
  ) {}

  async findAll() {
    return await this.mandatoRepository.find({
      relations: ['cliente'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const mandato = await this.mandatoRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!mandato) {
      throw new NotFoundException(`Mandato con ID ${id} non trovato`);
    }

    return mandato;
  }

  async create(createMandatoDto: CreateMandatoDto) {
    const mandato = this.mandatoRepository.create(createMandatoDto);
    return await this.mandatoRepository.save(mandato);
  }

  async update(id: number, updateMandatoDto: UpdateMandatoDto) {
    const mandato = await this.findOne(id);
    Object.assign(mandato, updateMandatoDto);
    return await this.mandatoRepository.save(mandato);
  }

  async remove(id: number) {
    const mandato = await this.findOne(id);
    await this.mandatoRepository.remove(mandato);
    return { message: 'Mandato eliminato con successo' };
  }
}

