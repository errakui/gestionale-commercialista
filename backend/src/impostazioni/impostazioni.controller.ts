import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImpostazioniService } from './impostazioni.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';

@Controller('api/impostazioni')
// @UseGuards(JwtAuthGuard) // TEMP DISABLED
export class ImpostazioniController {
  constructor(private readonly impostazioniService: ImpostazioniService) {}

  // Generali
  @Get('generali')
  async getGeneralSettings() {
    return await this.impostazioniService.getGeneralSettings();
  }

  // Template Scadenze
  @Get('template-scadenze')
  async findAllTemplates() {
    return await this.impostazioniService.findAllTemplates();
  }

  @Get('template-scadenze/:id')
  async findOneTemplate(@Param('id', ParseIntPipe) id: number) {
    return await this.impostazioniService.findOneTemplate(id);
  }

  @Post('template-scadenze')
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return await this.impostazioniService.createTemplate(createTemplateDto);
  }

  @Put('template-scadenze/:id')
  async updateTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemplateDto: UpdateTemplateDto
  ) {
    return await this.impostazioniService.updateTemplate(id, updateTemplateDto);
  }

  @Delete('template-scadenze/:id')
  async removeTemplate(@Param('id', ParseIntPipe) id: number) {
    return await this.impostazioniService.removeTemplate(id);
  }

  // Categorie
  @Get('categorie')
  async findAllCategorie() {
    return await this.impostazioniService.findAllCategorie();
  }

  @Get('categorie/:id')
  async findOneCategoria(@Param('id', ParseIntPipe) id: number) {
    return await this.impostazioniService.findOneCategoria(id);
  }

  @Post('categorie')
  async createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
    return await this.impostazioniService.createCategoria(createCategoriaDto);
  }

  @Put('categorie/:id')
  async updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto
  ) {
    return await this.impostazioniService.updateCategoria(id, updateCategoriaDto);
  }

  @Delete('categorie/:id')
  async removeCategoria(@Param('id', ParseIntPipe) id: number) {
    return await this.impostazioniService.removeCategoria(id);
  }
}

