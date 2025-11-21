import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateScadenza } from '../entities/template-scadenza.entity';
import { CategoriaMovimento } from '../entities/categoria-movimento.entity';
import { ImpostazioniGenerali } from '../entities/impostazioni-generali.entity';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';

@Injectable()
export class ImpostazioniService {
  constructor(
    @InjectRepository(TemplateScadenza)
    private templateRepository: Repository<TemplateScadenza>,
    @InjectRepository(CategoriaMovimento)
    private categoriaRepository: Repository<CategoriaMovimento>,
    @InjectRepository(ImpostazioniGenerali)
    private impostazioniRepository: Repository<ImpostazioniGenerali>,
  ) {}

  // Template Scadenze
  async findAllTemplates() {
    return await this.templateRepository.find({
      order: { codiceTemplate: 'ASC' },
    });
  }

  async findOneTemplate(id: number) {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template con ID ${id} non trovato`);
    }
    return template;
  }

  async createTemplate(createTemplateDto: CreateTemplateDto) {
    const template = this.templateRepository.create(createTemplateDto);
    return await this.templateRepository.save(template);
  }

  async updateTemplate(id: number, updateTemplateDto: UpdateTemplateDto) {
    const template = await this.findOneTemplate(id);
    Object.assign(template, updateTemplateDto);
    return await this.templateRepository.save(template);
  }

  async removeTemplate(id: number) {
    const template = await this.findOneTemplate(id);
    await this.templateRepository.remove(template);
    return { message: 'Template eliminato con successo' };
  }

  // Categorie Movimento
  async findAllCategorie() {
    return await this.categoriaRepository.find({
      where: { attiva: true },
      order: { nome: 'ASC' },
    });
  }

  async findOneCategoria(id: number) {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria con ID ${id} non trovata`);
    }
    return categoria;
  }

  async createCategoria(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async updateCategoria(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOneCategoria(id);
    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async removeCategoria(id: number) {
    const categoria = await this.findOneCategoria(id);
    categoria.attiva = false;
    return await this.categoriaRepository.save(categoria);
  }

  // Impostazioni generali
  async getGeneralSettings() {
    // Prendi sempre il primo record (ce ne dovrebbe essere solo uno)
    let settings = await this.impostazioniRepository.findOne({ where: { id: 1 } });
    
    // Se non esiste, crealo con valori di default
    if (!settings) {
      settings = this.impostazioniRepository.create({
        nomeStudio: 'Studio Commercialista',
        timezone: 'Europe/Rome',
        formatoData: 'DD/MM/YYYY',
        valuta: 'EUR',
        giorniScadenzeImminenti: 7,
        emailNotifiche: null,
        notificheEmail: true,
        generaScadenzeAutomatiche: true,
      });
      settings = await this.impostazioniRepository.save(settings);
    }
    
    return settings;
  }

  async updateGeneralSettings(data: Partial<ImpostazioniGenerali>) {
    let settings = await this.impostazioniRepository.findOne({ where: { id: 1 } });
    
    if (!settings) {
      // Crea se non esiste
      settings = this.impostazioniRepository.create(data);
    } else {
      // Aggiorna
      Object.assign(settings, data);
    }
    
    return await this.impostazioniRepository.save(settings);
  }
}

